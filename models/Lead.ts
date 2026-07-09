import mongoose, { Schema, models, model } from "mongoose";

export interface ILead {
  placeId: string;
  name: string;
  niche: string;
  city: string;
  category?: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  websiteUrl?: string;
  hasWebsite: boolean;
  status: "new" | "contacted" | "responded" | "won" | "dead";
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    placeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    niche: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    category: String,
    address: String,
    phone: String,
    rating: Number,
    reviewCount: Number,
    websiteUrl: String,
    hasWebsite: { type: Boolean, required: true, default: false, index: true },
    status: {
      type: String,
      enum: ["new", "contacted", "responded", "won", "dead"],
      default: "new",
    },
    lat: Number,
    lng: Number,
    googleMapsUrl: String,
  },
  { timestamps: true }
);

export default models.Lead || model<ILead>("Lead", LeadSchema);
