import express from "express";
import mysql, {Pool} from 'promise-mysql';

export const router = express.Router();
let datasource: Pool;

initPool();
async function initPool() {
    datasource = await mysql.createPool({
        host: 'localhost',
        port: 3306,
        database: 'dep10_microservices',
        user: 'root',
        password: '1234',
        connectionLimit: 10
    });
}

router.get('/', async (req, res)=>{

    console.log("get is working")
});

router.delete('/:bkISBN', async (req, res) => {
    console.log("delete")
    console.log(req.params.bkISBN)
    const result = await datasource.query('DELETE FROM book WHERE isbn=?',
        [req.params.bkISBN]);
    if (result.affectedRows === 1) res.sendStatus(204);
    else res.sendStatus(404);
});

type Book = {
    isbn: string, title: string
};

router.patch('/:bkISBN', async (req, res) => {
    console.log("patch")
    const book = req.body as Book;
    if (!book.title) {
        res.status(400).send("title is needed to update");
    } else {
        try {
            await datasource.query('UPDATE book SET title=? WHERE isbn=?', [book.title,req.params.bkISBN]);
            book.isbn = req.params.bkISBN;
            res.status(201).json(book);
        }catch (err: any){
            if (err.sqlState === '23000'){
                res.status(409).send("invalid data");
            }else{
                throw err;
            }
        }
    }
});