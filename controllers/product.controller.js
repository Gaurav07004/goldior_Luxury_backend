import Product from '../models/product.model.js'; 
import mongoose from 'mongoose';

const addProduct = async (req, res) => {
  try {
    // Destructure all fields from the request body
    const {
      name,
      categories,
      keynotes, // Expecting an array of keynotes objects
      capacityInML, // Array of objects with quantity, stockLeft, price
      imgUrl,
      description,
      description2,
      description2heading,
      discountPercentage = 0, // Default discount to 0 if not provided
    } = req.body;

    // Validate discountPercentage range (between 0 and 100)
    if (discountPercentage < 0 || discountPercentage > 100) {
      return res
        .status(400)
        .json({ error: "Discount percentage must be between 0 and 100." });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      categories,
      keynotes, // Array of keynotes objects
      capacityInML, // Array of capacity objects (quantity, stockLeft, price)
      imgUrl,
      description,
      description2,
      description2heading,
      discountPercentage,
      noOfOrders: 0, // Initialize noOfOrders to 0
      createdAt: new Date(), // Set the createdAt date
      updatedAt: new Date(), // Set the updatedAt date
    });

    // Save the product to the database
    await newProduct.save();

    // Send back the saved product data in the response
    res.status(201).json({
      id: newProduct._id,
      name: newProduct.name,
      categories: newProduct.categories,
      keynotes: newProduct.keynotes,
      capacityInML: newProduct.capacityInML,
      imgUrl: newProduct.imgUrl,
      description: newProduct.description,
      description2: newProduct.description2,
      description2heading: newProduct.description2heading,
      discountPercentage: newProduct.discountPercentage,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt,
      noOfOrders: newProduct.noOfOrders, // Include noOfOrders field in response
    });
  } catch (error) {
    console.error("Error in product add controller: ", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};



const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 6; 
        const skip = (page - 1) * pageSize;

        const products = await Product.find()
            .skip(skip) 
            .limit(pageSize);

        const totalProducts = await Product.countDocuments();

        const totalPages = Math.ceil(totalProducts / pageSize);

        res.status(200).json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                pageSize,
            },
        });

    } catch (error) {
        console.error("Error fetching products: ", error.message);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};


const getMostOrderedProducts = async (req, res) => {
  try {
    // You can specify the number of most ordered products you want to return
    const limit = parseInt(req.query.limit) || 6; 
    // Fetch and sort products by noOfOrders in descending order
    const mostOrderedProducts = await Product.find()
      .sort({ noOfOrders: -1 }) // Sort by noOfOrders in descending order
      .limit(limit); // Limit the number of products returned

    res.status(200).json({
      products: mostOrderedProducts,
    });
  } catch (error) {
    console.error("Error fetching most ordered products: ", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

const getProductById = async (req, res) => {
  try {
    // Extract the product ID from the URL parameter
    const { productId } = req.params;

    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Fetch the product by its ID
    const product = await Product.findById(productId);

    // If product not found, return 404
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product details
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by ID: ", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};





export{ addProduct, getProducts, getMostOrderedProducts, getProductById};
