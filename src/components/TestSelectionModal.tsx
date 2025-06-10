import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreateIcon from "@mui/icons-material/Create";
// 1. 빈칸 채우기에 어울리는 새 아이콘을 가져옵니다.
import EditNoteIcon from "@mui/icons-material/EditNote";

interface TestSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 2. onStartTest가 새로운 테스트 타입을 받을 수 있도록 타입을 확장합니다.
  onStartTest: (
    testType: "multiple-choice" | "writing" | "fill-in-the-blank"
  ) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 550, // 3개의 버튼이 잘 보이도록 최대 너비를 약간 늘립니다.
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
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
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 3, textAlign: "center" }}
        >
          테스트 유형 선택
        </Typography>
        {/* 3. Stack에 새로운 버튼을 추가합니다. */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* 기존 버튼 1: 단어 뜻 맞히기 */}
          <Button
            onClick={() => onStartTest("multiple-choice")}
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              flexDirection: "column",
              border: "2px solid",
              borderColor: "primary.main",
              "&:hover": { bgcolor: "primary.lighter" },
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />
            <Typography variant="body2" align="center" fontWeight="medium">
              단어 뜻 맞히기
            </Typography>
          </Button>

          {/* ✨ 새로 추가된 버튼: 빈칸 채우기 ✨ */}
          <Button
            onClick={() => onStartTest("fill-in-the-blank")}
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              flexDirection: "column",
              border: "2px solid",
              borderColor: "success.main", // 다른 색상으로 구분
              "&:hover": { bgcolor: "success.lighter" },
            }}
          >
            <EditNoteIcon sx={{ fontSize: 40, mb: 1 }} color="success" />
            <Typography variant="body2" align="center" fontWeight="medium">
              빈칸 채우기
            </Typography>
          </Button>

          {/* 기존 버튼 2: 문장 만들기 */}
          <Button
            onClick={() => onStartTest("writing")}
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              flexDirection: "column",
              border: "2px solid",
              borderColor: "secondary.main",
              "&:hover": { bgcolor: "secondary.lighter" },
            }}
          >
            <CreateIcon sx={{ fontSize: 40, mb: 1 }} color="secondary" />
            <Typography variant="body2" align="center" fontWeight="medium">
              문장 만들기
            </Typography>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TestSelectionModal;
