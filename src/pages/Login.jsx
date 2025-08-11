import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axios";

import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  ArrowForward,
} from "@mui/icons-material";

import CustomModal from "../components/mod/CustomModal";

function Login() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Login | SENAI";
  }, []);
  const [user, setUser] = useState({ email: "", password: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
    LoginUser();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalInfo.isSuccess) {
      navigate("/principal");
    }
  };

  async function LoginUser() {
    await api.postLogin(user).then(
      (response) => {
        setModalInfo({
          title: "Sucesso!",
          message: response.data.message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
        const tokenUsuario = response.data.token;
        localStorage.setItem("tokenUsuario", tokenUsuario);
      },
      (error) => {
        console.log(error);
        setModalInfo({
          title: "Erro!",
          message: error.response?.data?.error || "Erro ao fazer Login",
          isSuccess: false,
          type: "error",
        });
        setModalOpen(true);
      }
    );
  }

  return (
    <Container component="main" sx={styles.container}>
      <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
        <Box sx={styles.loginIconBox}>
          <ArrowForward sx={styles.loginIcon} />
        </Box>
        <Typography component="h1" variant="h5" sx={styles.loginTitle}>
          Login
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="e-mail"
          name="email"
          autoComplete="email"
          autoFocus
          value={user.email}
          onChange={onChange}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "gray" }} />
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
          id="password"
          autoComplete="current-password"
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
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setMostrarSenha((previousState) => !previousState)
                  }
                  edge="end"
                  sx={{ color: "gray", mr: 0 }}
                >
                  {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" sx={styles.buttonLogin}>
          Login
        </Button>
        <Typography variant="body2" sx={styles.naoTemContaText}>
          Não tem uma conta?
        </Typography>
        <Button
          component={Link}
          to="/register"
          sx={styles.buttonCadastro}
          variant="text"
        >
          Cadastre-se
        </Button>

        <Button
          component={Link}
          to="/register"
          sx={styles.buttonCadastro}
          variant="text"
        >
          Esqueci Minha Senha
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
    loginIconBox: {
      backgroundColor: "rgba(255, 0, 0, 1)",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: 2,
    },
    loginIcon: {
      color: "white",
      fontSize: "40px",
    },
    loginTitle: {
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
    buttonLogin: {
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
    naoTemContaText: {
      mt: 2,
      color: "gray",
    },
    buttonCadastro: {
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 15.5,
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

export default Login;
