import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Word } from "../types/word";

// 배열을 랜덤하게 섞는 헬퍼 함수
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // 테스트 종료 시 결과 화면
  if (currentQuestionIndex >= words.length) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>테스트 완료!</h2>
        <p style={{ fontSize: "1.5rem" }}>
          총 {words.length}문제 중 <strong>{score}</strong>개를 맞혔습니다.
        </p>
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  // 단어 데이터가 없을 경우
  if (words.length === 0) {
    return (
      <div>
        테스트할 단어가 없습니다. 홈으로 돌아가 날짜를 선택해주세요.
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        영단어 테스트 ({currentQuestionIndex + 1}/{words.length})
      </h2>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        {currentQuestion.word}
      </div>
      <div>
        {options.map((option, index) => {
          // 답변 후 정답/오답 시각적 피드백
          const isCorrect = option === correctAnswer;
          let buttonStyle = {};
          if (isAnswered) {
            if (isCorrect) {
              buttonStyle = { backgroundColor: "lightgreen" };
            } else if (option === selectedAnswer) {
              buttonStyle = { backgroundColor: "lightcoral" };
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              style={{
                display: "block",
                width: "100%",
                padding: "15px",
                margin: "10px 0",
                fontSize: "1rem",
                cursor: "pointer",
                ...buttonStyle,
              }}
              disabled={isAnswered}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <button
          onClick={handleNextQuestion}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "20px",
            fontSize: "1.2rem",
          }}
        >
          다음 문제
        </button>
      )}
    </div>
  );
};

export default TestPage;
