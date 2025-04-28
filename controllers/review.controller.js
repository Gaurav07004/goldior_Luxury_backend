import Review from "../models/review.model.js";
const addReview = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const {
        product_id,
        user_id,
        rating,
        parent,
        text,
        img_url,
        video_url,
        isRecommended,
    } = req.body;

    // Create a new review object with all required fields
    const newReview = new Review({
      product_id,
      user_id,
      rating,
      parent: parent || false, // Default to false if not provided
      text,
      img_url: img_url || null, // Default to null if not provided
      video_url: video_url || null, // Default to null if not provided
      isRecommended: isRecommended || false, // Default to false if not provided
    });

    // Save the new review in the database
    await newReview.save();

    // Respond with the saved review data
    res.status(201).json({
      id: newReview._id,
      product_id: newReview.product_id,
      user_id: newReview.user_id,
      rating: newReview.rating,
      parent: newReview.parent,
      text: newReview.text,
      createdAt: newReview.createdAt,
      img_url: newReview.img_url,
      video_url: newReview.video_url,
      isRecommended: newReview.isRecommended, // Include isRecommended in the response
    });
  } catch (error) {
    // Handle errors and send the response
    console.error("Error in review add controller: ", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};



const getReviewsByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;

    const reviews = await Review.find({ product_id })
      .populate("user_id") 
      .sort({ createdAt: -1 }); 

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews: ", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

export { addReview, getReviewsByProductId };
