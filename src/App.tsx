// src/App.tsx
import React, { useState } from "react";
import WordCard from "./components/WordCard";
import type { Word } from "./types/word";
import vocabularyData from "./data/vocabulary.json";

const vocabulary: { [key: string]: Word[] } = vocabularyData;

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-06-09"));

  const currentWords = vocabulary[formatDate(currentDate)] || [];

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    // ↓↓↓ 스타일이 훨씬 단순해졌습니다. 중앙 정렬은 이제 index.css가 담당합니다. ↓↓↓
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <header style={{ textAlign: "center", padding: "20px 0" }}>
        <h1>오늘의 영단어</h1>
        <div style={{ margin: "20px 0" }}>
          <button onClick={handlePrevDay}>&lt; 이전 날짜</button>
          <span style={{ margin: "0 16px", fontSize: "1.2em" }}>
            {formatDate(currentDate)}
          </span>
          <button onClick={handleNextDay}>다음 날짜 &gt;</button>
        </div>
      </header>
      <main>
        {currentWords.length > 0 ? (
          currentWords.map((word) => <WordCard key={word.id} wordData={word} />)
        ) : (
          <p style={{ textAlign: "center" }}>
            해당 날짜의 단어 데이터가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
