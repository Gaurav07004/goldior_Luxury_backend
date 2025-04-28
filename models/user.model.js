import { mongoose } from "mongoose";

// Define the address schema
const addressSchema = new mongoose.Schema({
  addressLine: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    match: [/.+@.+\..+/, "Please fill a valid email address"],
  },
  LastLoggedInAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  Addresses: [addressSchema],
  favourites: {
    type: [String],
  },
});

// Create the user model
const User = mongoose.model("User", userSchema);

export default User;
