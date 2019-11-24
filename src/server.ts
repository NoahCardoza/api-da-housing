import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Routes
import ListingRouter from "./controllers/Listing";
import UserRouter from "./controllers/User";
// Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use("/", UserRouter);
app.use("/", ListingRouter);

app.get("/", (_, res) => res.send("Index route for API-DA-HOUSING"));

app.listen(process.env.PORT || 3000, () => console.log("service started."));

export default app;
