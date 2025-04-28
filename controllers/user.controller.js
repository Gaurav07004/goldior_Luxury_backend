import User from "../models/user.model.js"; // Adjust the import based on your project structure

// Function to add an item to favourites
export const addToFavourite = async (req, res) => {
  const { userId, itemId } = req.body; // Assume userId and itemId are passed in the body

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if itemId already exists in favourites
    if (user.favourites.includes(itemId)) {
      return res.status(400).json({ error: "Item already in favourites" });
    }

    // Add itemId to favourites
    user.favourites.push(itemId);
    await user.save();

    res
      .status(200)
      .json({
        message: "Item added to favourites",
        favourites: user.favourites,
      });
  } catch (error) {
    console.error("Error adding to favourites:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get user's favourites
export const getFavourites = async (req, res) => {
  const { userId } = req.params; // userId is obtained from URL parameters

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error("Error retrieving favourites:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
