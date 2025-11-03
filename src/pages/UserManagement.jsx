import { useState, useEffect } from "react";
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

// Define o limite de usuários por página: 25 (Sincronizado com o back-end)
const USERS_PER_PAGE = 15;

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ESTADOS DE PAGINAÇÃO
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
  }; // Handler para a mudança de página no componente Pagination

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
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Gerenciamento de Usuários
            </Typography>

            <IconButton onClick={handleOpenCreateModal} sx={styles.addButton}>
              <AddIcon sx={{ fontSize: 24 }} />
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
      padding: "20px",
      pt: { xs: 4, md: 6 },
      pb: 8,
    },
    cardContainer: {
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "480px",
      padding: "20px",
      backgroundColor: "#FFFFFF",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
    addButton: {
      color: senaiRed,
      p: 1,
      border: `2px solid ${senaiRed}`,
      borderRadius: "50%",
      transition: "all 0.3s",
      "&:hover": {
        backgroundColor: senaiRed,
        color: "#fff",
      },
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
      p: 1.5,
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
    editButton: {
      color: primaryBlue,
      p: 0.5,
      "&:hover": {
        backgroundColor: `${primaryBlue}10`,
      },
    },
    deleteButton: {
      color: errorRed,
      p: 0.5,
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
