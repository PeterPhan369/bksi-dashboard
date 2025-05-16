// src/scenes/feedback/index.jsx
import React, { useState } from 'react';
import { Box, useTheme, Pagination } from '@mui/material';
import Header from '../../components/Header';
import FeedbackTable from '../../components/FeedbackTable';
import { tokens } from '../../theme';

// --- Fake data: tokenized Vietnamese student questions with popular LLM names ---
const fakeFeedbackData = [
  { id: 1, serviceName: 'GPT-4',           dateTime: '2025-05-12 09:15', suggestions: 'làm thế nào để nộp bài tập ?',                           userfeedback: 'Tốt' },
  { id: 2, serviceName: 'GPT-3.5',         dateTime: '2025-05-12 11:42', suggestions: 'bao lâu thì bài kiểm tra được trả ?',                     userfeedback: 'Tốt' },
  { id: 3, serviceName: 'Bard',            dateTime: '2025-05-13 08:03', suggestions: 'tôi cần tài liệu bổ sung về chủ đề hóa học hữu cơ .',       userfeedback: 'Tốt' },
  { id: 4, serviceName: 'Claude 2',         dateTime: '2025-05-13 10:27', suggestions: 'lịch học thêm vào thứ bảy là gì ?',                      userfeedback: '-' },
  { id: 5, serviceName: 'Llama 2',         dateTime: '2025-05-13 14:53', suggestions: 'giờ phát biểu bài thuyết trình của tôi khi nào ?',         userfeedback: 'Tệ' },
  { id: 6, serviceName: 'Mistral',         dateTime: '2025-05-14 09:00', suggestions: 'cách truy cập thư viện trực tuyến như thế nào ?',        userfeedback: 'Tệ' },
  { id: 7, serviceName: 'Gemini',          dateTime: '2025-05-14 12:30', suggestions: 'làm sao để đăng ký câu lạc bộ bóng đá ?',                 userfeedback: '-' },
  { id: 8, serviceName: 'PaLM 2',          dateTime: '2025-05-14 15:45', suggestions: 'tôi quên mật khẩu tài khoản sinh viên .',                  userfeedback: 'Tốt' },
  { id: 9, serviceName: 'Cohere Command',  dateTime: '2025-05-15 08:20', suggestions: 'điều kiện tham gia chương trình trao đổi sinh viên là gì ?', userfeedback: 'Tệ' },
  { id: 10, serviceName: 'Jurassic-2',     dateTime: '2025-05-15 11:10', suggestions: 'giáo án tuần sau có thay đổi không ?',                    userfeedback: 'Tệ' },
  { id: 11, serviceName: 'OPT',            dateTime: '2025-05-15 13:55', suggestions: 'tôi có thể xem lại điểm kiểm tra trực tuyến ở đâu ?',      userfeedback: '-' },
];

const FeedbackScene = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- Pagination state ---
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(fakeFeedbackData.length / itemsPerPage);

  // --- Page change handler ---
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px">
      <Header
        title="Feedback Monitor"
        subtitle="Viewing AI tokenization of student questions"
      />

      <Box mt="20px">
        <FeedbackTable
          feedbackData={fakeFeedbackData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt="20px">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackScene;
