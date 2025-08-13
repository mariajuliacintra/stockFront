import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const Header = ({}) => {
  const styles = getStyles();
  return (
    <Box sx={styles.header}>
      <Button component={Link} to="/" sx={styles.buttonHome}>
        <HomeIcon sx={styles.HomeIcon} />
      </Button>
    </Box>
  );
};

function getStyles() {
  return {
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "7px solid white", // Já estava em px, o que é correto
    },
    buttonHome: {
      mr: { xs: 0.5, sm: 1.5 },
    },
    HomeIcon: {
      width: { xs: 20, sm: 30 },
      height: { xs: 20, sm: 30 },
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      color: "white",
      padding: 0.5,
    },
  };
}

export default Header;