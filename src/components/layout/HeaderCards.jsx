import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import logo from "../../../img/logo.png";
import LogoutIcon from '@mui/icons-material/Logout';

const HeaderCards = ({}) => {
  const styles = getStyles();
  function logout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  return (
    <Box sx={styles.header}>
      <img src={logo} alt="Logo" style={styles.logo} />
      <Box>
        <Button component={Link} to="/perfil" >
          <PersonIcon sx={styles.PersonIcon} />
        </Button>
        <Button component={Link} to="/" onClick={logout} sx={styles.buttonHome}>
          <LogoutIcon sx={styles.HomeIcon} />
        </Button>
      </Box>
    </Box>
  );
};

function getStyles() {
  return {
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1vh solid white",
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
    PersonIcon: {
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
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: 30,
    },
  };
}

export default HeaderCards;
