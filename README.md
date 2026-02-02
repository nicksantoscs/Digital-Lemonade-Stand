# Digital Lemonade Stand

A full-stack digital lemonade stand.

## Installation & Setup

This project is organized as a monorepo with `backend` and `frontend` directories.

### Prerequisites
* Node.js (v18+)
* npm

### Step 1: Backend setup
1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
* Ensure that a `.env` file exists in the backend directory. 
* If not, create one with the following content:

```env
DATABASE_URL="file:./dev.db"
```

4. Initialize the database (migrations and seeding):
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the server:
```bash
npm run dev
```
*Server will be running on `http://localhost:3001`*

### Step 2: Frontend setup
1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm run dev
```
*Client will be running on `http://localhost:5173`*

---

## Assumptions & Decisions Made
1. There is **unlimited inventory** for this MVP (no stock decrement logic).
2. An order should allow for the purchase of **multiple beverages**.
3. **Price calculations happen strictly on the backend**. The frontend displays prices for UX, but the API recalculates the total based on the database values to prevent client-side tampering. 

---

## Technologies Used

### Backend
* Node.js and Express
* TypeScript
* Prisma ORM (SQLite):
    * **SQLite** was selected for a zero-configuration setup, allowing the application to run immediately without requiring external servers or complex environment dependencies.
    * **Prisma** was chosen for end-to-end type safety, ensuring my backend code is always in sync with the database schema.
* Zod: Used for runtime request validation. This guarantees that incoming payloads are validated before reaching the database in case they fail.

### Frontend
* React (Vite)
* TypeScript
* Axios: Handles HTTP requests with cleaner syntax than the native Fetch API.