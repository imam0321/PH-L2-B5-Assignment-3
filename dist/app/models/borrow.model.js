"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: book_model_1.Book,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity at least 1 item"],
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
