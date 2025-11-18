import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import sheets from "../services/axios";

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
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import Footer from "../components/layout/Footer";
import EditUserModal from "../components/mod/EditUserModal";
import DeleteUserModal from "../components/mod/DeleteUserModal";
import CreateUserModal from "../components/mod/CreateUserModal";
import HeaderAdm from "../components/layout/HeaderAdm";

const USERS_PER_PAGE = 15;

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const styles = getStyles();

  useEffect(() => {
    document.title = "Gerenciamento de Usuários";
    fetchUsers(page);
  }, [page]);

  const handleAlert = (message, severity = "error") => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  const checkUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "manager") {
      handleAlert(
        "Acesso negado. Você não tem permissão para esta página.",
        "error"
      );
      setTimeout(() => navigate("/principal"), 3000);
      return false;
    }
    return true;
  };

  const fetchUsers = async (currentPage) => {
    if (!checkUserRole()) return;

    setLoading(true);
    try {
      const response = await sheets.getUsers({
        params: { page: currentPage, limit: USERS_PER_PAGE },
      });

      const usersList = response.data.users || [];
      const paginationData = response.data.pagination;

      const totalPagesCount = paginationData?.totalPages || 1;

      setUsers(usersList);
      setTotalPages(totalPagesCount);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Erro ao carregar usuários. Tente novamente.";
      handleAlert(errorMsg, "error");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
    fetchUsers(page);
  };

  const handleUserDeleted = () => {
    if (users.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      fetchUsers(page);
    }
    handleCloseDeleteModal();
  };
  const handleUserCreated = () => {
    fetchUsers(page);
    handleCloseCreateModal();
  };

  const getRoleDisplayName = (role) => {
    if (role === "manager") return "Admin";
    if (role === "user") return "Comum";
    return role;
  };

  return (
    <Box sx={styles.pageLayout}>
      <HeaderAdm />
      <Container component="main" sx={styles.container}>
        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        <Box sx={styles.cardContainer}>
          <Box sx={styles.header}>
            {/* 🎯 Ajuste no título para garantir a responsividade da fonte */}
            <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '1.2rem', sm: '1.5rem' } 
                }}
            >
              Gerenciamento de Usuários
            </Typography>

            {/* 🎯 Botão Adicionar ajustado */}
            <IconButton onClick={handleOpenCreateModal} sx={styles.addButton}>
              <AddIcon sx={styles.addIconStyle} /> {/* Usa o novo estilo do ícone */}
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, borderColor: "#ccc" }} />
          {/* Conteúdo Principal */}
          {loading ? (
            <Box sx={styles.loadingBox}>
              <CircularProgress color="error" />
              <Typography sx={{ mt: 2 }}>Carregando...</Typography>
            </Box>
          ) : users.length === 0 ? (
            <Typography sx={styles.noUsersText}>
              Nenhum usuário encontrado.
            </Typography>
          ) : (
            <>
              {/* Lista de Usuários */}
              {users.map((user) => (
                <Paper key={user.idUser} sx={styles.userCard}>
                  <Box sx={styles.userInfo}>
                    <Typography variant="body2" sx={styles.userName}>
                      {user.name}
                    </Typography>

                    <Typography variant="body2" sx={styles.userRole}>
                      Cargo:
                      <Box
                        component="span"
                        sx={{ fontWeight: "bold", ml: 0.5 }}
                      >
                        {getRoleDisplayName(user.role)}
                      </Box>
                    </Typography>
                  </Box>

                  <Box sx={styles.actionIcons}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleOpenEditModal(user)}
                      sx={styles.editButton}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      aria-label="delete"
                      onClick={() => handleOpenDeleteModal(user)}
                      sx={styles.deleteButton}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}

              {/* Componente de Paginação (visível apenas se houver mais de 1 página) */}

              {totalPages > 1 && (
                <Box sx={styles.paginationBox}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": { color: styles.senaiRed },
                      "& .Mui-selected": {
                        backgroundColor: styles.senaiRed,
                        color: "white",
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
        {/* Modals (mantidos) */}

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
  const senaiRed = "#A31515";
  const primaryBlue = "#1976d2";
  const errorRed = "#d32f2f";

  return {
    senaiRed: senaiRed,
    pageLayout: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#E4E4E4",
    },
    container: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      // Reduz o padding externo em mobile
      padding: { xs: "10px", sm: "20px" }, 
      pt: { xs: 4, md: 6 },
      pb: 8,
    },
    cardContainer: {
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      // Ajusta a largura para 95% no mobile
      width: { xs: "90%", sm: "100%" }, 
      maxWidth: "480px",
      // Reduz o padding interno em mobile
      padding: { xs: "15px", sm: "20px" }, 
      backgroundColor: "#FFFFFF",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      // Reduz a margem inferior em mobile
      mb: { xs: 1.5, sm: 2 }, 
    },
    // Estilo para o IconButton de adição
    addButton: {
      color: senaiRed,
      // Padding reduzido no mobile
      p: { xs: 0.8, sm: 1 }, 
      border: `2px solid ${senaiRed}`,
      borderRadius: "50%",
      transition: "all 0.3s",
      "&:hover": {
        backgroundColor: senaiRed,
        color: "#fff",
      },
    },
    // Estilo para o ÍCONE dentro do IconButton de adição
    addIconStyle: {
        fontSize: { xs: 20, sm: 24 }, // Reduz o tamanho do ícone
    },
    loadingBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 4,
    },
    noUsersText: {
      textAlign: "center",
      color: "#888",
      py: 4,
    },
    userCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      // Reduz o padding interno no mobile
      p: { xs: 1, sm: 1.5 }, 
      mt: 1.5,
      borderRadius: "8px",
      border: "1px solid #f0f0f0",
      transition: "box-shadow 0.3s",
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: 0,
    },
    userName: {
      fontWeight: "bold",
      color: "#333",
      fontSize: "1rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    userRole: {
      color: "#444",
      fontSize: "0.85rem",
      fontWeight: 400,
    },
    actionIcons: {
      display: "flex",
      gap: 0.5,
      flexShrink: 0,
      ml: 1,
    },
    // Reduz o padding dos botões de ação no mobile
    editButton: {
      color: primaryBlue,
      p: { xs: 0.3, sm: 0.5 }, 
      "&:hover": {
        backgroundColor: `${primaryBlue}10`,
      },
    },
    deleteButton: {
      color: errorRed,
      p: { xs: 0.2, sm: 0.5 }, 
      "&:hover": {
        backgroundColor: `${errorRed}10`,
      },
    },
    paginationBox: {
      display: "flex",
      justifyContent: "center",
      mt: 3,
      py: 1,
    },
  };
}

export default UserManagement;