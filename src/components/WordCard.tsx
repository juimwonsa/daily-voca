import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp"; // 아이콘 import
import type { Word } from "../types/word";

interface WordCardProps {
  wordData: Word;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="h5" component="h3" sx={{ flexGrow: 1 }}>
            {wordData.word}
          </Typography>
          <IconButton onClick={() => speakText(wordData.word)} color="primary">
            <VolumeUpIcon />
          </IconButton>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          <strong>뜻:</strong> {wordData.meaning}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            <strong>예문:</strong> <em>{wordData.sentence}</em>
          </Typography>
          <IconButton onClick={() => speakText(wordData.sentence)} size="small">
            <VolumeUpIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WordCard;
