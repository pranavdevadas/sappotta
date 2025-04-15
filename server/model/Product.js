import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    category: {
       type: String, 
       required: true 
    },
    brand: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Brand", 
      required: true 
    },
    productImage: { 
      type: String, 
      required: true 
    },
    addedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  { timestamps: true }
);


const Product = mongoose.model("Product", ProductSchema);
export default Product;