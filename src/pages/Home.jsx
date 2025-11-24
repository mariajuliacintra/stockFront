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
      "https://expo.dev/accounts/mariafernandacintra/projects/senai-estoque-v1/builds/1c0c9506-1c43-4ca1-92c5-540a2ab09ae8";
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
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                APK
              </Box>
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
      
      paddingX: {
        xs: '1px',
        sm: '30px', 
      }
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: 0, 
      paddingLeft: 0, 
    },
    buttonsContainer: {
      display: "flex",
      alignItems: "center",
      ml: { xs: 0, sm: "auto" }, 
      mr: { xs: 0, sm: 5 }, 
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
      height: 35,
      fontWeight: 600,
      borderRadius: 15,
      textTransform: "none",
      
      width: { sm: 100 },
      fontSize: { xs: 10, sm: 13 },
      padding: { xs: '0 5px', sm: null },
      ml: { xs: 0.2, sm: 2 }, 
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
      height: 35,
      fontWeight: 600,
      borderRadius: 15,
      textTransform: "none",

      width: { sm: 80 },
      fontSize: { xs: 10, sm: 13 },
      padding: { xs: '0 5px', sm: null },
      ml: { xs: 0.2, sm: 3 }, 
    },

    buttonToApk: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
        "& .MuiButton-startIcon": {
          marginRight: { xs: 0, sm: '8px' },
          marginLeft: { xs: 0, sm: '-4px' },
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      height: 35,
      fontWeight: 600,
      borderRadius: 15,
      textTransform: "none",

      width: { 
        xs: 35, 
        sm: 80 
      }, 
      fontSize: { xs: 0, sm: 13 }, 
      

      padding: {
        xs: '6px 6px',
        sm: null, 
      },
      ml: { xs: 0.2, sm: 3 }, 
    },
    
    body: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flex: 1,
      textAlign: "left",
      marginRight: "auto",
      paddingLeft: { xs: "20px", sm: "80px" },
    },
    bodyText: {
      color: "white",
      fontWeight: "bold",
      fontSize: { xs: 30, sm: 70 },
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