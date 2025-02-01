const FAQ = require("../model/faqModel");
const translate = require('google-translate-api-x');  // Use google-translate-api-x

// List of all available languages supported by Google Translate API
const allLanguages = [
  "af", "sq", "am", "ar", "hy", "bn", "bs", "ca", "hr", "cs", "da", "nl", "en", "eo", "et", "tl", "fi", "fr", "de", "el", "gu", "hi", "hu", "is", "id", "it", "ja", "jw", "ka", "kn", "km", "ko", "la", "lv", "mk", "ml", "mr", "my", "ne", "pl", "pt", "pa", "ro", "ru", "sr", "si", "sk", "sl", "es", "su", "sw", "sv", "ta", "te", "th", "tr", "uk", "ur", "vi", "cy", "xh", "yi", "zu"
];

// Create FAQ with dynamic translation for every language
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Dynamically translate the question and answer into all languages
    const translations = new Map();

    for (const lang of allLanguages) {
      try {
        const [questionTranslation, answerTranslation] = await Promise.all([
          translate(question, { to: lang }),
          translate(answer, { to: lang })
        ]);

        translations.set(lang, {
          question: questionTranslation.text,
          answer: answerTranslation.text
        });
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error.message);
        // If any language fails, continue translating the others
      }
    }

    // Create a new FAQ with translations for all supported languages
    const newFAQ = await FAQ.create({
      question,
      answer,
      translations,  // Store translations for all languages in a Map
    });

    res.status(201).json(newFAQ);  // Respond with the created FAQ
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: "Failed to create FAQ. Please try again." });
  }
};

// Get FAQs with language support (supports every language)
exports.getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";  // Default to English if no lang param is passed

    // Fetch all FAQs from the database
    const faqs = await FAQ.find();

    // Map the FAQs to return the translated content based on the selected language
    const translatedFAQs = faqs.map((faq) => {
      // Fallback to English if translation for the requested language doesn't exist
      const translation = faq.translations.get(lang) || faq.translations.get('en') || {};
      return {
        question: translation?.question || faq.question,
        answer: translation?.answer || faq.answer
      };
    });

    res.json(translatedFAQs);  // Respond with the FAQs in the selected language
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};
// const FAQ = require("../model/faqModel");
// const translate = require('google-translate-api-x');
// const Redis = require('ioredis');
// const crypto = require("crypto");

// const redis = new Redis();
// const allLanguages = ["af", "sq", "am", "ar", "hy", "bn", "bs", "ca", "hr", "cs", "da", "nl", "en", "eo", "et", "tl", "fi", "fr", "de", "el", "gu", "hi", "hu", "is", "id", "it", "ja", "jw", "ka", "kn", "km", "ko", "la", "lv", "mk", "ml", "mr", "my", "ne", "pl", "pt", "pa", "ro", "ru", "sr", "si", "sk", "sl", "es", "su", "sw", "sv", "ta", "te", "th", "tr", "uk", "ur", "vi", "cy", "xh", "yi", "zu"];

// exports.createFAQ = async (req, res) => {
//   try {
//     const { question, answer } = req.body;
    
//     const cacheKey = `faq_${crypto.createHash('md5').update(question + answer).digest('hex')}`;
//     const cachedTranslations = await redis.get(cacheKey);

//     if (cachedTranslations) {
//       return res.status(200).json(JSON.parse(cachedTranslations));
//     }

//     const translations = {};
//     for (const lang of allLanguages) {
//       try {
//         const [questionTranslation, answerTranslation] = await Promise.all([
//           translate(question, { to: lang }),
//           translate(answer, { to: lang })
//         ]);
//         translations[lang] = { question: questionTranslation.text, answer: answerTranslation.text };
//       } catch (error) {
//         console.error(`Error translating to ${lang}:`, error.message);
//       }
//     }

//     await redis.set(cacheKey, JSON.stringify(translations), 'EX', 86400);

//     const newFAQ = await FAQ.create({ question, answer, translations });
//     res.status(201).json(newFAQ);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create FAQ." });
//   }
// };

// exports.getFAQs = async (req, res) => {
//   try {
//     const lang = req.query.lang || "en";
//     const cacheKey = `faqs_${lang}`;
//     const cachedFAQs = await redis.get(cacheKey);

//     if (cachedFAQs) {
//       return res.status(200).json(JSON.parse(cachedFAQs));
//     }

//     const faqs = await FAQ.find();
//     const translatedFAQs = faqs.map((faq) => ({
//       question: faq.translations[lang]?.question || faq.question,
//       answer: faq.translations[lang]?.answer || faq.answer
//     }));

//     await redis.set(cacheKey, JSON.stringify(translatedFAQs), 'EX', 86400);
//     res.json(translatedFAQs);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };



