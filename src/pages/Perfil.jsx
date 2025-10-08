import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Modal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/HeaderPerfil";
import senaiLogo from '../../img/logo.png';

function Perfil() {
  const navigate = useNavigate();
  const styles = getStyles();

  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [status, setStatus] = useState({ message: "", error: "", loading: false });

  // Função para buscar os dados do perfil
  const fetchUserProfile = useCallback(async () => {
    // ✅ Lendo o ID salvo pelo componente Login
    const idUsuario = localStorage.getItem('idUsuario'); 
    if (!idUsuario) {
      console.error("ID do usuário não encontrado no localStorage.");
      navigate('/login'); 
      return;
    }

    try {
      // Fazendo a requisição com o ID
      const response = await api.getUserProfile(idUsuario); 
      if (response.data.success && response.data.user && response.data.user.length > 0) {
        const userData = response.data.user[0];
        setUserProfile({ name: userData.name, email: userData.email });
      } else {
        console.error("Falha ao carregar o perfil do usuário:", response.data.message);
      }
    } catch (e) {
      console.error("Erro na requisição da API:", e);
    }
  }, [navigate]);


  useEffect(() => {
    document.title = "Perfil | SENAI";
    fetchUserProfile();
  }, [fetchUserProfile]);


  const handleOpenModal = () => {
    setStatus({ message: "", error: "", loading: false });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
  };

  const handlePasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleConfirmPassword = useCallback(async () => {
    setStatus({ ...status, loading: true });

    // ✅ CORREÇÃO: Usando o e-mail que está no estado 'userProfile' 
    // (carregado via fetchUserProfile).
    const userEmail = userProfile.email;
    
    if (!userEmail) {
      setStatus({ error: "E-mail do usuário não carregado. Tente recarregar a página.", loading: false });
      return;
    }
    
    try {
      const response = await api.postLogin({ 
        email: userEmail, 
        password: currentPassword 
      });

      if (response.status === 200 && response.data.success) {
        // Se a confirmação for bem-sucedida (e a API retornou o ID e token), garante que estão salvos
        localStorage.setItem("tokenUsuario", response.data.user?.[0]?.token);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("idUsuario", String(response.data.user[0].idUser)); 
        
        navigate('/atualizarperfil');
      } else {
        setStatus({ 
          error: response.data.message || "Senha incorreta. Tente novamente.", 
          loading: false 
        });
      }
    } catch (e) {
      console.error("Erro ao confirmar senha:", e);
      const errorMessage = e.response?.data?.error || "Ocorreu um erro. Tente novamente mais tarde.";
      setStatus({ error: errorMessage, loading: false });
    }
  }, [currentPassword, navigate, userProfile.email, status]);


  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Box sx={styles.form}>
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
            value={userProfile.name}
            disabled
            sx={styles.textField}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="e-mail"
            name="email"
            value={userProfile.email}
            disabled
            sx={styles.textField}
            InputLabelProps={{ shrink: true }}
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
      <FooterPerfil />

      {/* Modal de Confirmação de Senha */}
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
          {status.error && (
            <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
              {status.error}
            </Typography>
          )}
          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={styles.modalButton}
            onClick={handleConfirmPassword}
            disabled={status.loading}
          >
            {status.loading ? <CircularProgress size={24} color="inherit" /> : "Confirmar"}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
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
      position: 'relative',
    },
    modalTitle: {
      mb: 2,
      fontWeight: 'bold',
      color: '#333',
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