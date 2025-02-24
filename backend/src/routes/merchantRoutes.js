import express from "express"
import { registerMerchant, updateMerchantToken } from "../controllers/merchantController.js"

const router = express.Router()

router.post("/register", registerMerchant)
router.put("/update-token", updateMerchantToken)

export default router

