import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress
  } from '@mui/material';
  import { useState } from 'react';
  import api from '../../services/axios';
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };
  
  const DeleteUserModal = ({ open, onClose, user, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
      // Adicione uma verificação mais robusta
      if (!user || !user.idUser) {
        onError('Não foi possível encontrar o usuário para exclusão.');
        return;
      }
  
      setLoading(true);
      try {
        // A chamada da API está correta. A instância "api" já deve ter a lógica de token.
        const response = await api.deleteUser(user.idUser);
        
        // Verifique a estrutura da resposta da sua API
        if (response.data.success) {
          onSuccess();
        } else {
          // Capture mensagens de erro mais específicas do backend
          console.log(response.data.details)
          onError(response.data.error || 'Erro ao excluir usuário.');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        // Capture a mensagem de erro específica do backend
        onError(error.response?.data?.error || 'Erro interno do servidor ao tentar excluir o usuário.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Confirmar Exclusão
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Tem certeza que deseja excluir o usuário {user?.name}?
            Esta ação não pode ser desfeita.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={onClose} variant="outlined" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  export default DeleteUserModal;