from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import base64
from dotenv import load_dotenv
import os
import readFile

def configure():
    load_dotenv()

languages = {
    "cpp":54,
    "python": 71,
    "java":91,
    "javascript":102
}

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (important for React dev server)
configure()
def getLanguages():
    url = "https://judge0-ce.p.rapidapi.com/languages"

    headers = {
        "x-rapidapi-key": os.getenv('api_key'),
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)

    print(response.json())

def getStatus():
    url = "https://judge0-ce.p.rapidapi.com/statuses"

    headers = {
        "x-rapidapi-key": os.getenv('api_key'),
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)

    print(response.json())

def getToken(sourceCode, language, stdin, expected_output):
    

    url = "https://judge0-ce.p.rapidapi.com/submissions"

    querystring = {"base64_encoded":"true","wait":"false","fields":"*"}

    payload = {
        "language_id": languages[language],
        "source_code": sourceCode,
        "stdin": base64.b64encode(stdin.encode()).decode(),
        "expected_output": base64.b64encode(expected_output.encode()).decode()
    }
    headers = {
        "x-rapidapi-key": os.getenv('api_key'),
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers, params=querystring)
    print(response)
    return response.json()['token']

def getOutput(token):
    url = "https://judge0-ce.p.rapidapi.com/submissions/" + token

    querystring = {"base64_encoded":"true","fields":"*"}

    headers = {
        "x-rapidapi-key": os.getenv('api_key'),
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    print(response.json())
    return response.json()

@app.route('/execute', methods=['POST', 'GET'])
def execute_code():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', '')
    path = data.get('path', '')
    # For now, just return a dummy output
    testCases = readFile.read_file(path)
    testcaseCount = 1
    outputString = ''
    for testcase in testCases:
        token = getToken(code, language, testcase[0], testcase[1])
        output = ''
        while True:
            output = getOutput(token)
            if (output['status_id'] == 1 or output['status_id'] == 2):
                time.sleep(1)
            elif (output['status_id'] == 3):
                outputString += "\nTestcase " + str(testcaseCount) + ": Accepted :)"
                break
            elif (output['status_id'] == 4):
                outputString += "\nTestcase " + str(testcaseCount) + ": Rejected :("
                break
            elif (output['status_id'] == 5):
                outputString += "\nTestcase " + str(testcaseCount)+ ": Time Limit Exceeded"
                break
            elif (output['status_id'] == 6):
                outputString += "\nTestcase " + str(testcaseCount) + ": Compilation Error"
                break
            elif (output['status_id'] == 6 or output['status_id'] == 7 
                or output['status_id'] == 8 or output['status_id'] == 9
                or output['status_id'] == 10 or output['status_id'] == 11
                or output['status_id'] == 12 or output['status_id'] == 13):
                outputString += "\nTestcase "+ str(testcaseCount)+ ": Runtime Error"
                break
        testcaseCount += 1
    return jsonify({"output": outputString})


if __name__ == '__main__':
    app.run(debug=True, port=3001)
