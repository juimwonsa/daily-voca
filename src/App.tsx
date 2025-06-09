import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import WordCard from "./components/WordCard";
import TestPage from "./pages/TestPage";
import type { Word } from "./types/word";
import { supabase } from "./lib/supabaseClient";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date("2025-06-09"));
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const formattedDate = formatDate(currentDate);

      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("date", formattedDate);

      if (error) {
        console.error("Error fetching words:", error);
      } else {
        setWords(data || []);
      }
      setLoading(false);
    };

    fetchWords();
  }, [currentDate]);

  const handlePrevDay = () => {
    setCurrentDate((current) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((current) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const startTest = () => {
    navigate("/test", { state: { words: words } });
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
        {words.length > 0 && (
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
        {loading ? (
          <p style={{ textAlign: "center" }}>단어를 불러오는 중...</p>
        ) : words.length > 0 ? (
          words.map((word) => <WordCard key={word.id} wordData={word} />)
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
