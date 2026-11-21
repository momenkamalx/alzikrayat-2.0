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


## Project 4 (Bonus) : Real-Time WebSocket

**Selected track:** Real-Time WebSocket with [Socket.io](https://socket.io/docs/).



**Why this track:** commenting is the most interactive part of the app. With live updates, people looking at the same photo see each other's comments straight away, without reloading the page. It also fits the existing design cleanly: the REST API stays in charge of writing data (JWT check, Joi validation, MongoDB), and the socket only pushes the result to the people who are viewing that photo.



**How it works**

- The server (`server/socket.js`) runs Socket.io on the same HTTP server and port as Express (`server.js`).
- Each photo has its own room, `photo:<id>`:

| **Event**     | **Direction**    | **Payload**                | **Meaning**                           |
| ------------- | ---------------- | -------------------------- | ------------------------------------- |
| `photo:join`  | client -> server | photo id                   | start receiving that photo's comments |
| `photo:leave` | client -> server | photo id                   | stop receiving them                   |
| `comment:new` | server -> room   | comment (with author name) | a comment was just posted             |

- `POST /api/photos/:id/comments` saves the comment as before, then emits `comment:new` to that photo's room only.
- In the client, `src/socket.js` holds one shared connection. The photo page (`PhotoDetail.jsx`) joins the room in a `useEffect`, and its cleanup removes the listeners and leaves the room when you navigate away. It also joins again after a reconnect.
- The author of a comment receives it twice: once in the API response and once from the socket. Comments are matched by `_id`, so it only shows once.
- The navbar shows "Hi " when you are logged in and "Please Login" when you are not.

**Setup:** nothing new to configure. Run `npm install` in `server/` and `client/` (this adds `socket.io` and `socket.io-client`). There are no new environment variables: the socket uses the same `CLIENT_ORIGIN` for CORS. In development, Vite also proxies `/socket.io` (with WebSocket support) to the API.