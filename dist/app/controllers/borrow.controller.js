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
exports.borrowRouters = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouters = express_1.default.Router();
exports.borrowRouters.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        if (!bookId || typeof quantity !== "number" || quantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid book ID or quantity",
            });
            return;
        }
        const findBook = yield book_model_1.Book.findById(bookId);
        if (!findBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        if (findBook.copies < quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
            return;
        }
        const borrow = new borrow_model_1.Borrow({ book: bookId, quantity, dueDate });
        yield borrow.save();
        yield book_model_1.Book.updateAvailable(bookId, quantity);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
exports.borrowRouters.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowsSummary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowsSummary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
