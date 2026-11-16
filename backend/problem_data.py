import json
from pathlib import Path
import re


DATA_DIR = Path(__file__).resolve().parent


def load_json(filename):
    with (DATA_DIR / filename).open(encoding="utf-8") as file:
        return json.load(file)


def validate_cases(problem_id, cases, allowed_keys, seen_inputs):
    if not isinstance(cases, list) or not cases:
        raise ValueError(f"{problem_id}: expected a nonempty list of test cases")

    for case in cases:
        if (
            not isinstance(case, dict)
            or not {"input", "output"} <= case.keys() <= allowed_keys
            or not all(isinstance(value, str) for value in case.values())
            or not case["input"].strip()
            or not case["output"].strip()
        ):
            raise ValueError(f"{problem_id}: malformed test case")

        normalized_input = case["input"].rstrip("\n")
        if normalized_input in seen_inputs:
            raise ValueError(f"{problem_id}: duplicate test case input")
        seen_inputs.add(normalized_input)


def validate_catalog(catalog, hidden_cases):
    problems = {}
    for problem in catalog["problems"]:
        problem_id = problem["id"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", problem_id) or problem_id in problems:
            raise ValueError(f"Invalid or duplicate problem ID: {problem_id}")
        problems[problem_id] = problem

    if set(problems) != set(hidden_cases):
        raise ValueError("Every catalog problem must have its own hidden test cases")

    rotation = catalog["rotation"]["problemIds"]
    if not rotation or len(set(rotation)) != len(rotation) or not set(rotation) <= problems.keys():
        raise ValueError("Invalid Problem of the Week rotation")

    for problem_id, problem in problems.items():
        seen_inputs = set()
        validate_cases(problem_id, problem["samples"], {"input", "output", "explanation"}, seen_inputs)
        validate_cases(problem_id, hidden_cases[problem_id], {"input", "output"}, seen_inputs)

    return problems


HIDDEN_CASES = load_json("hidden-cases.json")
PROBLEMS = validate_catalog(load_json("catalog.json"), HIDDEN_CASES)
