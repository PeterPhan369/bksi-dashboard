// src/scenes/global/Topbar.jsx
import React, { useState } from "react"; // Import useState
import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material"; // Import Menu, MenuItem
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useAuth(); // Get the logout function from context
  const navigate = useNavigate(); // Hook for navigation

  // --- State for Menu ---
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // --- Menu Handlers ---
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Anchor the menu to the button clicked
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    handleMenuClose(); // Close the menu
    navigate('/login'); // Redirect to the login page
  };
  // --- End Menu Logic ---


  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* --- User Icon Button --- */}
        <IconButton
          aria-label="account of current user"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen} // Open menu on click
          color="inherit"
        >
          <PersonOutlinedIcon />
        </IconButton>
        {/* --- End User Icon Button --- */}

        {/* --- Profile Menu --- */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose} // Close menu when clicking away
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {/* You could add other items here like "Profile", "Settings" etc. */}
          {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
        </Menu>
        {/* --- End Profile Menu --- */}

      </Box>
    </Box>
  );
};

export default Topbar;