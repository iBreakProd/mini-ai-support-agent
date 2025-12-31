import { Router } from "express";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import conversationsRouter from "./conversationsRouter";

const router: Router = Router();

router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/conversations", conversationsRouter);

export default router;
