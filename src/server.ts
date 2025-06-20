import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();
let server: Server;

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in .env");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose Connected!");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
