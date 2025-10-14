import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";

dotenv.config();

const app = express();

connectToDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
