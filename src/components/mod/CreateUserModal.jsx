import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Modal,
} from '@mui/material';
import sheets from '../../services/axios';
import CustomModal from './CustomModal';
import SecuryCode from './SecuryCode';

function CreateUserModal({ open, onClose, onSuccess, onError }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleCreateUser = async () => {
    // Validação básica no front
    if (!name || !email || !password) {
      onError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const response = await sheets.registerUser({
        name,
        email,
        password,
      });

      if (response.data.success) {
        setShowCodeModal(true);
      } else {
        // Se a resposta for um erro, use a mensagem do backend.
        onError(response.data.error || 'Erro ao tentar criar usuário.');
      }
    } catch (error) {
      // Captura a mensagem de erro específica do backend.
      const apiErrorMessage = error.response?.data?.error || error.response?.data?.message || 'Erro interno do servidor';
      const apiDetailsMessage = error.response?.data?.details;
      
      let finalErrorMessage = apiErrorMessage;
      if (apiDetailsMessage) {
        finalErrorMessage += `: ${apiDetailsMessage}`;
      }

      onError(finalErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationResult = async (success, message) => {
    setShowCodeModal(false);
    if (success) {
      onSuccess(); // Sucesso: atualiza a lista de usuários
      onClose(); // Fecha a modal principal
      onError(message);
    } else {
      onError(message);
    }
  };

  const handleClose = () => {
    // Resetar estados ao fechar a modal
    setName('');
    setEmail('');
    setPassword('');
    setLoading(false);
    setShowCodeModal(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-user-modal-title"
      aria-describedby="create-user-modal-description"
    >
      <Box sx={modalStyles}>
        <Typography id="create-user-modal-title" variant="h6" component="h2" mb={2}>
          Criar Novo Usuário
        </Typography>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="E-mail"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={loading || !name || !email || !password}
          >
            {loading ? <CircularProgress size={24} /> : 'Criar'}
          </Button>
        </Box>

        {/* Modal de verificação de código */}
        <Modal open={showCodeModal} onClose={() => setShowCodeModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <SecuryCode
              email={email}
              onResult={handleVerificationResult}
              onClose={() => setShowCodeModal(false)}
            />
          </Box>
        </Modal>
      </Box>
    </Modal>
  );
}

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

export default CreateUserModal;