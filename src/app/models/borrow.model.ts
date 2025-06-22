import { model, Schema } from "mongoose";
import { Book } from "./book.model";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: Book,
      required: [true, "Book Id is required."]
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity at least 1 item"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required."],
    },
  },
  { timestamps: true, versionKey: false }
);

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
