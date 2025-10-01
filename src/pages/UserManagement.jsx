import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import HeaderPerfil from '../components/layout/HeaderPerfil';
import Footer from '../components/layout/Footer';
import EditUserModal from '../components/mod/EditUserModal';
import DeleteUserModal from '../components/mod/DeleteUserModal';
import CreateUserModal from '../components/mod/CreateUserModal'; 

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const styles = getStyles();

  useEffect(() => {
    document.title = 'Gerenciamento de Usuários';
    fetchUsers();
  }, []);

  const handleAlert = (message, severity = 'error') => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

const checkUserRole = () => {
    const userRole = localStorage.getItem('userRole'); 
    if (userRole !== 'manager') {
      handleAlert('Acesso negado. Você não tem permissão para esta página.', 'error');
      setTimeout(() => navigate('/principal'), 3000);
      return false;
    }
    return true;
  };

  const fetchUsers = async () => {
    if (!checkUserRole()) return;

    setLoading(true);
    try {
      const response = await api.getUsers();
      // Assumindo que a resposta de sucesso da API de getUsers está em response.data
      const usersList = response.data.data[0]?.users || [];
      setUsers(usersList);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      handleAlert('Erro ao carregar usuários. Tente novamente.', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedUser(null);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleUserUpdated = () => {
    // EditUserModal agora cuida do alerta e do fechamento da modal no sucesso.
    // Esta função apenas recarrega a lista.
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
    handleCloseDeleteModal();
  };
  
  const handleUserCreated = () => {
    fetchUsers();
    handleCloseCreateModal();
  };

  const getRoleDisplayName = (role) => {
    if (role === 'manager') return 'Admin';
    if (role === 'user') return 'Comum';
    return role;
  };

  return (
    <Box sx={styles.pageLayout}>
      <HeaderPerfil />
      <Container component="main" sx={styles.container}>
        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
        <Box sx={styles.cardContainer}>
          <Box sx={styles.header}>
            <Typography variant="h6" component="h2">
              Lista de Usuários
            </Typography>
            <IconButton onClick={handleOpenCreateModal} sx={styles.addButton}>
              <AddIcon />
            </IconButton>
          </Box>
          <Divider />
          {loading ? (
            <Box sx={styles.loadingBox}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Carregando...</Typography>
            </Box>
          ) : users.length === 0 ? (
            <Typography sx={styles.noUsersText}>Nenhum usuário encontrado.</Typography>
          ) : (
            users.map((user) => (
              <Paper key={user.idUser} sx={styles.userCard}>
                <Box sx={styles.userInfo}>
                  <Typography variant="body1" sx={styles.userName}>
                    Nome do Usuário: {user.name}
                  </Typography>
                  <Typography variant="body2" sx={styles.userRole}>
                    Cargo: {getRoleDisplayName(user.role)}
                  </Typography>
                </Box>
                <Box sx={styles.actionIcons}>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenEditModal(user)}
                    sx={styles.editButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleOpenDeleteModal(user)}
                    sx={styles.deleteButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>

        <EditUserModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onSuccess={handleUserUpdated}
          onAlert={handleAlert}
        />
        
        <DeleteUserModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          user={selectedUser}
          onSuccess={handleUserDeleted}
          onAlert={handleAlert}
        />
        
        <CreateUserModal
          open={openCreateModal}
          onClose={handleCloseCreateModal}
          onSuccess={handleUserCreated}
          onAlert={handleAlert}
        />
      </Container>
      <Footer />
    </Box>
  );
}

function getStyles() {
  return {
    pageLayout: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor:"#E4E4E4"
    },
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    cardContainer: {
      borderRadius: '15px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px',
      padding: '20px',
      backgroundColor:"#F9F9F9"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    },
    addButton: {
      color: 'rgba(255, 0, 0, 1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.05)',
      }
    },
    loadingBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    },
    noUsersText: {
      textAlign: 'center',
      color: 'gray',
      py: 4,
    },
    userCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      mt: 2,
      borderRadius: '10px',
      border: '1px solid #e0e0e0',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontWeight: 'bold',
      color: '#333',
    },
    userRole: {
      color: 'gray',
      fontSize: '0.9rem',
    },
    actionIcons: {
      display: 'flex',
      gap: 1,
    },
    editButton: {
      color: '#1976d2',
    },
    deleteButton: {
      color: '#d32f2f',
    },
  };
}

export default UserManagement;