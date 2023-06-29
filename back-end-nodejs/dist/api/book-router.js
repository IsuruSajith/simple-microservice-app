"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const promise_mysql_1 = __importDefault(require("promise-mysql"));
exports.router = express_1.default.Router();
let datasource;
initPool();
function initPool() {
    return __awaiter(this, void 0, void 0, function* () {
        datasource = yield promise_mysql_1.default.createPool({
            host: 'localhost',
            port: 3306,
            database: 'dep10_microservices',
            user: 'root',
            password: '1234',
            connectionLimit: 10
        });
    });
}
exports.router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get is working");
}));
exports.router.delete('/:bkISBN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("delete");
    console.log(req.params.bkISBN);
    const result = yield datasource.query('DELETE FROM book WHERE isbn=?', [req.params.bkISBN]);
    if (result.affectedRows === 1)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
exports.router.patch('/:bkISBN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("patch");
    const book = req.body;
    if (!book.title) {
        res.status(400).send("title is needed to update");
    }
    else {
        try {
            yield datasource.query('UPDATE book SET title=? WHERE isbn=?', [book.title, req.params.bkISBN]);
            book.isbn = req.params.bkISBN;
            res.status(201).json(book);
        }
        catch (err) {
            if (err.sqlState === '23000') {
                res.status(409).send("invalid data");
            }
            else {
                throw err;
            }
        }
    }
}));
