import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import sheets from '../../services/axios';

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

const EditUserModal = ({ open, onClose, user, onSuccess, onError }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Garante que o estado seja atualizado com o usuário mais recente
    setEditedUser(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser || !editedUser.idUser) {
      onError('Não foi possível encontrar o usuário para atualização.');
      return;
    }

    setLoading(true);
    try {
      const response = await sheets.updateUser(editedUser.idUser, editedUser);

      if (response.data.success) {
        onSuccess();
      } else {
        onError(response.data.error || 'Erro ao atualizar usuário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      onError(error.response?.data?.error || 'Erro interno do servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Editar Usuário
        </Typography>
        <TextField
          label="Nome"
          name="name"
          value={editedUser?.name || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="E-mail"
          name="email"
          value={editedUser?.email || ''}
          fullWidth
          disabled
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Cargo</InputLabel>
          <Select
            labelId="role-label"
            label="Cargo"
            name="role"
            value={editedUser?.role}
            onChange={handleChange}
          >
            <MenuItem value="manager">Admin</MenuItem>
            <MenuItem value="employee">Comum</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error" 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="success" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;