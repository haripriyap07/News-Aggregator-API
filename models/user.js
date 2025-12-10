const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    verified: {
      type: Boolean,
      default: false
    },

    interests: {
      type: [String],
      default: []
    },

    preferredSources: {
      type: [String],
      default: []
    },

    keywordFilters: {
      include: { type: [String], default: [] },
      exclude: { type: [String], default: [] }
    },

    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
