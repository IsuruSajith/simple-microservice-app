import express, {json} from 'express';
import cors from 'cors';
import {router as bookRouter} from "./api/book-router";

const app = express();
app.use(json());
app.use(cors());
app.use('/app/api/v1/books', bookRouter);
app.listen(8080, () => console.log("Server has been started at 8080"));
