// src/components/WordCard.tsx
import React from "react";
import type { Word } from "../types/word";

interface WordCardProps {
  wordData: Word;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  // 어떤 텍스트든 읽어줄 수 있는 재사용 가능한 함수로 변경
  const speakText = (text: string) => {
    // 혹시 이전에 재생 중인 소리가 있다면 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // 영어 발음으로 설정
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        margin: "8px 0",
        borderRadius: "8px",
      }}
    >
      <h3>
        {wordData.word}
        {/* 단어 읽기 버튼 */}
        <button
          onClick={() => speakText(wordData.word)}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          🔊
        </button>
      </h3>
      <p>
        <strong>뜻:</strong> {wordData.meaning}
      </p>
      <p>
        <strong>예문:</strong> <em>{wordData.sentence}</em>
        {/* ↓↓↓ 예문 읽기 버튼 추가! ↓↓↓ */}
        <button
          onClick={() => speakText(wordData.sentence)}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          🔊
        </button>
      </p>
    </div>
  );
};

export default WordCard;
