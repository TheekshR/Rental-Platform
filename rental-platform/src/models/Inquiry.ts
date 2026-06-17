import mongoose, { Schema, models } from "mongoose";

const InquirySchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    inquiryType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry =
  models.Inquiry || mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
