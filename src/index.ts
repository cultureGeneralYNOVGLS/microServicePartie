import express from 'express';
import gameRouter from './routes/game.router';
import categorieRouter from './routes/category.router';
import agentPartie from './routes/partie.agent.router';

const app = express();
const port = 3000; // default port to listen
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

// middleware used to parse incoming requests with JSON payloads
app.use(express.json())

// CORS
app.use(cors())

// API Routes
app.use('/api/game', gameRouter)
app.use('/api/category', categorieRouter)
app.use('/api/agent/game', agentPartie)

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
