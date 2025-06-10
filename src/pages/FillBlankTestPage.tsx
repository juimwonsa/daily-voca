import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Word } from "../types/word";
import { supabase } from "../lib/supabaseClient";

// ✨ 1. 셔플 헬퍼 함수를 여기에 추가합니다.
const shuffleArray = (array: QuizItem[]): QuizItem[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface QuizItem {
  sentence_template: string;
  answer: string;
}

interface CheckResult {
  isCorrect: boolean;
}

const FillBlankTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const words: Word[] = location.state?.words || [];

  const [loading, setLoading] = useState(true);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (words.length === 0) {
      setLoading(false);
      return;
    }

    const generateQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const wordStrings = words.map((w) => w.word);

        const { data, error } = await supabase.functions.invoke(
          "generate-vocab-fill-blank",
          {
            body: { words: wordStrings },
          }
        );

        if (error) throw error;
        if (!data.quiz || data.quiz.length === 0) {
          throw new Error("AI가 퀴즈를 생성하지 못했습니다.");
        }

        // ✨ 2. 상태를 설정하기 전에 받아온 퀴즈 배열을 섞습니다.
        const shuffledQuiz = shuffleArray(data.quiz);
        setQuizItems(shuffledQuiz);
      } catch (e) {
        console.error("Error generating quiz:", e);
        setError("퀴즈를 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [words]);

  const currentQuizItem = quizItems[currentQuestionIndex];

  const handleCheckAnswer = () => {
    if (!currentQuizItem) return;
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentQuizItem.answer.toLowerCase();
    setCheckResult({ isCorrect });
  };

  const handleNext = () => {
    setCheckResult(null);
    setUserAnswer("");
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // --- UI 렌더링 부분 (변경 없음) ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>AI가 퀴즈를 만들고 있습니다...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (words.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5">테스트할 단어를 먼저 선택해주세요.</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          단어장으로 이동
        </Button>
      </Box>
    );
  }

  if (!currentQuizItem) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h4">🎉 모든 퀴즈를 완료했습니다!</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 4 }}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    );
  }

  const sentenceParts = currentQuizItem.sentence_template.split("{{BLANK}}");

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 2, px: 2 }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        빈칸 채우기 퀴즈 ({currentQuestionIndex + 1}/{quizItems.length})
      </Typography>

      <Paper
        elevation={2}
        sx={{ p: { xs: 2, sm: 4 }, mt: 2, textAlign: "center" }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          문맥에 맞는 단어를 빈칸에 입력하세요.
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{
            my: 3,
            lineHeight: 1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {sentenceParts[0]}
          <TextField
            variant="outlined"
            size="small"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!checkResult}
            sx={{ mx: 1, minWidth: 150, display: "inline-block" }}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter" && userAnswer && !checkResult) {
                handleCheckAnswer();
              }
            }}
          />
          {sentenceParts[1]}
        </Typography>
      </Paper>

      {!checkResult && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCheckAnswer}
          disabled={!userAnswer}
          sx={{ my: 2, py: 1.5, fontSize: "1.1rem" }}
        >
          정답 확인
        </Button>
      )}

      {checkResult && (
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          {checkResult.isCorrect ? (
            <Alert
              severity="success"
              icon={<CheckCircleIcon fontSize="inherit" />}
            >
              <AlertTitle>정답입니다!</AlertTitle>
              훌륭해요! 다음 문제에 도전해 보세요.
            </Alert>
          ) : (
            <Alert severity="error" icon={<CancelIcon fontSize="inherit" />}>
              <AlertTitle>오답입니다</AlertTitle>
              정답은 "<strong>{currentQuizItem.answer}</strong>" 입니다.
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleNext}
            sx={{ mt: 3, py: 1.5 }}
          >
            {currentQuestionIndex < quizItems.length - 1
              ? "다음 문제"
              : "결과 확인하고 홈으로"}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default FillBlankTestPage;
