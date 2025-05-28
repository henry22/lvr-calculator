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

### API Documentation (Swagger)

Interactive API docs are available at:

```
http://localhost:3001/api-docs
```

This includes documentation and live testing for all endpoints:

- `POST /api/lvr` — Calculate LVR
- `POST /api/validate` — Validate loan application input
- `GET /api/example` — Get an example loan application

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

### Testing the Backend

Run all tests (with coverage):

```sh
npm run test:coverage
```

- Uses Mocha, Chai, and Supertest for API tests
- Achieves 100% coverage for all business logic and routes
- Coverage report is available in the `coverage/` directory (open `coverage/index.html` for details)

### Example Test Cases

- Valid LVR calculation (with and without physical valuation)
- Validation errors for out-of-range or missing values
- Edge cases (e.g., property value zero, invalid types)
- Error handler coverage

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
- The UI is fully responsive and styled with Tailwind CSS.

---

## Build & Deploy

### Backend Deployment

#### Using Docker

The backend service is containerized using Docker. To build and run locally:

```sh
# Build the Docker image
docker build -t lvr-calculator-backend ./backend

# Run the container
docker run -p 3001:3001 lvr-calculator-backend
```

The container includes:

- Node.js 20 LTS runtime
- Production-optimized build
- Health check endpoint at `/health`
- Environment variable configuration
- Proper security practices (non-root user, minimal dependencies)

#### Deployment Options

1. **AWS Elastic Container Service (ECS)**

   - Push to Amazon ECR
   - Deploy as a service with Fargate
   - Auto-scaling and load balancing

2. **Google Cloud Run**

   - Serverless container deployment
   - Automatic scaling
   - Pay-per-use pricing

3. **Heroku with Container Support**
   - Simple deployment process
   - Built-in monitoring
   - Easy scaling

### Frontend Deployment

- Build with `npm run build` in the frontend directory
- Deploy the `dist/` folder to:
  - Vercel (recommended for React apps)
  - Netlify
  - AWS S3 + CloudFront
  - Any static hosting service

### Environment Configuration

For production deployment, set these environment variables:

```sh
# Backend
NODE_ENV=production
PORT=3001
# Add any API keys or secrets here

# Frontend
VITE_API_URL=https://your-backend-url.com
```

### CI/CD Setup (Recommended)

Set up a CI/CD pipeline to:

1. Run tests
2. Build Docker images
3. Push to container registry
4. Deploy to production

Example GitHub Actions workflow available in `.github/workflows/`

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
4. Explore and test the API interactively at `/api-docs`.

---

## Notes

- All business logic and validation are handled in the backend for security.
- The backend is fully tested with 100% coverage.
- The frontend is fully responsive and works down to 320px width.
- For further improvements, see the stretch goals above.
