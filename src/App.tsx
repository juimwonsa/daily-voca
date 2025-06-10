import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// MUI 컴포넌트 import
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import WordCard from "./components/WordCard";
import TestSelectionModal from "./components/TestSelectionModal";
import TestPage from "./pages/TestPage";
import WritingTestPage from "./pages/WritingTestPage";
// 1. 새로 만든 FillBlankTestPage를 import 합니다.
import FillBlankTestPage from "./pages/FillBlankTestPage";
import type { Word } from "./types/word";
import { supabase } from "./lib/supabaseClient";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const formattedDate = formatDate(currentDate);
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("date", formattedDate);
      if (error) console.error("Error fetching words:", error);
      else setWords(data || []);
      setLoading(false);
    };
    fetchWords();
  }, [currentDate]);

  const handlePrevDay = () =>
    setCurrentDate((current) => {
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      return d;
    });
  const handleNextDay = () =>
    setCurrentDate((current) => {
      const d = new Date(current);
      d.setDate(d.getDate() + 1);
      return d;
    });

  // 2. handleStartTest가 새로운 테스트 타입을 처리하도록 수정합니다.
  const handleStartTest = (
    testType: "multiple-choice" | "writing" | "fill-in-the-blank"
  ) => {
    setIsModalOpen(false);

    // 오늘의 단어가 없을 경우 테스트를 시작하지 않습니다.
    if (words.length === 0) {
      alert("테스트할 단어가 없습니다.");
      return;
    }

    if (testType === "multiple-choice") {
      navigate("/test", { state: { words } });
    } else if (testType === "writing") {
      navigate("/test/writing", { state: { words } });
    } else if (testType === "fill-in-the-blank") {
      // "빈칸 채우기" 테스트 페이지로 이동하는 로직 추가
      navigate("/test/fill-blank", { state: { words } });
    }
  };

  return (
    <>
      <Box sx={{ textAlign: "center", paddingY: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          오늘의 영단어
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ marginY: 2 }}
        >
          <Button variant="outlined" onClick={handlePrevDay}>
            &lt; 이전 날짜
          </Button>
          <Typography variant="h6">{formatDate(currentDate)}</Typography>
          <Button variant="outlined" onClick={handleNextDay}>
            다음 날짜 &gt;
          </Button>
        </Stack>
        {words.length > 0 && (
          <Button
            variant="contained"
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            오늘의 단어 테스트 시작
          </Button>
        )}
      </Box>
      <main>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : words.length > 0 ? (
          <Stack spacing={2}>
            {words.map((word) => (
              <WordCard key={word.id} wordData={word} />
            ))}
          </Stack>
        ) : (
          <Typography sx={{ textAlign: "center", my: 4 }}>
            해당 날짜의 단어 데이터가 없습니다.
          </Typography>
        )}
      </main>
      <TestSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartTest={handleStartTest}
      />
    </>
  );
};

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/writing" element={<WritingTestPage />} />
          {/* 3. "빈칸 채우기" 테스트를 위한 새로운 Route를 추가합니다. */}
          <Route path="/test/fill-blank" element={<FillBlankTestPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
