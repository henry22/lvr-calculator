# LVR Calculator

A full-stack application to calculate the Loan-to-Value Ratio (LVR) for loan applications.

## Project Structure

- **backend/**: Node.js Express REST API for LVR calculation
- **frontend/**: React + Vite + Tailwind CSS UI for user interaction

---

## Backend: RESTful LVR Service

### Run the Backend

```sh
cd backend
npm install
npm start
```

The server will run on `http://localhost:3001` by default.

### Example API Request

Calculate LVR with curl:

```sh
curl -X POST http://localhost:3001/api/lvr \
  -H "Content-Type: application/json" \
  -d '{
    "loanAmount": 200000,
    "cashOutAmount": 50000,
    "estimatedPropertyValue": 400000,
    "propertyValuationPhysical": 380000
  }'
```

**Response:**

```json
{ "lvr": 0.6578947368421053 }
```

---

## Frontend: React Application

### Run the Frontend

```sh
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173` (or as shown in your terminal).

### Usage

- Fill in the form fields:
  - Estimated property value (required)
  - Loan amount (required)
  - Cash out amount (optional)
  - Physical property valuation (optional)
  - Property valuation evidence (required if physical valuation is provided)
- The LVR will be calculated and displayed.
- If LVR < 90%, the submit button is enabled.
- On submit, the data is POSTed to the backend.

---

## Testing the Backend

You can use [Jest](https://jestjs.io/) or [Mocha](https://mochajs.org/) for backend tests. Example test cases:

- Valid LVR calculation
- Validation errors for out-of-range values
- Edge cases (e.g., missing required fields)

---

## Build & Deploy (Stretch)

- **Frontend:** Build with `npm run build` and deploy the `dist/` folder to Vercel, Netlify, or any static host.
- **Backend:** Deploy to any Node.js host (Heroku, Render, AWS, etc.).
- **Docker:** You can containerize both parts for easy deployment.

---

## Authorization (Stretch)

To restrict access to the backend API, consider:

- **API Keys:** Require a key in the request header.
- **JWT Auth:** Use JSON Web Tokens for user authentication.
- **OAuth:** For more advanced scenarios.

---

## Example Interaction

1. Start both backend and frontend.
2. Open the frontend in your browser, fill out the form, and see the LVR calculated live.
3. Try submitting with different values to see validation and error handling in action.

---

## Notes

- All business logic and validation are handled in the backend for security.
- The frontend is fully responsive and works down to 320px width.
- For further improvements, see the stretch goals above.
