import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { Helmet } from "react-helmet-async";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

import { tokens } from "../common/theme";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Helmet>
        <title> PĐH - Profile </title>
      </Helmet>
      <Box display="flex" alignItems={"center"} height={"100vh"} py={2}>
        <Box
          display={"flex"}
          flex={0.5}
          flexDirection={"column"}
          justifyContent={"center"}
          width={"100%"}
          pl={15}
        >
          <Typography variant="h1" gutterBottom color={"#EC994B"}>
            Hi there,
          </Typography>
          <Typography variant="h1" gutterBottom color={"#EC994B"}>
            I’m <span style={{ color: "white" }}>Dac Hieu</span>
          </Typography>
          <Typography variant="h4" gutterBottom color={"#ffffff87"}>
            I am a{" "}
            <span style={{ color: "white", textDecoration: "underline" }}>
              designer
            </span>
            , and also a{" "}
            <span style={{ color: "white", textDecoration: "underline" }}>
              developer
            </span>
            .
          </Typography>
          <Box my={2}>
            <IconButton color="warning" aria-label="add an alarm">
              <FacebookOutlinedIcon fontSize="large" />
            </IconButton>
            <IconButton color="warning" aria-label="add an alarm">
              <GitHubIcon fontSize="large" />
            </IconButton>
            <IconButton color="warning" aria-label="add an alarm">
              <InstagramIcon fontSize="large" />
            </IconButton>
            <IconButton color="warning" aria-label="add an alarm">
              <XIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box mt={3}>
            <Button variant="contained" color="warning" size="large">
              Contact me
            </Button>
          </Box>
        </Box>
        <Box
          display={"flex"}
          flex={0.5}
          position={"relative"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {/* <Avatar sx={{ bgcolor: "yellow" }} sizes="50%">
            .
          </Avatar> */}
          <Box
            sx={{
              backgroundColor: "#EC994B",
              // backgroundImage:
              // "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
              width: "300px",
              height: "300px",
              position: "absolute",
              borderRadius: "50%",
              transition: "1s all",
              animation: `morphing
              7s linear infinite`,
              top: "calc(50% - 100px)",
              left: "calc(50% - 200px)",
              boxShadow: "5px 5px 50px #EC994B",
            }}
          ></Box>
          <Box
            sx={{
              backgroundColor: "#f6d365",
              opacity: 0.7,
              // backgroundImage:
              // "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
              width: "300px",
              height: "300px",
              position: "absolute",
              borderRadius: "50%",
              transition: "1s all",
              animation: `morphing
              7s 2s linear infinite`,
              top: "calc(50% - 100px)",
              left: "calc(50% - 200px)",
            }}
          ></Box>
          <Box zIndex={2}>
            <img
              src="./IMG_8576 1.png"
              loading="lazy"
              width={"80%"}
              style={{ borderRadius: "40%" }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
