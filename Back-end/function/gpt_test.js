const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask-gpt4", async (req, res) => {
  const ingredients = req.body.ingredients; // 프롬프트 대신 식재료 목록을 받음
  const prompt = `나는 식재료품 ${ingredients.join(
    ", "
  )}을 갖고있어. 이걸로 만들 수 있는 요리를 추천해줘. 그리고 그 요리를 만드는데 필요한 추가적인 재료를 알려줘. 마지막으로 레시피를 알려줘.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // 모델 이름을 gpt-3.5-turbo로 변경
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000, // 필요한 경우 토큰 수 조정
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
