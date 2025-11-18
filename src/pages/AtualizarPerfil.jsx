import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/HeaderPerfil";
import api from "../services/axios";
import CustomModal from "../components/mod/CustomModal";
import PerfSecuryCode from "../components/mod/PerfSecuryCode";

function AtualizarPerfil() {
  const styles = getStyles();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isVerifyUpdateModalOpen, setIsVerifyUpdateModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    type: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Estilo customizado para o fundo do Modal (backdrop)
  const modalBackdropStyle = { 
    backdropFilter: 'blur(3px)', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchUserProfile = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await api.getUserProfile(id);

        if (response.data.user) {
          const userData = Array.isArray(response.data.user)
            ? response.data.user[0]
            : response.data.user;
          setForm({ nome: userData.name || "", email: userData.email || "" });
        } else {
          showSnackbar(
            response.data.message || "Usuário não encontrado.",
            "error"
          );
          navigate("/perfil");
        }
      } catch (e) {
        const errorMessage =
          e.response?.data?.error ||
          "Erro ao carregar perfil. Verifique sua conexão ou sessão.";
        showSnackbar(errorMessage, "error");

        if (e.response?.status === 401 || e.response?.status === 403) {
          navigate("/login");
        } else {
          navigate("/perfil");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    document.title = "Atualizar Perfil | SENAI";

    const idUsuario = localStorage.getItem("idUsuario");

    if (idUsuario) {
      setUserId(idUsuario);
      fetchUserProfile(idUsuario);
    } else {
      showSnackbar(
        "Sessão não iniciada. Redirecionando para login.",
        "warning"
      );
      navigate("/login");
    }

    // CORREÇÃO: Removido o bloco refreshToken para evitar redirecionamento forçado.
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      localStorage.removeItem("refresh_token");

      showSnackbar(
        "Sua sessão expirou. É necessário um novo login.",
        "warning"
      );
    }
  }, [navigate, fetchUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const updateLocalUserAndState = (updatedData) => {
    setForm({ nome: updatedData.name, email: updatedData.email });
    // CORREÇÃO: REMOVEMOS O navigate("/perfil") daqui. O usuário deve fechar o modal manualmente.
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name: form.nome, email: form.email };
    try {
      const response = await api.putUpdateProfile(userId, payload);
      const { message, user, data } = response.data;

      if (
        message.includes("Verificação de e-mail necessária") ||
        data?.requiresEmailVerification
      ) {
        showSnackbar(message, "warning");
        setIsVerifyUpdateModalOpen(true);
      } else {
        const updatedUser = user || data;
        if (updatedUser) {
          updateLocalUserAndState({
            name: updatedUser.name,
            email: updatedUser.email,
          });
        } else {
          updateLocalUserAndState(form);
        }

        setModalInfo({ title: "Sucesso!", message, type: "success" });
        setModalOpen(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        "Erro desconhecido ao atualizar perfil.";
      setModalInfo({
        title: "Erro!",
        message: errorMessage,
        type: "error",
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      showSnackbar("As senhas não coincidem.", "error");
      setLoading(false);
      return;
    }
    const payload = {
      password: passwordForm.novaSenha,
      confirmPassword: passwordForm.confirmarSenha,
    };
    try {
      const response = await api.putUpdatePassword(userId, payload);
      const { message } = response.data;

      setModalInfo({ title: "Sucesso!", message, type: "success" });
      setModalOpen(true);
      setIsPasswordModalOpen(false);
      setPasswordForm({ novaSenha: "", confirmarSenha: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Erro desconhecido ao atualizar senha.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const response = await api.deleteProfile(userId);
      showSnackbar(response.data.message, "success");
      setIsDeleteModalOpen(false);
      localStorage.removeItem("tokenUsuario");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("idUsuario");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Erro desconhecido ao deletar perfil.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationResult = (success, message, updatedUser) => {
    if (success) {
      if (updatedUser && updatedUser.email) {
        updateLocalUserAndState({
          name: updatedUser.name,
          email: updatedUser.email,
        });
      } else {
        updateLocalUserAndState({ name: form.nome, email: form.email });
      }

      setModalInfo({
        title: "Sucesso!",
        message: message || "E-mail atualizado e verificado com sucesso.",
        type: "success",
      });
      setModalOpen(true);
      setIsVerifyUpdateModalOpen(false);
    } else {
      setModalInfo({
        title: "Erro na Verificação!",
        message:
          message || "O código de verificação está incorreto. Tente novamente.",
        type: "error",
      });
      setModalOpen(true);
    }
  };

  // Funções de fechamento de Modal que redirecionam para /perfil
  const handleCloseDeleteModal = (event, reason) => {
    if (reason === 'backdropClick') {
      navigate("/perfil");
    }
    setIsDeleteModalOpen(false);
  };

  const handleClosePasswordModal = (event, reason) => {
    if (reason === 'backdropClick') {
      navigate("/perfil");
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ novaSenha: "", confirmarSenha: "" });
  };
  
  const handleCloseVerifyModal = (event, reason) => {
     if (reason === 'backdropClick') {
      navigate("/perfil");
    }
    setIsVerifyUpdateModalOpen(false);
  };


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
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Modal Principal - Editar Perfil */}
        <Box sx={styles.modal}>
          <IconButton
            aria-label="close"
            onClick={() => navigate("/perfil")}
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
              onClick={() => setIsPasswordModalOpen(true)}
              sx={styles.passwordButton}
            >
              Deseja mudar a senha?
            </Button>
            {/* Container para botões Editar e Deletar */}
            <Box sx={styles.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                sx={styles.modalButton}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Editar Perfil"
                )}
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={styles.deleteButton}
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

      {/* Modal de Confirmação de Deleção */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal} // Usando a nova função de fechar/redirecionar
        aria-labelledby="confirm-delete-modal-title"
        aria-describedby="confirm-delete-modal-description"
        sx={modalBackdropStyle} // Adicionado estilo de desfoque
      >
        <Box sx={styles.modalWrapper}>
          <Box sx={styles.confirmModal}>
            <Typography
              id="confirm-delete-modal-title"
              variant="h6"
              component="h2"
              sx={styles.confirmModalTitle}
            >
              Confirmação de Deleção
            </Typography>
            <Typography
              id="confirm-delete-modal-description"
              sx={{ mt: 2, textAlign: "center", color: '#666' }}
            >
              Tem certeza que deseja deletar sua conta? Esta ação é irreversível.
            </Typography>
            <Box sx={styles.confirmModalButtonContainer}>
              <Button
                variant="contained"
                onClick={() => setIsDeleteModalOpen(false)}
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
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirmar"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Modal de Alteração de Senha */}
      <Modal
        open={isPasswordModalOpen}
        onClose={handleClosePasswordModal} // Usando a nova função de fechar/redirecionar
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
        sx={modalBackdropStyle} // Adicionado estilo de desfoque
      >
        <Box sx={styles.modalWrapper}>
          <Box sx={styles.confirmModal}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordForm({ novaSenha: "", confirmarSenha: "" });
              }}
              sx={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="change-password-modal-title"
              variant="h6"
              component="h2"
              sx={styles.confirmModalTitle}
            >
              Alterar Senha
            </Typography>
            <Box
              component="form"
              onSubmit={handleUpdatePassword}
              sx={styles.formContent}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="novaSenha"
                label="Nova Senha"
                name="novaSenha"
                type={showPassword ? "text" : "password"}
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
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmarSenha}
                onChange={handlePasswordChange}
                sx={styles.modalTextField}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                sx={styles.passwordSubmitButton}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirmar Alteração"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Modal de Verificação de E-mail */}
      <Modal
        open={isVerifyUpdateModalOpen}
        onClose={handleCloseVerifyModal} // Usando a nova função de fechar/redirecionar
        aria-labelledby="verify-update-modal-title"
        aria-describedby="verify-update-modal-description"
        sx={modalBackdropStyle} // Adicionado estilo de desfoque
      >
        <Box sx={styles.modalWrapper}>
          <PerfSecuryCode
            email={form.email}
            onResult={handleVerificationResult}
            onClose={() => setIsVerifyUpdateModalOpen(false)}
          />
        </Box>
      </Modal>

      <CustomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
        buttonText="Fechar"
        sx={modalBackdropStyle} // Adicionado estilo de desfoque
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
      backgroundImage: `url('/fundo.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: { xs: "10px", sm: "20px" }, 
      flexGrow: 1,
      minHeight: '80vh',
    },
    modal: {
      width: { xs: "80%", sm: "100%" },
      maxWidth: "380px", 
      bgcolor: "background.paper",
      border: "1px solid #c0c0c0",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      p: 4,
      borderRadius: "15px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    modalTitle: {
      mb: 2,
      fontWeight: "bold",
      color: "#333",
    },
    formContent: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    modalTextField: {
      mb: { xs: 1.5, sm: 2 }, 
      width: '100%',
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        "& fieldset": { borderColor: "transparent" },
        "&:hover fieldset": { borderColor: "transparent" },
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
        "&.Mui-focused": { color: "rgba(255, 0, 0, 1)" },
      },
    },
    buttonContainer: {
      display: "flex",
      justifyContent: { xs: "space-between", sm: "space-between" },
      gap: { xs: "10px", sm: "10px" },
      width: "100%",
      mt: 2,
    },
    modalButton: {
      flexGrow: 1,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
      },
      width: { xs: 'calc(50% - 5px)', sm: 'auto' }, 
    },
    deleteButton: {
      flexGrow: 1,
      backgroundColor: "#dc3545",
      color: "white",
      height: 40,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8,
      textTransform: "none",
      "&:hover": { backgroundColor: "#c82333" },
      width: { xs: 'calc(50% - 5px)', sm: 'auto' }, 
    },
    passwordSubmitButton: {
        width: '100%', 
        mt: 2,
        height: 40,
        fontWeight: 600,
        fontSize: { xs: 13, sm: 14 }, 
        color: "white",
        backgroundColor: "rgba(255, 0, 0, 1)",
        borderRadius: 8,
        textTransform: "none",
        "&.MuiButton-root": {
            border: "none",
            boxShadow: "none",
            "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
        },
    },
    passwordButton: {
      width: "100%",
      textTransform: "none",
      fontSize: "14px",
      color: "rgba(255, 0, 0, 1)",
      mt: -1, 
      mb: 1,
      "&:hover": {
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
      textAlign: 'left',
      justifyContent: 'flex-start',
    },
    closeButton: {
      position: "absolute",
      right: 8,
      top: 8,
      color: "rgba(255, 0, 0, 0.8)",
    },
    modalWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: '90%', sm: 'auto' }, 
        outline: "none",
        p: { xs: 1, sm: 0 }, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '100%', sm: 'auto' }, 
        padding: { xs: '10px', sm: '0' }, 
    },
    confirmModal: {
      width: { xs: '100%', sm: 350 },
      bgcolor: "background.paper",
      boxShadow: 24,
      p: { xs: 3, sm: 4 }, 
      borderRadius: "15px",
      border: "1px solid #c0c0c0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      maxHeight: { xs: 'calc(100vh - 40px)', sm: 'auto' }, 
      overflowY: 'auto', 
    },
    confirmModalTitle: {
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      mb: 2,
    },
    confirmModalButtonContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      mt: 3,
      width: '100%',
    },
    confirmModalButtonCancel: {
      backgroundColor: "#f5f5f5",
      color: "#333",
      fontWeight: "bold",
      flexGrow: 1,
      "&:hover": { backgroundColor: "#e0e0e0" },
    },
    confirmModalButtonConfirm: {
      backgroundColor: "#dc3545",
      color: "white",
      fontWeight: "bold",
      flexGrow: 1,
      "&:hover": { backgroundColor: "#c82333" },
    },
  };
}

export default AtualizarPerfil;