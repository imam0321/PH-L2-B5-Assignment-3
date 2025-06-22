import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { z } from "zod";

export const borrowRouters = express.Router();

const borrowZodSchema = z.object({
  book: z.string().nonempty("Book Id is required."),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  dueDate: z.string().nonempty("Due date is required."),
});

borrowRouters.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = borrowZodSchema.parse(req.body);

    if (!bookId || typeof quantity !== "number" || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid book ID or quantity",
      });
      return;
    }

    const findBook = await Book.findById(bookId);
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

    const borrow = new Borrow({ book: bookId, quantity, dueDate });
    await borrow.save();

    await Book.updateAvailable(bookId, quantity);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});

borrowRouters.get("/", async (req: Request, res: Response) => {
  try {
    const borrowsSummary = await Borrow.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});
