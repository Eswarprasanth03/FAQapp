const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    type: Map,  // Use Map to store translations dynamically
    of: {
      question: String,  // Translated question
      answer: String,    // Translated answer
    },
  },
});

const FAQ = mongoose.model("FAQ", FAQSchema);
module.exports = FAQ;
