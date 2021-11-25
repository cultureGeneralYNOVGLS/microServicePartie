"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
/*
import usersRouter from './routes/users.router';
import loginRouter from './routes/login.router';
import booksRouter from './routes/books.router';
import commentsRouter from './routes/comments.router';
import cartsRouter from './routes/carts.router';
*/
const app = (0, express_1.default)();
const port = 3000; // default port to listen
const dotenv = require('dotenv');
dotenv.config();
// middleware used to parse incoming requests with JSON payloads
app.use(express_1.default.json());
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
