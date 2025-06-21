import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>(
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
    },
    copies: {
      type: Number,
      required: [true, "Copies are Required"],
      min: [0, "Copies must be positive counts"],
    },
    available: {
      type: Boolean,
    },
  },
  { timestamps: true, versionKey: false }
);

bookSchema.pre("save", function (next) {
  if (this.copies === 0) {
    this.available = false;
  } else {
    this.available = true;
  }
  next();
});

export const Book = model<IBook>("Book", bookSchema);
