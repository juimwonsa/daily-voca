import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import WordCard from "./components/WordCard";
import TestPage from "./pages/TestPage"; // 3단계에서 만든 테스트 페이지 import
import type { Word } from "./types/word";
import vocabularyData from "./data/vocabulary.json";

const vocabulary: { [key: string]: Word[] } = vocabularyData;

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// 홈 화면 컴포넌트를 분리
const HomePage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [currentDate, setCurrentDate] = useState(new Date("2025-06-09"));
  const currentWords = vocabulary[formatDate(currentDate)] || [];

  const handlePrevDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() - 1)));
  const handleNextDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() + 1)));

  const startTest = () => {
    // 테스트 페이지로 이동하면서 그날의 단어 데이터를 state로 전달
    navigate("/test", { state: { words: currentWords } });
  };

  return (
    <>
      <header style={{ textAlign: "center", padding: "20px 0" }}>
        <h1>오늘의 영단어</h1>
        <div style={{ margin: "20px 0" }}>
          <button onClick={handlePrevDay}>&lt; 이전 날짜</button>
          <span style={{ margin: "0 16px", fontSize: "1.2em" }}>
            {formatDate(currentDate)}
          </span>
          <button onClick={handleNextDay}>다음 날짜 &gt;</button>
        </div>
        {/* ↓↓↓ 2. 테스트 시작 버튼 추가 */}
        {currentWords.length > 0 && (
          <button
            onClick={startTest}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            오늘의 단어 테스트 시작
          </button>
        )}
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
    </>
  );
};

function App() {
  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      {/* ↓↓↓ 3. 경로에 따라 다른 페이지를 보여주도록 설정 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
