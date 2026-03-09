import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url -> :status | on :date[web] | ip: :remote-addr | duration: :response-time ms",
  ),
);

// Routes

app.use("/order", orderRoutes);

// Start the server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
