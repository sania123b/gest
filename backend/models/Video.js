const mongoose = require("mongoose");

// Define Schema for video synchronization
const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },  // Unique Video ID
  creatorName: { type: String, required: true },  // Name of the content creator
  youtubeLink: { type: String, required: true },  // YouTube video link
  videoPath: { type: String, required: true },  // File path where the sign language video is stored
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
videoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
