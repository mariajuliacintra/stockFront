import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import CustomModal from "../components/mod/CustomModal";
import Header from "../components/layout/HeaderPerfil";
import Footer from "../components/layout/Footer";
import sheets from "../services/axios";
import fundoImage from '../../img/fundo.png'; // Importe a imagem de fundo

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCustom, setModalCustom] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    document.title = "Minhas Transações";
    fetchTransactions();
  }, []);

  const handleCloseCustomModal = () => {
    setModalCustom((prev) => ({ ...prev, open: false }));
  };

  async function fetchTransactions() {
    setLoading(true);
    let storedUserData = null;
    try {
      const storedUserString = localStorage.getItem("user");
      if (storedUserString) {
        storedUserData = JSON.parse(storedUserString);
      }
    } catch (e) {
      console.error("Erro ao fazer o parse do JSON do usuário:", e);
    }
    const userId = storedUserData?.idUser;
    
    if (!userId) {
      setModalCustom({
        open: true,
        title: "Erro de Autenticação!",
        message: "ID do usuário não encontrado. Faça o login novamente.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await sheets.getTransactionsByUser(userId);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTransactions([]);
        setModalCustom({
          open: true,
          title: "Nenhuma Transação!",
          message: "Nenhuma transação encontrada para este usuário.",
          type: "info",
        });
      } else {
        const errorMessage = error.response?.data?.error || "Erro ao carregar transações.";
        setModalCustom({
          open: true,
          title: "Erro!",
          message: errorMessage,
          type: "error",
        });
        setTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Objeto para traduzir as descrições das ações
  const actionTranslations = {
    'IN': 'Entrada',
    'OUT': 'Retirada',
    'REAJUST': 'Reajuste',
  };

  const styles = getStyles();

  return (
    <Box sx={styles.pageLayout}>
      <Header />
      <Container component="main" maxWidth={false} sx={styles.container}>
        <Box sx={styles.transactionsBox}>
          <Box sx={styles.header}>
            <Typography component="h1" variant="h5" sx={styles.title}>
              Minhas Transações
            </Typography>
          </Box>
          {loading ? (
            <Box sx={styles.loadingBox}>
              <CircularProgress />
            </Box>
          ) : transactions.length === 0 ? (
            <Box sx={styles.noTransactionsBox}>
              <Typography variant="body1" sx={{ color: "gray" }}>
                Nenhuma transação encontrada.
              </Typography>
            </Box>
          ) : (
            <Box sx={styles.transactionsList}>
              {transactions.map((transaction, index) => {
                const formattedDate = new Date(transaction.transactionDate).toLocaleDateString();

                return (
                  <Box key={index} sx={styles.transactionItem}>
                    <Typography variant="body1" sx={styles.transactionTitle}>
                      Pedido {index + 1}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ fontWeight: "bold" }}>Nome do Item:</span>{" "}
                      {transaction.itemName}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ fontWeight: "bold" }}>Tipo da Ação:</span>{" "}
                      {actionTranslations[transaction.actionDescription] || transaction.actionDescription}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ fontWeight: "bold" }}>Quantidade:</span>{" "}
                      {transaction.quantityChange}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ fontWeight: "bold" }}>Data do Pedido:</span>{" "}
                      {formattedDate}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
      <CustomModal
        open={modalCustom.open}
        onClose={handleCloseCustomModal}
        title={modalCustom.title}
        message={modalCustom.message}
        type={modalCustom.type}
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
      backgroundImage: `url(${fundoImage})`,
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
    transactionsBox: {
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: "400px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      position: "relative",
    },
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontWeight: "bold",
      color: "#333",
    },
    transactionsList: {
      width: "100%",
      maxHeight: "60vh",
      overflowY: "auto",
    },
    transactionItem: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "15px",
      "&:not(:last-child)": {
        borderBottom: "1px solid #eee",
        marginBottom: "15px",
      },
    },
    transactionTitle: {
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333",
    },
    loadingBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
    },
    noTransactionsBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100px",
    },
  };
}

export default Transactions;