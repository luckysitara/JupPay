import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import merchantRoutes from "./routes/merchantRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

app.use("/api/merchants", merchantRoutes)
app.use("/api/payments", paymentRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

