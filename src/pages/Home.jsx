import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { Box, Button, Container, Typography } from "@mui/material";

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
            Seja Bem-
            <br />
            vindo ao site
            <br />
            de estoque do
            <br />
            SENAI
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
      alignItems: "flex-start",
      justifyContent: "space-between",
      minHeight: "100vh",
      width: "100%",
      pl: { sm: 0 },
      pr: { sm: 0 },
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "2vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "7px solid white",
      p: { xs: 2, sm: 3 },
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: 2,
    },
    buttonsContainer: {
      display: "flex",
      alignItems: "center",
      ml: { xs: 0, sm: "auto" },
      mr: { xs: 1, sm: 5 },
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
      width: { xs: 85, sm: 100 },
      height: 35,
      fontWeight: 600,
      fontSize: { xs: 10, sm: 13 },
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
      width: { xs: 60, sm: 80 },
      height: 35,
      fontWeight: 600,
      fontSize: { xs: 10, sm: 13 },
      borderRadius: 15,
      textTransform: "none",
      ml: { xs: 1, sm: 3 },
    },
    body: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flex: 1,
      textAlign: "left",
      paddingLeft: { xs: "20px", sm: "40px", md: "80px", lg: "35px" },
      marginRight: "auto",
    },
    bodyText: {
      color: "white",
      fontSize: { xs: 35, sm: 50, md: 60, lg: 70 },
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
