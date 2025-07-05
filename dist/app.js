"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://ph-l2-b5-assignment-3.vercel.app"],
    credentials: true,
}));
app.use("/api/books", book_controller_1.booksRouters);
app.use("/api/borrow", borrow_controller_1.borrowRouters);
app.get("/", (req, res) => {
    res.send("Welcome to Library Management App");
});
exports.default = app;
