import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product", 
  },
  user_id: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5, 
  },
  parent: {
    type: Boolean,
    default: false, 
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  img_url: {
    type: String, 
    default: null, 
  },
  video_url: {
    type: String, 
    default: null, 
  },
  isRecommended: {
    type: Boolean
  }
});


const Review = model("Review", reviewSchema);

export default Review;
