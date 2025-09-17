import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Modal,
  Alert,
  Snackbar,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/Header";
import sheets from "../services/axios";
import CustomModal from "../components/mod/CustomModal";

function AtualizarPerfil() {
  const styles = getStyles();
  const navigate = useNavigate();

  // Estados do formulário e da tela
  const [form, setForm] = useState({
    nome: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    novaSenha: "",
    confirmarSenha: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isVerifyUpdateModalOpen, setIsVerifyUpdateModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState(null);

  // Estados para o CustomModal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    isSuccess: false,
    type: "",
  });

  // Estado para o Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Função para mostrar mensagens no Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Busca os dados do usuário ao carregar a página
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idUser) {
      setUserId(user.idUser);
      setForm({
        nome: user.name,
        email: user.email
      });
    }
  }, []);

  // Funções de handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCloseModal = () => {
  setModalOpen(false);
  // Força um recarregamento da página para que o componente HeaderPerfil
  // leia os dados atualizados do localStorage.
  window.location.reload(); 
  };

  // FUNÇÃO DE ATUALIZAÇÃO DO PERFIL (NOME, EMAIL E/OU SENHA)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.nome,
      email: form.email,
    };

    // Se o modal de senha foi aberto e os campos foram preenchidos, adicione-os ao payload
    if (isPasswordModalOpen) {
      if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
        showSnackbar("As senhas não coincidem.", "error");
        setLoading(false);
        return;
      }
      payload.password = passwordForm.novaSenha;
      payload.confirmPassword = passwordForm.confirmarSenha;
    }

    try {
      const response = await sheets.putUpdateProfile(userId, payload);
      const { message, user } = response.data;

      if (message.includes("Verificação de e-mail necessária")) {
        showSnackbar(message, "warning");
        setIsVerifyUpdateModalOpen(true);
      } else {
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setModalInfo({
          title: "Sucesso!",
          message: message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Erro completo ao atualizar perfil:", error);
      setModalInfo({
        title: "Erro!",
        message: error.response?.data?.error || "Erro ao atualizar perfil.",
        isSuccess: false,
        type: "error",
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // FUNÇÃO PARA EXCLUIR O PERFIL
  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      await sheets.deleteProfile(userId);
      showSnackbar("Usuário desativado com sucesso.", "success");
      setIsDeleteModalOpen(false);

      localStorage.removeItem("tokenUsuario");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Erro completo ao deletar o perfil:", error);
      showSnackbar(error.response?.data?.error || "Erro ao deletar o perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO PARA VALIDAR CÓDIGO DE ATUALIZAÇÃO DE E-MAIL
  const handleVerifyUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        code: verificationCode
      };
      const response = await sheets.postVerifyUpdate(payload);
      const { message, user } = response.data;
      
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        name: user.name,
        email: user.email
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setModalInfo({
        title: "Sucesso!",
        message: message,
        isSuccess: true,
        type: "success",
      });
      setModalOpen(true);
      setIsVerifyUpdateModalOpen(false);
      setVerificationCode("");
      
    } catch (error) {
      console.error("Erro completo ao verificar o código:", error);
      showSnackbar(error.response?.data?.error || "Erro ao verificar o código.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Funções de controle dos modais, sem lógica de API
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordForm({ novaSenha: "", confirmarSenha: "" });
  };
  const handleClose = () => navigate('/perfil');

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Box sx={styles.modal}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <Typography component="h2" sx={styles.modalTitle}>
            Editar Perfil
          </Typography>

          <Box component="form" onSubmit={handleUpdate} sx={styles.formContent}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              sx={styles.modalTextField}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={styles.modalTextField}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              type="button"
              variant="text"
              onClick={handleOpenPasswordModal}
              sx={styles.passwordButton}
            >
              Deseja mudar a senha?
            </Button>

            <Box sx={styles.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                sx={styles.modalButton}
                disabled={loading}
              >
                {loading ? "Carregando..." : "Editar Perfil"}
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ ...styles.modalButton, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={loading}
              >
                Deletar Perfil
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <FooterPerfil />

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="confirm-delete-modal-title"
        aria-describedby="confirm-delete-modal-description"
      >
        <Box sx={styles.confirmModal}>
          <Typography id="confirm-delete-modal-title" variant="h6" component="h2" sx={styles.confirmModalTitle}>
            Confirmação de Deleção
          </Typography>
          <Typography id="confirm-delete-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
            Tem certeza que deseja deletar sua conta? Esta ação é irreversível.
          </Typography>
          <Box sx={styles.confirmModalButtonContainer}>
            <Button
              variant="contained"
              onClick={handleCloseDeleteModal}
              sx={styles.confirmModalButtonCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              sx={styles.confirmModalButtonConfirm}
              disabled={loading}
            >
              {loading ? "Deletando..." : "Confirmar"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de Alteração de Senha */}
      <Modal
        open={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
      >
        <Box sx={styles.confirmModal}>
          <IconButton
            aria-label="close"
            onClick={handleClosePasswordModal}
            sx={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="change-password-modal-title" variant="h6" component="h2" sx={styles.confirmModalTitle}>
            Alterar Senha
          </Typography>
          <Box component="form" onSubmit={handleUpdate} sx={styles.formContent}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="novaSenha"
              label="Nova Senha"
              name="novaSenha"
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.novaSenha}
              onChange={handlePasswordChange}
              sx={styles.modalTextField}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmarSenha"
              label="Confirmar Nova Senha"
              name="confirmarSenha"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordForm.confirmarSenha}
              onChange={handlePasswordChange}
              sx={styles.modalTextField}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={styles.modalButton}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Confirmar Alteração"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* NOVO: Modal de Verificação de E-mail */}
      <Modal
        open={isVerifyUpdateModalOpen}
        onClose={() => setIsVerifyUpdateModalOpen(false)}
        aria-labelledby="verify-update-modal-title"
        aria-describedby="verify-update-modal-description"
      >
        <Box sx={styles.confirmModal}>
          <IconButton
            aria-label="close"
            onClick={() => setIsVerifyUpdateModalOpen(false)}
            sx={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="verify-update-modal-title" variant="h6" component="h2" sx={styles.confirmModalTitle}>
            Verificação de E-mail
          </Typography>
          <Typography id="verify-update-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
            Um código foi enviado para seu novo e-mail. Por favor, insira-o abaixo.
          </Typography>
          <Box component="form" onSubmit={handleVerifyUpdate} sx={styles.formContent}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verification-code"
              label="Código de Verificação"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={styles.modalTextField}
            />
            <Button
              type="submit"
              variant="contained"
              sx={styles.modalButton}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Verificar"}
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* Utilizando o CustomModal para mensagens de sucesso/erro */}
      <CustomModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
        buttonText="Fechar"
      />
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
    modal: {
      width: '100%',
      maxWidth: '350px',
      bgcolor: 'background.paper',
      border: '1px solid #c0c0c0',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
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
    formContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modalTextField: {
      mb: 2,
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
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      width: '100%',
      mt: 1,
    },
    modalButton: {
      flexGrow: 1,
      mt: 1,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: "100%",
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "rgba(200, 0, 0, 1)",
        },
      },
    },
    passwordButton: {
      width: "100%",
      textTransform: "none",
      fontSize: "14px",
      color: "rgba(255, 0, 0, 1)",
      "&:hover": {
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
    },
    closeButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'rgba(255, 0, 0, 0.8)',
    },
    confirmModal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 300,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '15px',
      border: '1px solid #c0c0c0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    },
    confirmModalTitle: {
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      mb: 2,
    },
    confirmModalButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      mt: 3,
    },
    confirmModalButtonCancel: {
      backgroundColor: '#f5f5f5',
      color: '#333',
      fontWeight: 'bold',
      "&:hover": {
        backgroundColor: '#e0e0e0',
      },
    },
    confirmModalButtonConfirm: {
      backgroundColor: '#dc3545',
      color: 'white',
      fontWeight: 'bold',
      "&:hover": {
        backgroundColor: '#c82333',
      },
    },
  };
}

export default AtualizarPerfil;