import cors from "cors";
import express, { Application, Request, Response } from "express";
const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Ph tour management System",
  });
});

export default app;
