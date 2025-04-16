import Product from "../model/Product.js";
import User from "../model/User.js";
import Brand from "../model/Brand.js";

export const productController = {
  createProduct: async (req, res, next) => {
    try {
      const { productName, description, price, category, brand } = req.body;
      const addedBy = req.user.userId;
      const productImage = req.file ? req.file.path : null;

      console.log(addedBy);

      if (!productImage) {
        return res.status(400).json({ message: "Product image is required" });
      }

      const brandData = await Brand.findById(brand);
      if (!brandData) {
        return res.status(404).json({ message: "Brand not found" });
      }
      console.log(brandData.categories[0]);
      if (!brandData.categories[0].includes(category)) {
        return res
          .status(400)
          .json({ message: "Category does not belong to this brand" });
      }

      const newProduct = new Product({
        productName,
        description,
        price,
        category,
        brand,
        productImage,
        addedBy,
      });

      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      next(error);
    }
  },
  getAllProducts: async (req, res, next) => {
    try {
      const {
        category,
        brand,
        sortField = "price",
        sortOrder = "asc",
      } = req.query;

      const filters = {};
      if (category) filters.category = category;
      if (brand) filters.brand = brand;

      const sortOptions = {
        [sortField]: sortOrder === "desc" ? -1 : 1,
      };

      const products = await Product.find(filters)
        .populate("brand", "brandName")
        .populate("addedBy", "username email")
        .sort(sortOptions);

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  getUserProducts: async (req, res, next) => {
    try {
      const products = await Product.find({
        addedBy: req.user.userId,
      }).populate("brand", "brandName");
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const { productName, description, price, category, brand } = req.body;
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.addedBy.toString() !== req.user.userId.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this product" });
      }

      const brandData = await Brand.findById(brand || product.brand);
      if (!brandData)
        return res.status(404).json({ message: "Brand not found" });

      if (category && !brandData.categories.includes(category)) {
        return res
          .status(400)
          .json({ message: "Invalid category for selected brand" });
      }

      const productImage = req.file ? req.file.path : product.productImage;

      const updated = await Product.findByIdAndUpdate(
        productId,
        { productName, description, price, category, brand, productImage },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Product updated successfully", product: updated });
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.addedBy.toString() !== req.user.userId.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this product" });
      }

      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
