const express = require("express");
const { createFAQ, getFAQs } = require("../controllers/faqController");

const router = express.Router();

router.post("/faqs", createFAQ);
router.get("/faqs", getFAQs);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const faqController = require("../controllers/faqController");

// router.post("/faqs", faqController.createFAQ);
// router.get("/faqs", faqController.getFAQs);
// router.post("/faq", faqController.getFAQById);  // Fetch a single FAQ by ID in a given language

// module.exports = router;


