import React, { useState } from "react";

function GPT() {
  // 컴포넌트 이름을 GPT로 변경
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/ask-gpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleSubmit}>Ask GPT-4</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default GPT; // 올바르게 내보내기
