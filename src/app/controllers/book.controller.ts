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

// add book
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
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

booksRouters.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: any = {};

    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
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
      date: book,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

booksRouters.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const updatedData = req.body;

    const book = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      date: book,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});
