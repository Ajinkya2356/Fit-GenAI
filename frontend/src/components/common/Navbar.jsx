import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { palette } from "../../theme/colors.js";
import Avatar from "@mui/material/Avatar";
import Logo from "../images/logo.jpg";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { logoutAction } from "../../../Redux/user/userSlice.js";
import Exercises from "../Exercise/Exercises.jsx";
import MonetizationOn from "@mui/icons-material/MonetizationOn.js";
const pages = ["Home", "Challenges", "Workout", "Exercises", "Posts"];
const userMap = ["Login", "Register"];
const userProfile = [
  "My Profile",
  "Change Password",
  "My Exercises",
  "My Challenges",
  "My Collections",
  "Logout",
];
const mappingToLinks = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  "My Profile": "/profile",
  "Change Password": "/change-password",
  Workout: "/workout",
  Exercises: "/exercises",
  Challenges: "/challenges",
  "My Challenges": "/my-challenges",
  "My Exercises": "/my-exercises",
  Posts: "/posts",
  "My Collections": "/my-collections",
};

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { isAuthenticated, user,coins } = useSelector((state) => state.USER);
  const dispatch = useDispatch();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {}, [isAuthenticated]);

  return (
    <AppBar position="static" style={{ backgroundColor: "#333" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar alt="Fit Fusion" src={Logo} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: palette.light,
              textDecoration: "none",
            }}
          >
            &nbsp;FITFUSION
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      if (mappingToLinks[page]) {
                        navigate(mappingToLinks[page]);
                      }
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
              {isAuthenticated
                ? null
                : userMap.map((item, index) => (
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => {
                          if (mappingToLinks[item]) {
                            navigate(mappingToLinks[item]);
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: palette.light,
              textDecoration: "none",
            }}
          >
            FITFUSION
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  if (mappingToLinks[page]) {
                    navigate(mappingToLinks[page]);
                  }
                }}
                sx={{
                  my: 2,
                  color: palette.light,
                  fontWeight: 700,
                }}
              >
                {page}
              </Button>
            ))}
            {isAuthenticated ? (
              <Button
                sx={{
                  my: 2,
                  color: palette.light,
                  fontWeight: 700,
                }}
                onClick={() => {
                  dispatch(logoutAction());
                }}
              >
                Logout
              </Button>
            ) : (
              userMap.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    my: 2,
                    color: palette.light,
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    handleCloseNavMenu();
                    if (mappingToLinks[item]) {
                      navigate(mappingToLinks[item]);
                    }
                  }}
                >
                  {item}
                </Button>
              ))
            )}
          </Box>
          {isAuthenticated && (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <Typography
                variant="h6"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <MonetizationOn
                  style={{
                    color: "gold",
                  }}
                />
                {user?.user?.coinBalance}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                  }}
                >
                  <Avatar alt="Remy Sharp" src={user?.user?.avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userProfile.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        dispatch(logoutAction());
                      }
                      if (mappingToLinks[setting]) {
                        navigate(mappingToLinks[setting]);
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
