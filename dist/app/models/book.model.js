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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
    },
    author: {
        type: String,
        required: [true, "Author is Required"],
    },
    genre: {
        type: String,
        required: [true, "Genre is Required"],
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
    },
    isbn: {
        type: String,
        required: [true, "Isbn is Required and Unique"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    copies: {
        type: Number,
        required: [true, "Copies are Required"],
        min: [0, "Copies must be a positive number"],
    },
    available: {
        type: Boolean,
    },
}, { versionKey: false, timestamps: true });
bookSchema.statics.updateAvailable = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (!book)
            return;
        book.copies -= quantity;
        if ((book.copies === 0)) {
            book.available = false;
        }
        else {
            book.available = true;
        }
        yield book.save();
    });
};
bookSchema.pre("save", function (next) {
    if (this.copies === 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    next();
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
