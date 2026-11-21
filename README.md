## Alzikrayat MERN Edition

Full stack photo sharing application users can :
 register/log in
 upload 
 and browse the gallery and comment on the photos


## Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas with a database user and your IP address allowed in Network Access

## Setup

1. Clone the repository and open the project folder.
2. Install the server dependencies:
   ```
   cd server
   npm install
   ```
3. Create the `.env` file: copy `server/.env.example` to `server/.env` and fill in the values (see below).
4. Install the client dependencies:
   ```
   cd ../client
   npm install
   ```

## Environment variables

Set these in `server/.env`. The file is excluded from Git and must never be committed.

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, including the database name | `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/alzikrayat?retryWrites=true&w=majority` |
| `PORT` | Port the API runs on | `5000` |
| `JWT_SECRET` | Secret used to sign login tokens (any long random string) | `change-me-to-a-long-random-string` |

## Running the project locally

Open two terminals.

**Terminal 1: server (API)**
```
cd server
npm run dev
```
Expected output: `MongoDB connected` and `Server on http://localhost:5000`.

**Terminal 2: client (React app)**
```
cd client
npm run dev
```
Open http://localhost:5173 in your browser. The client proxies `/api` and `/uploads` requests to the server on port 5000, so both terminals must be running.
