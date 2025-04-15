import Brand from "../model/Brand.js";

export const brandController = {
  createBrand: async (req, res, next) => {
    try {
      const { brandName, categories } = req.body;

      const exsistingBrand = await Brand.findOne({ brandName });
      if (exsistingBrand) {
        res.status(400);
        throw new Error("Brand Already exists");
      }

      const brandLogo = req.file ? req.file.path : null;

      if (!brandLogo) {
        return res.status(400).json({ message: "Brand logo is required" });
      }

      const newBrand = new Brand({
        brandName,
        brandLogo,
        categories,
      });

      await newBrand.save();

      res.status(201).json({ message: "Brand created successfully", brand: newBrand });
    } catch (error) {
      next(error);
    }
  },
  allBrands: async (req, res, next) => {
    try {
      const brands = await Brand.find();
      if (!brands.length) {
        return res.status(404).json({ message: "No brands found." });
      }

      res.status(200).json({ brands });
    } catch (error) {
      next(error);
    }
  },
};
