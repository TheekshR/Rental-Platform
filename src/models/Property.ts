import mongoose, { Schema, models } from "mongoose";

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // Apartment, Studio, Office, Villa
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "Metro City",
    },
    available: {
      type: Boolean,
      default: true,
    },
    availableDays: {
      type: Number,
      default: 0,
    },
    beds: {
      type: Number,
      default: 0,
    },
    baths: {
      type: Number,
      default: 0,
    },
    sqft: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    dimensions: {
      bedrooms: { type: String },
      bathrooms: { type: String },
      totalArea: { type: String },
      ceilings: { type: String },
      balcony: { type: String },
    },
    utilities: {
      type: [String],
      default: [],
    },
    petPolicy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Property =
  models.Property || mongoose.model("Property", PropertySchema);

export default Property;