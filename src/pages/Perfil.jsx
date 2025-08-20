import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/Header";
import senaiLogo from '../../img/logo.png';

function Perfil() {
  const styles = getStyles();

  useEffect(() => {
    document.title = "Perfil | SENAI";
  }, []);

  const [userProfile, setUserProfile] = useState({ name: "", email: "" });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Perfil editado:", userProfile);
  };

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Logo do Senai */}
          <Box sx={styles.senaiLogo}></Box> 
          
          {/* Título da tela, agora como na tela de Recuperar Senha */}
          <Typography component="h1" variant="h5" sx={styles.profileTitle}>
            Meu Perfil
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="nome"
            name="name"
            autoFocus
            value={userProfile.name}
            onChange={onChange}
            sx={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="e-mail"
            name="email"
            autoComplete="email"
            value={userProfile.email}
            onChange={onChange}
            sx={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <Button type="submit" variant="contained" sx={styles.button}>
            Editar Perfil
          </Button>
          
          <Button component={Link} to="/meuspedidos" sx={styles.linkButton} variant="text">
            Meus Pedidos
          </Button>
        </Box>
      </Container>
      
      <FooterPerfil/>
    </Box>
  );
}

function getStyles() {
  return {
    pageLayout: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "100%",
      padding: "10px",
      flexGrow: 1,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      padding: "20px 15px",
      borderRadius: "15px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "320px",
    },
    senaiLogo: {
      backgroundImage: `url(${senaiLogo})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: "150px",
      height: "50px",
      mb: 1.5,
    },
    profileTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      mb: 1.5,
      color: "#333",
      textAlign: "center",
    },
    textField: {
      mb: 1,
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        "& fieldset": {
          borderColor: "transparent",
        },
        "&:hover fieldset": {
          borderColor: "transparent",
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgba(255, 0, 0, 0.5)",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        padding: "8px 10px",
        fontSize: "14px",
        color: "#333",
      },
      "& .MuiInputLabel-root": {
        fontSize: "15px",
        color: "gray",
        "&.Mui-focused": {
          color: "rgba(255, 0, 0, 1)",
        },
      },
    },
    button: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "rgba(200, 0, 0, 1)",
        },
      },
      mt: 2,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: "100%",
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
    },
    linkButton: {
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 13,
      textDecoration: "none",
      mt: 0.5,
      textTransform: "none",
      "&:hover": {
        backgroundColor: "transparent",
        color: "rgba(200, 0, 0, 1)",
        textDecoration: "underline",
      },
    },
  };
}

export default Perfil;