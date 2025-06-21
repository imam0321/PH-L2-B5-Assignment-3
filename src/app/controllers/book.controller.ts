import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { z } from "zod";

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

    const data = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});
