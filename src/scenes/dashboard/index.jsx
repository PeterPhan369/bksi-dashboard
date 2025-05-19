import { useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme, Pagination } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import AIServiceRatingChart from "../../components/AIServiceRatingChart";
import UsageRejectionChart from "../../components/UsageRejectionChart";
import FeedbackTable from "../../components/FeedbackTable";
import ServiceManager from "../../components/ServiceManager";
import ApiKeyGeneratorPage from "../../components/ApiKeyGeneratorPage";
import { mockDataTeam } from "../../data/mockData";

// --- Fake feedback data for Recent Feedback table ---
const fakeFeedbackData = [
  { id: 1, serviceName: 'GPT-4',          dateTime: '2025-05-12 09:15', suggestions: 'làm thế nào để nộp bài tập ?',                            userfeedback: 'Tốt' },
  { id: 2, serviceName: 'GPT-3.5',        dateTime: '2025-05-12 11:42', suggestions: 'bao lâu thì bài kiểm tra được trả ?',                      userfeedback: 'Tốt' },
  { id: 3, serviceName: 'Bard',           dateTime: '2025-05-13 08:03', suggestions: 'tôi cần tài liệu bổ sung về chủ đề hóa học hữu cơ .',        userfeedback: 'Tốt' },
  { id: 4, serviceName: 'Claude 2',       dateTime: '2025-05-13 10:27', suggestions: 'lịch học thêm vào thứ bảy là gì ?',                       userfeedback: '-' },
  { id: 5, serviceName: 'Llama 2',        dateTime: '2025-05-13 14:53', suggestions: 'giờ phát biểu bài thuyết trình của tôi khi nào ?',          userfeedback: 'Không Tốt' },
  { id: 6, serviceName: 'Mistral',        dateTime: '2025-05-14 09:00', suggestions: 'cách truy cập thư viện trực tuyến như thế nào ?',         userfeedback: 'Không Tốt' },
  { id: 7, serviceName: 'Gemini',         dateTime: '2025-05-14 12:30', suggestions: 'làm sao để đăng ký câu lạc bộ bóng đá ?',                  userfeedback: '-' },
  { id: 8, serviceName: 'PaLM 2',         dateTime: '2025-05-14 15:45', suggestions: 'tôi quên mật khẩu tài khoản sinh viên .',                   userfeedback: 'Tốt' },
  { id: 9, serviceName: 'Cohere Command', dateTime: '2025-05-15 08:20', suggestions: 'điều kiện tham gia chương trình trao đổi sinh viên là gì ?', userfeedback: 'Không Tốt' },
  { id: 10,serviceName: 'Jurassic-2',    dateTime: '2025-05-15 11:10', suggestions: 'giáo án tuần sau có thay đổi không ?',                     userfeedback: 'Không Tốt' },
  { id: 11,serviceName: 'OPT',           dateTime: '2025-05-15 13:55', suggestions: 'tôi có thể xem lại điểm kiểm tra trực tuyến ở đâu ?',       userfeedback: '-' },
];

const Dashboard = () => {

  useEffect(() => {
    console.log("✅ Dashboard mounted");
  }, []);
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dashboardRef = useRef(); // for screenshot

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalFeedbackPages = Math.ceil(fakeFeedbackData.length / itemsPerPage);

  const handleDownloadScreenshot = async () => {
    if (dashboardRef.current) {
      const canvas = await html2canvas(dashboardRef.current);
      const link = document.createElement('a');
      link.download = 'dashboard-report.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleServicesChange = (updatedServices) => {
    console.log("Updated services:", updatedServices);
  };

  const handleFeedbackPageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to BKSI-Dashboard" />
        <Button
          onClick={handleDownloadScreenshot}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>

      {/* Content to capture */}
      <Box ref={dashboardRef}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="min-content"
          gap="20px"
          mt="20px"
        >
          {/* Top Row: Service Manager & Recent Feedback */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            p="20px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Manage Services
            </Typography>
            <Box mt="10px">
              <ServiceManager
                initialServices={mockDataTeam}
                onServicesChange={handleServicesChange}
                themeColors={colors}
                compact
              />
            </Box>
          </Box>

          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            p="20px"
            overflow="auto"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Recent Feedback
            </Typography>
            <Box mt="10px">
              <FeedbackTable
                feedbackData={fakeFeedbackData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
              {totalFeedbackPages > 1 && (
                <Box display="flex" justifyContent="center" mt="20px">
                  <Pagination
                    count={totalFeedbackPages}
                    page={currentPage}
                    onChange={handleFeedbackPageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Second Row: Service Ratings & Usage Rejections */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            p="20px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Service Ratings
            </Typography>
            <Box mt="10px">
              <AIServiceRatingChart isDashboard />
            </Box>
          </Box>

          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            p="20px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Usage Rejections
            </Typography>
            <Box mt="10px">
              <UsageRejectionChart isDashboard />
            </Box>
          </Box>

          {/* Bottom Row: API Key Generator */}
          <Box
            gridColumn="span 12"
            backgroundColor={colors.primary[400]}
            p="20px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              API Key Generator
            </Typography>
            <Box mt="10px">
              <ApiKeyGeneratorPage />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
