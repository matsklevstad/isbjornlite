import mongoose from "mongoose";

const beerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brewery: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Beer = mongoose.model("Beer", beerSchema);

export default Beer;
