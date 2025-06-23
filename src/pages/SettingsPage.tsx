import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../context/UserContext";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { uid, setUid } = useUser();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (uid) {
      setInputValue(uid);
    }
  }, [uid]);

  const handleGenerateUid = () => {
    const newUid = uuidv4();
    setInputValue(newUid);
  };

  const handleSaveUid = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") {
      alert("UID를 입력하거나 생성해주세요.");
      return;
    }
    setUid(trimmedValue);
    alert("UID가 저장되었습니다!");
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          설정
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          데이터 동기화를 위해 고유 ID(UID)를 사용하세요. 다른 기기에서 이 UID를
          입력하면 학습 데이터를 불러올 수 있습니다.
        </Typography>
        <Stack spacing={2} sx={{ my: 4 }}>
          <TextField
            label="사용자 고유 ID (UID)"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleGenerateUid}>
            새로운 UID 생성하기
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSaveUid}>
            UID 저장 및 홈으로
          </Button>
          <Button variant="text" onClick={() => navigate("/")}>
            취소
          </Button>
        </Stack>
        {uid && (
          <Alert severity="info" sx={{ mt: 4 }}>
            현재 동기화된 UID: {uid}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default SettingsPage;
