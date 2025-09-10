import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Modal, // Importação do Modal
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import FooterPerfil from "../components/layout/Footer";
import HeaderPerfil from "../components/layout/Header";


function AtualizarPerfil() {
  const styles = getStyles();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Novo estado para o modal de exclusão

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // LÓGICA DE VALIDAÇÃO E ATUALIZAÇÃO DO PERFIL
    // A SENHA E AS ALTERAÇÕES DEVEM SER ENVIADAS PARA O SERVIDOR
    console.log("Perfil atualizado:", form);

    // Redireciona para a página de perfil após a atualização
    navigate('/perfil');
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true); // Abre o modal de confirmação
  };

  const handleConfirmDelete = () => {
    // Lógica real de exclusão do perfil aqui
    console.log("Perfil confirmado para exclusão.");
    // Exemplo: Chamar uma API para deletar o usuário
    // api.delete('/user/delete', { headers: { Authorization: token } });

    // Após a exclusão, feche o modal e redirecione o usuário
    setIsDeleteModalOpen(false);
    // Exemplo: Remover dados do localStorage e redirecionar para a página de login
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');
    // navigate('/login');
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false); // Fecha o modal de confirmação
  };

  const handleClose = () => {
    // Redireciona de volta para a página de perfil
    navigate('/perfil');
  };

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" maxWidth={false} sx={styles.container}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="novaSenha"
              label="Nova Senha"
              name="novaSenha"
              type={showPassword ? 'text' : 'password'}
              value={form.novaSenha}
              onChange={handleChange}
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
              value={form.confirmarSenha}
              onChange={handleChange}
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

            <Box sx={styles.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                sx={styles.modalButton}
              >
                Editar Perfil
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{...styles.modalButton, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
                onClick={handleDelete}
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
            >
              Confirmar
            </Button>
          </Box>
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
    closeButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'rgba(255, 0, 0, 0.8)',
    },
    // Estilos para o Modal de Confirmação de Exclusão
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
    },
    confirmModalTitle: {
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
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
    }
  };
}

export default AtualizarPerfil;