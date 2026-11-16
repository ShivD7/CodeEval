# CodeEval

CodeEval is the Centennial CVI Computer Science Club's competitive programming practice site. It includes a rotating Problem of the Week, a searchable problem library, a club contest collection, and a Monaco editor with Judge0 grading.

## Run locally

From the repository root, install the backend dependencies and start Flask. Set `JUDGE0_API_KEY` in `backend/.env` for real grading. The previous `api_key` setting still works.

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
.\.venv\Scripts\python.exe backend/application.py
```

In another terminal, start the frontend and open [http://localhost:3000/CodeEval/](http://localhost:3000/CodeEval/).

```powershell
cd frontend/code-eval
npm ci
npm run dev
```

Development sends grading requests to `http://127.0.0.1:3001`. Production builds default to the existing Render backend. To use another backend, set `VITE_API_URL` to its base URL before building or starting Vite.

## Account data

Drafts are autosaved on the current browser by account, problem, and language. Verified accounts save submitted source, verdicts, timestamps, and test counts in Cloud Firestore. Use the Submissions page to reopen saved code, including on another device. Grades in this private history are written by the app client and are suitable for personal progress.

To exercise sign-in and submission history locally without production writes, start the Firebase emulators from the repository root with Firebase CLI and Java installed.

```powershell
firebase emulators:start --only auth,firestore --project demo-codeeval
```

Before running the Vite dev server, set `$env:VITE_FIREBASE_EMULATORS = '1'` in that terminal. Verify your test account using the verification URL printed by the Auth emulator. Emulator mode applies only to Vite development.

For the live app, create the default Cloud Firestore database if needed and publish the rules from `firestore.rules` to the Firebase project. If the project already has rules for other collections, merge the submission rule into the existing ruleset.

## Add a problem

1. Add public metadata and examples to `backend/catalog.json`. Keep IDs stable since routes, drafts, and submissions refer to them. Use the `Club Contest` group to include a problem on the contest page.
2. Add private tests under the same ID in `backend/hidden-cases.json`. Each entry has string `input` and `output` fields. Inputs must differ from the problem's samples and other hidden tests.
3. Optionally add the ID to the weekly rotation. It rotates every Monday in the club's Toronto time zone.
4. Run the backend tests and build the frontend.

```powershell
.\.venv\Scripts\python.exe -B -m unittest discover -s backend -v
npm --prefix frontend/code-eval run lint
npm --prefix frontend/code-eval run build
```

Ship the Flask backend before publishing the frontend. The backend supports the previous frontend's grading format during the rollout. The frontend build includes a GitHub Pages fallback for refreshing direct problem and submission links.
