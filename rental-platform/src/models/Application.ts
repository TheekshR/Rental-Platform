import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    employmentStatus: {
      type: String,
      required: true,
    },
    annualIncome: {
      type: Number,
      required: true,
    },
    moveInDate: {
      type: Date,
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    propertyPrice: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Under Review", "Approved", "Rejected"],
      default: "Under Review",
    },
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Application =
  models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;
