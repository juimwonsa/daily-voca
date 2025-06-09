import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TestSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (testType: "multiple-choice" | "spelling") => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TestSelectionModal: React.FC<TestSelectionModalProps> = ({
  isOpen,
  onClose,
  onStartTest,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          테스트 유형 선택
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={() => onStartTest("multiple-choice")}
            size="large"
          >
            단어 뜻 맞히기 (객관식)
          </Button>
          <Button
            variant="contained"
            onClick={() => onStartTest("spelling")}
            size="large"
          >
            단어 철자 맞히기 (주관식)
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TestSelectionModal;
