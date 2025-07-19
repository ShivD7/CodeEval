from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import base64
from dotenv import load_dotenv
import os

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

def getToken(sourceCode, language):
    

    url = "https://judge0-ce.p.rapidapi.com/submissions"

    querystring = {"base64_encoded":"true","wait":"false","fields":"*"}

    payload = {
        "language_id": languages[language],
        "source_code": sourceCode,
        "stdin": "world"
    }
    headers = {
        "x-rapidapi-key": os.getenv('api_key'),
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers, params=querystring)
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
    print(f"Received code:\n{code}\nLanguage: {language}")
    # For now, just return a dummy output
    token = getToken(code, language)
    output = ''
    while True:
        output = getOutput(token)
        if (output['status_id'] == 1 or output['status_id'] == 2):
            time.sleep(1)
        elif (output['status_id'] == 3):
            break
        elif (output['status_id'] == 5):
            return jsonify({"output": f"Time Limit Exceeded"})
        elif (output['status_id'] == 6):
            return jsonify({"output": f"Compilation Error"})
        elif (output['status_id'] == 6 or output['status_id'] == 7 
              or output['status_id'] == 8 or output['status_id'] == 9
              or output['status_id'] == 10 or output['status_id'] == 11
              or output['status_id'] == 12 or output['status_id'] == 13):
            return jsonify({"output": f"Runtime Error"})
    encodedString =output['stdout']
    decodedString = base64.b64decode(encodedString).decode('utf-8')
    return jsonify({"output": f"Successfully received {language} code:\n{decodedString}"})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
