import express, { Request, Response } from "express";

export const borrowRouters = express.Router();

borrowRouters.post("/", async (req:Request, res: Response) => {
  const body = req.body;
  
})
