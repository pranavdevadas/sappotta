import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    brandName: { 
      type: String, 
      unique: true, 
      required: true 
    },
    brandLogo: { 
      type: String, 
      required: true 
    },
    categories: { 
      type: [String], 
      required: true 
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', BrandSchema);
export default Brand;