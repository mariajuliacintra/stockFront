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
} from "@mui/material";

import { Visibility, VisibilityOff, PersonOutline, Email, Lock } from "@mui/icons-material";

import CustomModal from "../components/mod/CustomModal";

function Register() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Cadastro | SENAI";
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    isSuccess: false,
    type: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    RegisterUser();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalInfo.isSuccess) {
      navigate("/principal");
    }
  };

  async function RegisterUser() {
    await api.postRegister(user).then(
      (response) => {
        setModalInfo({
          title: "Sucesso!",
          message: response.data.message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
        localStorage.setItem("tokenUsuario", response.data.token);
      },
      (error) => {
        console.log(error);
        setModalInfo({
          title: "Erro!",
          message: error.response?.data?.error,
          isSuccess: false,
          type: "error",
        });
        setModalOpen(true);
      }
    );
  }

  return (
    <Container component="main" maxWidth={false} sx={styles.container}>
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
                <PersonOutline sx={{ color: 'gray' }} />
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
                <Email sx={{ color: 'gray' }} />
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
                <Lock sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setMostrarSenha((previousState) => !previousState)}
                  edge="end"
                  sx={{ color: "gray", mr: 0 }}
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
                <Lock sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setMostrarConfirmarSenha((previousState) => !previousState)}
                  edge="end"
                  sx={{ color: "gray", mr: 0 }}
                >
                  {mostrarConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={styles.buttonCadastro}
        >
          Cadastrar-se
        </Button>
        <Typography variant="body2" sx={styles.jaTemContaText}>
          Já tem uma conta?
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={styles.buttonToLogin}
        >
          Login
        </Button>
      </Box>
      <CustomModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      minWidth: "100%",
        padding: '10px',
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
      maxWidth: '320px', // Largura máxima reduzida
    },
    cadastroIconBox: {
      backgroundColor: 'rgba(255, 0, 0, 1)',
      borderRadius: '50%',
      width: '50px', // Tamanho do ícone reduzido
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 1.5,
    },
    cadastroIcon: {
      color: 'white',
      fontSize: '28px', // Tamanho da fonte do ícone reduzido
    },
    cadastroTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      mb: 1.5,
      color: '#333',
    },
    textField: {
      mb: 1, // Margem entre os campos reduzida
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        '& fieldset': {
          borderColor: 'transparent',
        },
        '&:hover fieldset': {
          borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderWidth: '1px',
        },
      },
      '& .MuiInputBase-input': {
        padding: '8px 10px', // Padding interno dos inputs reduzido
        fontSize: '14px',
        color: '#333',
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
        color: 'gray',
        '&.Mui-focused': {
          color: 'rgba(255, 0, 0, 1)',
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
      mt: 2,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: '100%',
      height: 40, // Altura do botão reduzida
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
    },
    jaTemContaText: {
      mt: 1.5,
      color: 'gray',
      fontSize: 13,
    },
    buttonToLogin: {
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

export default Register;