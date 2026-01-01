import express from "express";
import router from "./routers/index";
import cors from "cors";
import { envChecker } from "./utils/envChecker";
import { healthChecker } from "./controllers/healthControllers";
import { errorHandler } from "./handlers/errorHandler";
import cookieParser from "cookie-parser";
import passport from "./config/passport";

envChecker();

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL! as string],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.set("trust proxy", 1);

app.use("/api/v1", router);
app.use("/health", healthChecker);
app.use(errorHandler);

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Express server running on port: ${process.env.HTTP_PORT}`);
});
