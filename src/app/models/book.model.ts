import { model, Schema } from "mongoose";
import { IBook, IBookStaticMethod } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, IBookStaticMethod>(
  {
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
  },
  { versionKey: false, timestamps: true }
);

bookSchema.statics.updateAvailable = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) return;
  book.copies -= quantity;

  if ((book.copies === 0)) {
    book.available = false;
  } else {
    book.available = true;
  }
  await book.save();
};

bookSchema.pre("save", function (next) {
  if (this.copies === 0) {
    this.available = false;
  } else {
    this.available = true;
  }
  next();
});

export const Book = model<IBook, IBookStaticMethod>("Book", bookSchema);
