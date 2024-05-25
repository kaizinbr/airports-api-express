import express from "express";
import morgan from "morgan";
import router from "./routes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan("tiny"));

app.use(express.static("public"));

app.use(router);

app.listen(PORT, () => console.log("Rodando 😈 !!!!"));
