import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../common/theme";
import { Helmet } from "react-helmet-async";

type IProps = {
  title: string;
  subtitle: string;
};

const Header: React.FC<IProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Helmet>
        <title> PĐH - {title} </title>
      </Helmet>
      <Box my="15px">
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
    </>
  );
};

export default Header;
