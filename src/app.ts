import express, { Application, Request, Response } from "express";
import { booksRouters } from "./app/controllers/book.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

export default app;
