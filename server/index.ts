import express, { Request, Response, Express, NextFunction } from "express";
import morgan from "morgan";
import { startDB } from "./db/index";
import { routes } from "./routes/index";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path, { dirname } from "path";
import methodOveride from "method-override";
import errorHandler from "./utils/error";

// ENV
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
// http://localhost:3002/api/products

// Start app
const app: Express = express();
const port = 8888;
// cors
app.use(cookieParser());
app.use(cors(corsOptions));
// Connect database
startDB("mongodb://127.0.0.1:27017/course-typescript-poly");
// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Middeware
app.use(methodOveride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);
// Routes
routes(app);
// Server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
