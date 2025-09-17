import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/HeaderPerfil";
import senaiLogo from '../../img/logo.png';

const API_BASE_URL = "http://10.89.240.85:5000/stock/user";

function Perfil() {
  const navigate = useNavigate();
  const styles = getStyles();

  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Perfil | SENAI";

    const storedUserData = localStorage.getItem('user');

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserProfile({
          name: userData.name || "",
          email: userData.email || ""
        });
      } catch (error) {
        console.error("Falha ao parsear os dados do usuário do localStorage:", error);
      }
    }
  }, []);

  const handleOpenModal = () => {
    setMessage("");
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
  };

  const handlePasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleConfirmPassword = async () => {
    setError("");
    setMessage("");

    try {
      const storedUserData = localStorage.getItem('user');
      const userData = storedUserData ? JSON.parse(storedUserData) : null;

      if (!userData || !userData.email) {
        setError("Não foi possível encontrar o e-mail do usuário.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: currentPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("tokenUsuario", data.user?.[0]?.token);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("user", JSON.stringify(data.user[0]));
        
        navigate('/atualizarperfil');
      } else {
        setError(data.message || "Senha incorreta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao confirmar senha:", error);
      setError("Ocorreu um erro ao tentar confirmar a senha. Tente novamente mais tarde.");
    }
  };

  const onChange = () => {};
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
          <Box sx={styles.senaiLogo}></Box>
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
            disabled
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
            disabled
            sx={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            type="button"
            variant="contained"
            sx={styles.button}
            onClick={handleOpenModal}
          >
            Editar Perfil
          </Button>
          <Button component={Link} to="/transacoes" sx={styles.linkButton} variant="text">
            Minhas Transações
          </Button>
        </Box>
      </Container>
      <FooterPerfil/>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="confirm-password-modal"
        aria-describedby="confirm-password-description"
      >
        <Box sx={styles.modal}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <Typography component="h2" id="confirm-password-modal" sx={styles.modalTitle}>
            Confirmar Senha Atual
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="current-password"
            label="Senha Atual"
            name="current-password"
            type="password"
            value={currentPassword}
            onChange={handlePasswordChange}
            sx={styles.modalTextField}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography variant="body2" color="success" sx={{ mt: 1, textAlign: 'center' }}>
              {message}
            </Typography>
          )}
          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={styles.modalButton}
            onClick={handleConfirmPassword}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
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
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      bgcolor: 'background.paper',
      border: '1px solid #c0c0c0',
      boxShadow: 24,
      p: 4,
      borderRadius: '15px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    },
    modalTitle: {
      mb: 2,
      fontWeight: 'bold',
      color: '#333'
    },
    modalTextField: {
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
      },
    },
    modalButton: {
      mt: 1,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: "100%",
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
    },
    closeButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'rgba(255, 0, 0, 0.8)',
    },
  };
}

export default Perfil;