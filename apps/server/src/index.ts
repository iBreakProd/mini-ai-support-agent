import express from "express";
import router from "./routers/index";
import cors from "cors";
import { envChecker } from "./utils/envChecker";
import { healthChecker } from "./controllers/healthControllers";
import { errorHandler } from "./handlers/errorHandler";

envChecker();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);
app.use("/health", healthChecker);
app.use(errorHandler);

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Express server running on port: ${process.env.HTTP_PORT}`);
});
