import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Container, Button, Typography } from "@mui/material";
import HeaderCards from "../components/layout/HeaderCards.jsx";
import Footer from "../components/layout/Footer.jsx";
import AddItemModal from "../components/mod/AddItemModal.jsx";
import {
  Settings,
  Archive,
  Extension,
  Construction,
  Folder,
  Add,
  Park,
} from "@mui/icons-material";

function PageCards() {
  const styles = getStyles();
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    document.title = "Cards | SENAI";
  }, []);

  // O componente Card agora passa a categoria no objeto 'state' do React Router
  const Card = ({ title, icon, onClick }) => (
    <Box sx={styles.card}>
      <Box sx={styles.iconContainer}>{icon}</Box>
      <Typography sx={styles.cardTitle}>{title}</Typography>
      <Button
        onClick={onClick} // O botão de adicionar item agora usa um onClick
        component={!onClick ? Link : 'button'} // Alterna entre Link e Button
        to={!onClick ? `/${categoryMap[title]}` : null} // Define o `to` apenas se não houver onClick
        variant="contained"
        sx={styles.cardButton}
      >
        {!onClick ? 'Entrar' : 'Adicionar'}
      </Button>
    </Box>
  );


  const categoryMap = {
    Ferramentas: "tool",
    Materiais: "material",
    Produtos: "product",
    Equipamentos: "equipment",
    "Matéria-prima": "rawMaterial",
    Diversos: "diverses",
  };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={styles.pageContainer}>
      <HeaderCards />
      <Container maxWidth={false} sx={styles.mainContent}>
        <Box sx={styles.cardsGrid}>
          <Card title="Equipamentos" icon={<Settings sx={styles.icon} />} />
          <Card title="Produtos" icon={<Archive sx={styles.icon} />} />
          <Card title="Matéria-prima" icon={<Park sx={styles.icon} />} />
          <Card title="Materiais" icon={<Extension sx={styles.icon} />} />
          <Card title="Ferramentas" icon={<Construction sx={styles.icon} />} />
          <Card title="Diversos" icon={<Folder sx={styles.icon} />} />
          <Card
            title="Adicionar Item"
            icon={<Add sx={styles.icon} />}
            onClick={handleOpenModal} // Chama a função para abrir o modal
          />
        </Box>
      </Container>
      <Footer />
      <AddItemModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}

function getStyles() {
  return {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#E4E4E4",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      gap: "35px",
      maxWidth: "85vw",
      width: "100%",
      justifyItems: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "10px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "170px",
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60px",
      width: "60px",
      borderRadius: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      marginBottom: "10px",
    },
    icon: {
      fontSize: "40px",
      color: "#6c757d",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "10px",
    },
    cardButton: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      "&:hover": {
        backgroundColor: "rgba(150, 14, 14, 1)",
      },
      color: "#ffffff",
      padding: "10px 25px",
      borderRadius: "5px",
      textTransform: "none",
    },
  };
}

export default PageCards;
