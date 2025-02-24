import express from "express"
import { createPayment, executeSwap, getPaymentStatus } from "../controllers/paymentController.js"

const router = express.Router()

router.post("/create", createPayment)
router.post("/execute-swap", executeSwap)
router.get("/status/:paymentId", getPaymentStatus)

export default router

