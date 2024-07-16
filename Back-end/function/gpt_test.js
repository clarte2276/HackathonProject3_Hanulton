const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask-gpt4", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // ChatGPT 엔드포인트
      {
        model: "gpt-3.5-turbo", // 모델 이름
        messages: [{ role: "user", content: prompt }], // ChatGPT 포맷
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 환경변수에서 API 키 가져오기
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.choices[0].message.content.trim());
  } catch (error) {
    res.status(500).send(`Error fetching from OpenAI: ${error.response.data}`);
  }
});

module.exports = router;
