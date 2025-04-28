import Cart from "../models/cart.model.js";


const getCartByUserId = async (req, res) => {
  const { user_id } = req.body;

  try {
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Failed to fetch cart data" });
  }
};

const addToCart = async (req, res) => {
  const { user_id, item } = req.body;

  try {
    // Find the cart associated with the user_id
    let cart = await Cart.findOne({ user_id });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user_id, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (i) => i.imgUrl === item.imgUrl && i.bottle_size === item.bottle_size
    );

    if (existingItemIndex > -1) {
      // If the item exists, update the quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // If it doesn't exist, add the new item to the cart
      cart.items.push(item);
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export {addToCart, getCartByUserId};
