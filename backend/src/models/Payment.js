import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    inputToken: {
      type: String,
      required: true,
    },
    outputToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    swapTransaction: {
      type: String,
    },
  },
  { timestamps: true },
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment

