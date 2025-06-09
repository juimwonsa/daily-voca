import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress, // 점수 시각화를 위해 추가
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // 아이콘 추가
import LinkIcon from "@mui/icons-material/Link"; // 아이콘 추가
import type { Word } from "../types/word";
import { supabase } from "../lib/supabaseClient";

// 1. AI 응답 결과 타입을 백엔드 스펙에 맞춰 완전히 새로 정의합니다.
interface AnalysisResult {
  is_correct: boolean;
  corrected_sentence: string; // 여전히 유용할 수 있으므로 남겨둡니다.
  score: number;
  feedback_ko: string; // 'feedback' -> 'feedback_ko'
  alternative_examples: string[]; // 추천 예문 배열
  common_collocations: string[]; // 연어 배열
  html_highlight: string; // 수정사항 하이라이트 HTML
}

const WritingTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const words: Word[] = location.state?.words || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSentence, setUserSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const currentQuestion = words[currentQuestionIndex];

  const handleCheckSentence = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Supabase 함수 호출 부분은 동일합니다.
      const { data, error } = await supabase.functions.invoke(
        "sentence-checker", // Deno 함수 이름
        {
          body: { word: currentQuestion.word, sentence: userSentence },
        }
      );

      if (error) throw error;
      setResult(data);
    } catch (error) {
      console.error("Error invoking function:", error);
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    setUserSentence("");
    setCurrentQuestionIndex((prev) => prev + 1);
  };

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

  if (!currentQuestion) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h4">
          🎉 모든 단어에 대한 작문을 완료했습니다!
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
    <Box sx={{ maxWidth: 700, mx: "auto", py: 2, px: 2 }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        IELTS 작문 테스트 ({currentQuestionIndex + 1}/{words.length})
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mt: 2, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          아래 단어를 사용하여 문장을 만들어 보세요.
        </Typography>
        <Typography
          variant="h3"
          component="p"
          fontWeight="bold"
          sx={{ my: 2, color: "primary.main" }}
        >
          {currentQuestion.word}
        </Typography>
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="여기에 문장을 입력하세요..."
        value={userSentence}
        onChange={(e) => setUserSentence(e.target.value)}
        disabled={loading || !!result}
        sx={{ mt: 3 }}
      />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleCheckSentence}
        disabled={loading || !userSentence || !!result}
        sx={{ my: 2, py: 1.5, fontSize: "1.1rem" }}
      >
        {loading ? (
          <CircularProgress size={26} color="inherit" />
        ) : (
          "제출하고 피드백 받기"
        )}
      </Button>

      {/* 2. 결과 표시 부분을 완전히 새롭게 구성합니다. */}
      {result && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📝 AI 채점 결과
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h5" component="span" fontWeight="bold">
              {result.score}
            </Typography>
            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" color="text.secondary">
                Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.score}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
            교정된 문장
          </Typography>
          {/* 3. html_highlight를 렌더링하는 핵심 부분 */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "grey.100",
              border: "1px solid",
              borderColor: "grey.300",
              my: 1,
              fontSize: "1.1rem",
              "& ins": {
                color: "success.dark",
                bgcolor: "#e9f5e9",
                textDecoration: "none",
                fontWeight: "bold",
                px: "2px",
                borderRadius: "3px",
              },
              "& del": {
                color: "error.dark",
                bgcolor: "#fbe9e9",
                textDecoration: "line-through",
                px: "2px",
                borderRadius: "3px",
              },
            }}
            dangerouslySetInnerHTML={{ __html: result.html_highlight }}
          />

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
            상세 피드백
          </Typography>
          <Typography
            sx={{
              mt: 1,
              whiteSpace: "pre-wrap",
              bgcolor: "grey.50",
              p: 2,
              borderRadius: 1,
            }}
          >
            {result.feedback_ko}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            👍 추천 예문 (Band 8-9)
          </Typography>
          <List dense>
            {result.alternative_examples.map((example, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleOutlineIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={example} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            🤝 함께 쓰면 좋은 단어 (연어)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {result.common_collocations.map((collocation, index) => (
              <Chip
                icon={<LinkIcon />}
                key={index}
                label={collocation}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleNext}
            sx={{ mt: 4, py: 1.5 }}
          >
            {currentQuestionIndex < words.length - 1
              ? "다음 단어 도전"
              : "결과 확인하고 홈으로"}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default WritingTestPage;
