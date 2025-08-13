import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";

import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";

import { Email } from "@mui/icons-material";

// Importe o CustomModal e o RecoveryModal
import CustomModal from "../components/mod/CustomModal";
import RecoveryModal from "../components/mod/RecoveryModal";

import senaiLogo from '../../img/logo.png';

function RecSenha() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Recuperar Senha | SENAI";
  }, []);

  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false); // Novo estado para controlar o RecoveryModal
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    isSuccess: false,
    type: "",
    onClose: () => {
      setModalOpen(false);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.postVerifyRecoveryPassword({ email });
      setModalInfo({
        title: "Sucesso!",
        message: "Código de recuperação enviado para o seu e-mail.",
        isSuccess: true,
        type: "success",
        onClose: () => {
          setModalOpen(false);
          setRecoveryModalOpen(true);
        },
      });
      setModalOpen(true);
    } catch (error) {
      setModalInfo({
        title: "Erro!",
        message: error.response?.data?.error || "Erro ao enviar código de recuperação.",
        isSuccess: false,
        type: "error",
        onClose: () => {
          setModalOpen(false);
        },
      });
      setModalOpen(true);
    }
  };

  return (
    <Container component="main" sx={styles.container}>
      <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
        <Box sx={styles.senaiLogo}></Box> 

        <Typography component="h1" variant="h5" sx={styles.recuperarSenhaTitle}>
          Informe seu Email para a redefinição da senha
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={styles.buttonEnviar}
        >
          Enviar
        </Button>
      </Box>
      <CustomModal
        open={modalOpen}
        onClose={modalInfo.onClose}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
      {/* O novo modal de recuperação de senha */}
      <RecoveryModal
        open={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        email={email}
        modalInfo={modalInfo}
        setModalInfo={setModalInfo}
      />
    </Container>
  );
}

function getStyles() {
  // ... (o restante dos seus estilos permanece o mesmo)
  return {
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent:"center",
      minHeight: "80vh",
      minWidth: "100%",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      padding: '20px 15px',
      borderRadius: '15px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '300px',
    },
    senaiLogo: {
      backgroundImage: `url(${senaiLogo})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: "150px",
      height: "50px",
      mb: 2,
    },
    recuperarSenhaTitle: {
      fontSize: "16px",
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
        fontSize: "14px",
        color: "gray",
        "&.Mui-focused": {
          color: "rgba(255, 0, 0, 1)",
        },
      },
    },
    buttonEnviar: {
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
      width: '100%',
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
    },
  };
}

export default RecSenha;