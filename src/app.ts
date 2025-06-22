import express, { Application, Request, Response } from "express";
import { booksRouters } from "./app/controllers/book.controller";
import { borrowRouters } from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRouters);
app.use("/api/borrow", borrowRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

export default app;
