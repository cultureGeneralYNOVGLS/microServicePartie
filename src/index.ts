import express from 'express';
/*
import usersRouter from './routes/users.router';
import loginRouter from './routes/login.router';
import booksRouter from './routes/books.router';
import commentsRouter from './routes/comments.router';
import cartsRouter from './routes/carts.router';
*/
import agentPartie from './routes/partie.agent.router';
import categorieRouter from './routes/category.router';
import gameRouter from './routes/game.router';

const app = express();
const port = 7510; // default port to listen
const dotenv = require('dotenv')
var cors = require('cors')


dotenv.config()

// middleware used to parse incoming requests with JSON payloads
app.use(express.json())
app.use(cors())

app.use('/agent/partie',agentPartie)
app.use('/category',categorieRouter)
app.use('/game',gameRouter)



app.get('/getkey', async (request, response) => {
    response.sendStatus(200);
})

/*

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/books', booksRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/carts', cartsRouter)

*/

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
