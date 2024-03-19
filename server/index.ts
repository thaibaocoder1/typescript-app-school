import express, { Express } from "express";
import morgan from "morgan";
import { startDB } from "./db/index";
import { routes } from "./routes/index";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import methodOveride from "method-override";
import errorHandler from "./utils/error";

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start app
const app: Express = express();
const port = 8888;
// Connect database
startDB("mongodb://127.0.0.1:27017/course-typescript-poly");
// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Middeware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(methodOveride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);
// Routes
routes(app);
// Server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
