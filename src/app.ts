import cors from "cors";
import express, { Application, Request, Response } from "express";
import { router } from "./routes";
const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Ph tour management System",
  });
});

export default app;
