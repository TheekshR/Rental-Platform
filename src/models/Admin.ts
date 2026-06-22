import mongoose, { Schema, models } from "mongoose";

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "manager", "team_member"],
      default: "team_member",
    },
    permissions: {
      manageProperties: {
        type: Boolean,
        default: false,
      },
      manageApplications: {
        type: Boolean,
        default: false,
      },
      viewInquiries: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Admin =
  models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
