import mongoose, { Schema, models } from "mongoose";

const AdminNotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "danger"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AdminNotification =
  models.AdminNotification || mongoose.model("AdminNotification", AdminNotificationSchema);

export default AdminNotification;
