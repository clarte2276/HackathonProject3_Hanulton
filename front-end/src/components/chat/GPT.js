import React, { useState } from "react";

function GPT() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/ask-gpt4", {
      // 백엔드 서버의 포트 번호 변경
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

export default GPT;
