import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useAuth } from "../context/AuthContext"; // import the hook

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useAuth(); // get the token from AuthContext

  console.log("Header token:", token); // for debugging

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
