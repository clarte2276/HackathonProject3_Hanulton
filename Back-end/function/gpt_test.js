const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask-gpt4", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 환경변수에서 API 키 가져오기
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.choices[0].text.trim());
  } catch (error) {
    console.error(
      "Error fetching from OpenAI:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send(error.toString());
  }
});

module.exports = router;
