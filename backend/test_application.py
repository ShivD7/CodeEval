import base64
from copy import deepcopy
import os
import unittest
from unittest.mock import Mock, patch

import requests

import application
from problem_data import HIDDEN_CASES, load_json, validate_catalog


class GradingTests(unittest.TestCase):
    def setUp(self):
        self.client = application.app.test_client()
        self.body = {
            "problemId": "pow1",
            "mode": "samples",
            "language": "python",
            "code": "# café\nprint('0 1')",
        }

    @patch("application.grade_cases")
    def test_samples_return_diagnostics_and_use_utf8(self, grade):
        grade.return_value = [
            {"verdict": "accepted", "output": "0 1\n", "diagnostic": "", "timeMs": 2},
            {"verdict": "wrong_answer", "output": "0 1\n", "diagnostic": "", "timeMs": 3},
        ]
        response = self.client.post("/execute", json=self.body)
        self.assertEqual(response.status_code, 200)
        result = response.get_json()
        self.assertEqual(result["verdict"], "wrong_answer")
        self.assertEqual(result["passed"], 1)
        self.assertEqual(result["cases"][0]["number"], 1)
        self.assertEqual(result["cases"][1]["timeMs"], 3)
        source, _, samples, include_details = grade.call_args.args
        self.assertEqual(base64.b64decode(source).decode(), self.body["code"])
        self.assertEqual(len(samples), 2)
        self.assertTrue(include_details)

    @patch("application.grade_cases")
    def test_submit_returns_only_summary(self, grade):
        def fake_grade(_source, _language, cases, include_details):
            self.assertFalse(include_details)
            self.assertGreater(len(cases), 2)
            return [{"verdict": "accepted", "output": "never-reveal"} for _ in cases]

        grade.side_effect = fake_grade
        result = self.client.post("/execute", json={**self.body, "mode": "submit"}).get_json()
        self.assertEqual(result, {
            "verdict": "accepted",
            "passed": 7,
            "total": 7,
            "hiddenPassed": 5,
            "hiddenTotal": 5,
        })

    @patch("application.grade_cases")
    def test_legacy_browser_receives_text_until_upgrade(self, grade):
        grade.return_value = [{"verdict": "runtime_error"}]
        response = self.client.post("/execute", json={
            "path": "/pow1",
            "language": "python",
            "code": application.encode("print(1)"),
        })
        self.assertEqual(response.get_json(), {"output": "Testcase 1: Runtime Error"})

    def test_invalid_requests(self):
        self.assertEqual(self.client.post("/execute", json=[]).status_code, 400)
        self.assertEqual(self.client.post("/execute", json={**self.body, "problemId": "missing"}).status_code, 404)
        self.assertEqual(self.client.post("/execute", json={**self.body, "language": []}).status_code, 400)
        self.assertEqual(self.client.post("/execute", json={**self.body, "code": " "}).status_code, 400)
        self.assertEqual(self.client.post("/execute", json={**self.body, "code": "x" * 60_001}).status_code, 413)

    @patch.dict(os.environ, {"JUDGE0_API_KEY": "fake"})
    @patch("application.requests.request", side_effect=requests.Timeout)
    def test_upstream_timeout_has_a_bounded_request_and_a_json_error(self, send):
        response = self.client.post("/execute", json=self.body)
        self.assertEqual(response.status_code, 504)
        self.assertIn("error", response.get_json())
        self.assertLessEqual(send.call_args.kwargs["timeout"], application.REQUEST_TIMEOUT_SECONDS)

    @patch.dict(os.environ, {"JUDGE0_API_KEY": "fake"})
    @patch("application.requests.request")
    def test_unknown_judge_status_terminates(self, send):
        def fake_response(method, _url, **_kwargs):
            result = {"token": "abc"} if method == "POST" else {"status_id": 99}
            return Mock(json=Mock(return_value=result))

        send.side_effect = fake_response
        response = self.client.post("/execute", json=self.body)
        self.assertEqual(response.status_code, 502)

    def test_malformed_fixture_and_duplicate_input_fail_validation(self):
        catalog = load_json("catalog.json")
        cases = deepcopy(HIDDEN_CASES)
        cases["contest1"][0]["extra"] = "bad"
        with self.assertRaisesRegex(ValueError, "malformed test case"):
            validate_catalog(catalog, cases)

        cases = deepcopy(HIDDEN_CASES)
        cases["contest3"].append(cases["contest3"][0])
        with self.assertRaisesRegex(ValueError, "duplicate test case"):
            validate_catalog(catalog, cases)


if __name__ == "__main__":
    unittest.main()
