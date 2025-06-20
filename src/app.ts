import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my server");
});

export default app;
