import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { Box, Button, Container, Typography } from "@mui/material";
import Footer from "../components/layout/Footer";

function Home() {
  const styles = getStyles();

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth={false} sx={styles.container}>
        <Box sx={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Box sx={styles.buttonsContainer}>
            <Button
              component={Link}
              to="/register"
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
    </Box>
  );
}

function getStyles() {
  return {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    container: {
      backgroundImage: `url(../../img/fundoinicial.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: "100vh",
      width: "100%",
      pl: { sm: 0 },
      pr: { sm: 0 },
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "7px solid white",
      p: { xs: 2, sm: 3 },
    },
    logo: {
      width: { xs: "150px", sm: "230px" },
      height: "auto",
      border: "4.5px solid white",
      borderRadius: 15,
    },
    buttonsContainer: {
      display: "flex",
      alignItems: "center",
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
      width: { xs: 120, sm: 140 },
      height: 55,
      fontWeight: 600,
      fontSize: { xs: 14, sm: 17 },
      borderRadius: 15,
      textTransform: "none",
      ml: { xs: 1, sm: 2 },
    },
    buttonToLogin: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: { xs: 80, sm: 90 },
      height: 55,
      fontWeight: 600,
      fontSize: { xs: 14, sm: 17 },
      borderRadius: 15,
      textTransform: "none",
      ml: { xs: 1, sm: 3 },
    },
    body: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      textAlign: "center",
      p: 2,
    },
    bodyText: {
      color: "white",
      fontSize: { xs: 40, sm: 60, md: 80, lg: 100 },
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
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Home;