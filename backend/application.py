import base64
import binascii
from concurrent.futures import ThreadPoolExecutor
import os
import re
import time

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

from problem_data import HIDDEN_CASES, PROBLEMS


load_dotenv()
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 512 * 1024
CORS(app, resources={r"/execute": {"methods": ["POST"]}})

JUDGE_URL = "https://judge0-ce.p.rapidapi.com/submissions"
GRADING_TIMEOUT_SECONDS = 22
REQUEST_TIMEOUT_SECONDS = 4
MAX_SOURCE_BYTES = 60_000
LANGUAGES = {"cpp": 54, "python": 71, "java": 91, "javascript": 102}
VERDICTS = {
    3: "accepted",
    4: "wrong_answer",
    5: "time_limit_exceeded",
    6: "compilation_error",
    7: "runtime_error",
    8: "runtime_error",
    9: "runtime_error",
    10: "runtime_error",
    11: "runtime_error",
    12: "runtime_error",
    14: "runtime_error",
}
LEGACY_LABELS = {
    "accepted": "Accepted :)",
    "wrong_answer": "Rejected :(",
    "time_limit_exceeded": "Time Limit Exceeded",
    "compilation_error": "Compilation Error",
    "runtime_error": "Runtime Error",
}


class JudgeTimeout(Exception):
    pass


class JudgeUnavailable(Exception):
    pass


def encode(value):
    return base64.b64encode(value.encode("utf-8")).decode("ascii")


def decode(value):
    return base64.b64decode(value or "").decode("utf-8", errors="replace")


def with_newline(value):
    return value if value.endswith("\n") else value + "\n"


def remaining_time(deadline):
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise JudgeTimeout
    return remaining


def judge_request(method, url, deadline, **kwargs):
    timeout = min(remaining_time(deadline), REQUEST_TIMEOUT_SECONDS)
    try:
        response = requests.request(method, url, timeout=timeout, **kwargs)
        response.raise_for_status()
        result = response.json()
        if not isinstance(result, dict):
            raise ValueError("Expected an object")
    except requests.Timeout as error:
        raise JudgeTimeout from error
    except (requests.RequestException, ValueError) as error:
        raise JudgeUnavailable from error

    remaining_time(deadline)
    return result


def grade_case(source, language, case, headers, deadline, include_details):
    submission = judge_request(
        "POST",
        JUDGE_URL,
        deadline,
        headers=headers,
        params={"base64_encoded": "true", "wait": "false"},
        json={
            "language_id": language,
            "source_code": source,
            "stdin": encode(with_newline(case["input"])),
            "expected_output": encode(with_newline(case["output"])),
        },
    )
    token = submission.get("token")
    if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9_-]+", token):
        raise JudgeUnavailable

    while True:
        result = judge_request(
            "GET",
            f"{JUDGE_URL}/{token}",
            deadline,
            headers=headers,
            params={
                "base64_encoded": "true",
                "fields": "status_id,stdout,stderr,compile_output,time" if include_details else "status_id",
            },
        )
        status = result.get("status_id")
        if status not in (1, 2):
            break
        time.sleep(min(0.35, remaining_time(deadline)))

    verdict = VERDICTS.get(status) if isinstance(status, int) else None
    if verdict is None:
        raise JudgeUnavailable

    if not include_details:
        return {"verdict": verdict}

    try:
        return {
            "verdict": verdict,
            "output": decode(result.get("stdout")),
            "diagnostic": decode(result.get("compile_output") or result.get("stderr")),
            "timeMs": round(float(result["time"]) * 1000) if result.get("time") else None,
        }
    except (TypeError, ValueError, OverflowError) as error:
        raise JudgeUnavailable from error


def grade_cases(source, language, cases, include_details):
    api_key = os.getenv("JUDGE0_API_KEY") or os.getenv("api_key")
    if not api_key:
        raise JudgeUnavailable

    deadline = time.monotonic() + GRADING_TIMEOUT_SECONDS
    headers = {"x-rapidapi-key": api_key, "x-rapidapi-host": "judge0-ce.p.rapidapi.com"}
    with ThreadPoolExecutor(max_workers=min(len(cases), 4)) as executor:
        jobs = [
            executor.submit(grade_case, source, language, case, headers, deadline, include_details)
            for case in cases
        ]
        try:
            return [job.result() for job in jobs]
        finally:
            for job in jobs:
                job.cancel()


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify(error="The submission is too large."), 413


@app.post("/execute")
def execute_code():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Send a JSON object."), 400

    problem_id = data.get("problemId")
    mode = data.get("mode")
    code = data.get("code")
    language = data.get("language")

    # Keep the previous GitHub Pages build working during a backend-first rollout.
    legacy = "path" in data and "problemId" not in data
    if legacy:
        path = data["path"]
        problem_id = path.removeprefix("/") if isinstance(path, str) else None
        mode = "submit"
        try:
            code = base64.b64decode(code, validate=True).decode("latin-1")
        except (TypeError, ValueError, binascii.Error):
            return jsonify(error="The submission code is invalid."), 400

    if not isinstance(problem_id, str) or problem_id not in PROBLEMS:
        return jsonify(error="Problem not found."), 404
    if mode not in ("samples", "submit") or not isinstance(language, str) or language not in LANGUAGES:
        return jsonify(error="Choose a supported language and grading mode."), 400
    if not isinstance(code, str) or not code.strip():
        return jsonify(error="Enter some code before running it."), 400
    try:
        if len(code.encode("utf-8")) > MAX_SOURCE_BYTES:
            return jsonify(error="The submission is too large."), 413
        source = encode(code)
    except UnicodeEncodeError:
        return jsonify(error="The submission code is invalid."), 400

    samples = PROBLEMS[problem_id]["samples"]
    cases = samples if mode == "samples" else samples + HIDDEN_CASES[problem_id]
    try:
        results = grade_cases(source, LANGUAGES[language], cases, mode == "samples")
    except JudgeTimeout:
        return jsonify(error="The judge took too long to respond. Please try again."), 504
    except JudgeUnavailable:
        return jsonify(error="The judge is unavailable. Please try again."), 502

    passed = sum(case["verdict"] == "accepted" for case in results)
    verdict = next((case["verdict"] for case in results if case["verdict"] != "accepted"), "accepted")
    if legacy:
        messages = [f"Testcase {index}: {LEGACY_LABELS[case['verdict']]}" for index, case in enumerate(results, 1)]
        return jsonify(output="\n".join(messages))

    summary = {"verdict": verdict, "passed": passed, "total": len(results)}
    if mode == "samples":
        summary["cases"] = [{"number": index, **case} for index, case in enumerate(results, 1)]
    else:
        hidden_results = results[len(samples):]
        summary["hiddenPassed"] = sum(case["verdict"] == "accepted" for case in hidden_results)
        summary["hiddenTotal"] = len(hidden_results)
    return jsonify(summary)


if __name__ == "__main__":
    app.run(port=3001)
