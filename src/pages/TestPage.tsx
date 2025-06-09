import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import type { Word } from "../types/word";

// 배열을 랜덤하게 섞는 헬퍼 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words: Word[] = location.state?.words || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 현재 문제와 정답
  const currentQuestion = words[currentQuestionIndex];
  const correctAnswer = currentQuestion?.meaning;

  // 4지선다 선택지 생성 (useMemo로 불필요한 재생성 방지)
  const options = useMemo(() => {
    if (!currentQuestion) return [];

    // 정답 외 다른 오답 선택지 만들기
    const incorrectAnswers = words
      .filter((word) => word.id !== currentQuestion.id)
      .map((word) => word.meaning);

    // 오답 3개 무작위 선택
    const shuffledIncorrect = shuffleArray(incorrectAnswers).slice(0, 3);

    // 정답 + 오답 3개를 합쳐서 다시 섞기
    return shuffleArray([correctAnswer, ...shuffledIncorrect]);
  }, [currentQuestion, words, correctAnswer]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return; // 이미 답변했으면 다시 선택 불가

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (currentQuestionIndex >= words.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h4" gutterBottom>
          테스트 완료!
        </Typography>
        <Typography variant="h6">
          총 {words.length}문제 중 <strong>{score}</strong>개를 맞혔습니다.
        </Typography>
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

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" component="h2" align="center">
        영단어 테스트 ({currentQuestionIndex + 1}/{words.length})
      </Typography>
      <Typography
        variant="h3"
        component="p"
        align="center"
        fontWeight="bold"
        sx={{ my: 4 }}
      >
        {currentQuestion.word}
      </Typography>
      <Stack spacing={2}>
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;
          let buttonColor: "inherit" | "success" | "error" = "inherit";
          if (isAnswered) {
            if (isCorrect) buttonColor = "success";
            else if (option === selectedAnswer) buttonColor = "error";
          }
          return (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              color={buttonColor}
              sx={{
                padding: "15px",
                fontSize: "1rem",
                justifyContent: "center",
              }}
            >
              {option}
            </Button>
          );
        })}
      </Stack>
      {isAnswered && (
        <Button
          variant="outlined"
          onClick={handleNextQuestion}
          sx={{ width: "100%", mt: 4, py: 2, fontSize: "1.2rem" }}
        >
          다음 문제
        </Button>
      )}
    </Box>
  );
};

export default TestPage;
