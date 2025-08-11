import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { Box, Button, Container, Typography } from "@mui/material";
import Footer from "../components/layout/Footer";

function Home() {
  const styles = getStyles();

  return (
    <div>
      <Container sx={styles.container}>
        <Box sx={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Button
            component={Link}
            to="/cadastro"
            sx={styles.buttonToCadastro}
            variant="text"
          >
            Cadastre-se
          </Button>
          <Button
            component={Link}
            to="/login"
            sx={styles.buttonToLogin}
            variant="text"
          >
            Login
          </Button>
        </Box>
        <Box sx={styles.body}>
          <Typography sx={styles.bodyText}>
            Seja Bem-vindo ao site de estoque do SENAI
          </Typography>
        </Box>
        <Box sx={styles.footer}>
          <Typography sx={styles.footerText}>&copy;CSSTORAGE</Typography>
        </Box>
      </Container>
    </div>
  );
}

function getStyles() {
  return {
    container: {
      backgroundImage: `url(../../img/fundoinicial.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      minWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      pl: { sm: 0 },
      pr: { sm: 0 },
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      minWidth: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      borderBottom: "7px solid white",
    },
    logo: {
      width: "230px",
      height: "auto",
      marginRight: "1370px",
      border: "4.5px solid white",
      borderRadius: 15,
    },
    buttonToCadastro: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 140,
      height: 55,
      fontWeight: 600,
      fontSize: 17,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonToLogin: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      mr: 3,
      ml: 3,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 90,
      height: 55,
      fontWeight: 600,
      fontSize: 17,
      borderRadius: 15,
      textTransform: "none",
    },
    body: {
      mt: 8,
      mr: 110,
      width: "75vh",
      height: "74.1vh",
    },
    bodyText: {
      color: "white",
      fontSize: 100,
      fontWeight: "bold",
    },
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
      marginTop: "auto",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Home;
