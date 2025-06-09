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

interface TestSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (testType: "multiple-choice" | "writing") => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
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
        <Stack direction="row" spacing={2} justifyContent="space-around">
          <Button
            onClick={() => onStartTest("multiple-choice")}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              width: 120,
              height: 120,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid", // --- 테두리 두께 및 스타일 추가
              borderColor: "primary.main", // --- 테두리 색상 추가
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" align="center">
              단어 뜻 맞히기
            </Typography>
          </Button>
          <Button
            onClick={() => onStartTest("writing")} // 타입을 'writing'으로 변경
            sx={{
              bgcolor: "white",
              color: "secondary.main",
              width: 120,
              height: 120,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid",
              borderColor: "secondary.main",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <CreateIcon sx={{ fontSize: 40, mb: 1 }} /> {/* 아이콘 변경 */}
            <Typography variant="body2" align="center">
              문장 만들기 (작문) {/* 텍스트 변경 */}
            </Typography>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TestSelectionModal;
