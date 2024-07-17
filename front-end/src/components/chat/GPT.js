import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GPT() {
  const [ingredients, setIngredients] = useState(""); // 식재료 입력 상태
  const [response, setResponse] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 추가

  const handleSubmit = async () => {
    const res = await fetch("/ask-gpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredients.split(",") }), // 콤마로 구분된 식재료 목록
    });
    const data = await res.json();
    setResponse(data);
  };

  const handleFindCookingFriend = () => {
    navigate("/boardcookfriend/process/new_Post", {
      state: { gptResponse: response },
    });
  };

  return (
    <div>
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter ingredients separated by commas"
      />
      <button onClick={handleSubmit}>Ask GPT-3.5</button>
      <p>Response: {response}</p>
      <button onClick={handleFindCookingFriend}>요리 친구 구하기</button>
    </div>
  );
}

export default GPT;
