import { Link } from "react-router-dom";
import { useEffect } from "react";
import logo from "../../public/logo.png";
import { Box, Button, Container, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

function Home() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Home | SENAI";
  }, []);

  const downloadApk = () => {
    window.location.href =
      "https://expo.dev/accounts/mariafernandacintra/projects/senai-estoque-v1/builds/47c2ea8e-906f-4ff1-bbd1-3039c6b969cd";
  };

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
            <Button
              onClick={downloadApk}
              sx={styles.buttonToApk}
              variant="contained"
              startIcon={<DownloadIcon />}
            >
              APK
            </Button>
          </Box>
        </Box>
        <Box sx={styles.body}>
          <Typography sx={styles.bodyText}>
            Seja Bem-vindo
            <br />
            ao site de
            <br />
            estoque do
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
  // Variável para a Media Query de celular (max-width: 600px)
  const mobile = '@media (max-width: 600px)';

  return {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    container: {
      backgroundImage: `url('/fundoinicial.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      minHeight: "100vh",
      width: "100%",

      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "7px solid white",
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: 30, // Desktop padrão
      [mobile]: {
        marginLeft: 10, // Menor margem em mobile
      },
    },
    buttonsContainer: {
      display: "flex",
      alignItems: "center",
      ml: { xs: 0, sm: "auto" },
      mr: { xs: 1, sm: 5 },
    },
    // --- Estilos de Botão com Media Query para Mobile ---
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
      width: 100, // Desktop padrão
      height: 35,
      fontWeight: 600,
      fontSize: 13, // Desktop padrão
      borderRadius: 15,
      textTransform: "none",
      ml: 2, // Desktop padrão
      
      [mobile]: {
        width: 80, // Ajusta a largura para mobile
        fontSize: 10, // Ajusta a fonte para mobile
        ml: 0.5, // Reduz a margem entre botões
      },
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
      width: 80,
      height: 35,
      fontWeight: 600,
      fontSize: 13,
      borderRadius: 15,
      textTransform: "none",
      ml: 3,
      
      [mobile]: {
        width: 55, // Ajusta a largura para mobile
        fontSize: 10, // Ajusta a fonte para mobile
        ml: 0.5, // Reduz a margem entre botões
      },
    },
    buttonToApk: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 80,
      height: 35,
      fontWeight: 600,
      fontSize: 13,
      borderRadius: 15,
      textTransform: "none",
      ml: 3,
      
      [mobile]: {
        width: 55, // Ajusta a largura para mobile
        fontSize: 10, // Ajusta a fonte para mobile
        ml: 0.5, // Reduz a margem entre botões
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flex: 1,
      textAlign: "left",
      paddingLeft: "80px", // Desktop padrão
      marginRight: "auto",
      
      [mobile]: {
        paddingLeft: "20px", // Reduz o padding esquerdo em mobile
      },
    },
    bodyText: {
      color: "white",
      fontSize: 70, // Desktop padrão
      fontWeight: "bold",
      
      [mobile]: {
        fontSize: 30, // Reduz o tamanho da fonte para mobile
      },
    },
    // --- Footer ---
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