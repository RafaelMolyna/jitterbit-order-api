// src/server.ts
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "Modern TS API running cleanly!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
