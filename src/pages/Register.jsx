import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axios";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  Email,
  Lock,
} from "@mui/icons-material";

import CustomModal from "../components/mod/CustomModal";
import SecuryCode from "../components/mod/SecuryCode";

function Register() {
  const styles = getStyles();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [modalCustom, setModalCustom] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const [verifyModalOpen, setVerifyModalOpen] = useState(false); // modal do VerificationForm

  useEffect(() => {
    document.title = "Cadastro | SENAI";
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    RegisterUser();
  };

  const handleCloseCustomModal = () => {
    setModalCustom((prev) => ({ ...prev, open: false }));
    if (modalCustom.type === "success") {
      navigate("/principal");
    }
  };

  async function RegisterUser() {
    try {
      const response = await api.postRegister(user);
      setVerifyModalOpen(true);

    } catch (error) {
      setModalCustom({
        open: true,
        title: "Erro!",
        message: error.response?.data?.error,
        type: "error",
      });
    }
  }

  return (
    <Container component="main" sx={styles.container}>
      {/* Formulário de Cadastro */}
      <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
        <Box sx={styles.cadastroIconBox}>
          <PersonOutline sx={styles.cadastroIcon} />
        </Box>
        <Typography component="h1" variant="h5" sx={styles.cadastroTitle}>
          Cadastre-se
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="nome"
          name="name"
          autoComplete="name"
          autoFocus
          value={user.name}
          onChange={onChange}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline sx={{ color: "gray" }} />
              </InputAdornment>
            ),
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
          value={user.email}
          onChange={onChange}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="senha"
          type={mostrarSenha ? "text" : "password"}
          id="senha"
          autoComplete="new-password"
          value={user.password}
          onChange={onChange}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "gray" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  edge="end"
                  sx={{ color: "gray" }}
                >
                  {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="confirmar senha"
          type={mostrarConfirmarSenha ? "text" : "password"}
          id="confirmarSenha"
          autoComplete="new-password"
          value={user.confirmPassword}
          onChange={onChange}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "gray" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                  edge="end"
                  sx={{ color: "gray" }}
                >
                  {mostrarConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" variant="contained" sx={styles.buttonCadastro}>
          Cadastrar-se
        </Button>

        <Typography variant="body2" sx={styles.jaTemContaText}>
          Já tem uma conta?
        </Typography>
        <Button component={Link} to="/login" variant="text" sx={styles.buttonToLogin}>
          Login
        </Button>
      </Box>

      {/* Modal de Verificação */}
      <Modal open={verifyModalOpen} onClose={() => setVerifyModalOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
        }}>
          <SecuryCode
            email={user.email}
            onResult={(success, message) => {
              setModalCustom({
                open: true,
                title: success ? "Sucesso!" : "Erro!",
                message,
                type: success ? "success" : "error",
              });
              setVerifyModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      {/* Modal Custom */}
      <CustomModal
        open={modalCustom.open}
        onClose={handleCloseCustomModal}
        title={modalCustom.title}
        message={modalCustom.message}
        type={modalCustom.type}
        buttonText="Fechar"
      />
    </Container>
  );
}

function getStyles() {
  return {
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "80.5vh",
      minWidth: "100%",
      justifyContent: "center",
    },
    form: {
      mt: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    cadastroIconBox: {
      backgroundColor: "rgba(255, 0, 0, 1)",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: 2,
    },
    cadastroIcon: {
      color: "white",
      fontSize: "40px",
    },
    cadastroTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      mb: 3,
      color: "#333",
    },
    textField: {
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
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
        padding: "12px 14px",
        fontSize: "16px",
        color: "#333",
      },
      "& .MuiInputLabel-root": {
        color: "gray",
        "&.Mui-focused": {
          color: "rgba(255, 0, 0, 1)",
        },
      },
    },
    buttonCadastro: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "rgba(200, 0, 0, 1)",
        },
      },
      mt: 3,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: "100%",
      height: 50,
      fontWeight: 600,
      fontSize: 16,
      borderRadius: 10,
      textTransform: "none",
    },
    jaTemContaText: {
      mt: 2,
      color: "gray",
    },
    buttonToLogin: {
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 15.5,
      textDecoration: "none",
      mt: 1,
      textTransform: "none",
      "&:hover": {
        backgroundColor: "transparent",
        color: "rgba(200, 0, 0, 1)",
        textDecoration: "underline",
      },
    },
  };
}

export default Register;
