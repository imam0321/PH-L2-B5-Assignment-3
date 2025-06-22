import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { date, z } from "zod";

export const booksRouters = express.Router();

const createBookSchema = z.object({
  title: z.string().nonempty("Title is required"),
  author: z.string().nonempty("Author is required"),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string().nonempty("Isbn is Required and Unique"),
  description: z.string().optional(),
  copies: z.number().min(0, "Copies must be a positive number"),
});

booksRouters.post("/", async (req: Request, res: Response) => {
  try {
    const body = await createBookSchema.parseAsync(req.body);

    const book = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});

booksRouters.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = 10,
    } = req.query;

    const query: any = {};

    if (filter) {
      query.genre = filter;
    }

    const sortOrder = sort === "asc" ? 1 : -1;
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1));

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
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

booksRouters.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const book = await Book.findById(id);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
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

// Update book
booksRouters.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const updatedData = req.body;

    if (typeof updatedData.copies === "number") {
      updatedData.available = updatedData.copies > 0;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
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

booksRouters.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    await Book.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
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
