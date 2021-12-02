import express from 'express';
import agentPartie from './routes/partie.agent.router';
import categorieRouter from './routes/category.router';
import gameRouter from './routes/game.router';

const app = express();
const port = 3000; // default port to listen
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()

// middleware used to parse incoming requests with JSON payloads
app.use(express.json())
app.use(cors())

// API Routes
app.use('/agent/game',agentPartie)
app.use('/category',categorieRouter)
app.use('/game',gameRouter)

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
