import { Router } from "express";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import conversationsRouter from "./conversationsRouter";
import usersRouter from "./usersRouters";

const router: Router = Router();

router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/conversations", conversationsRouter);
router.use("/users", usersRouter);

export default router;
