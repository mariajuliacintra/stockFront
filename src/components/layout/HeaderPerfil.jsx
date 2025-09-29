import { Link } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useEffect, useState } from "react";

const getUserRole = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole || null;
};

const HeaderPerfil = () => {
  const [userRole, setUserRole] = useState(getUserRole());
  const styles = getStyles(); 

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(getUserRole());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []); 

  const isManager = userRole === "manager";

  return (
    <Box sx={styles.header}>
      {isManager && (
        <IconButton
          component={Link}
          to="/adm/users"
          sx={styles.buttonStyle} 
          aria-label="Gerenciar Usuários"
        >
          <ManageAccountsIcon sx={styles.managerIconStyle} />
        </IconButton>
      )}
      <Button component={Link} to="/principal" sx={styles.buttonHome}>
        <HomeIcon sx={styles.HomeIcon} />
      </Button>
    </Box>
  );
};

function getStyles() {
  const baseIconStyle = {
    width: { xs: 20, sm: 30 },
    height: { xs: 20, sm: 30 },
    borderRadius: "50%",
    backgroundColor: "darkred",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "4px solid white",
    color: "white",
    padding: 0.5,
    fontSize: { xs: 15, sm: 25 },
  };

  // Estilo do Contêiner do Botão (para remover padding/margem extras)
  const buttonContainerStyle = {
    padding: 0,
    minWidth: 0,
    // Estilo de hover simples para o IconButton (Manager)
    '&:hover': {
      backgroundColor: 'transparent',
    }
  };

  return {
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "1vh solid white",
    }, 

    // Estilo do botão do Manager (IconButton)
    buttonStyle: {
      ...buttonContainerStyle,
      mr: 1, // Espaçamento à direita
      // O IconButton (Manager) precisa de um hover:
      '&:hover .MuiSvgIcon-root': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      },
    },

    // Estilo do desenho interno do Manager
    managerIconStyle: {
      ...baseIconStyle,
      // O ManageAccountsIcon é um ícone maior, ajustamos o tamanho de exibição para caber no círculo
      fontSize: { xs: 20, sm: 30 },
    },

    // O seu botão Home (agora de Link)
    buttonHome: {
      ...buttonContainerStyle, // Remove padding padrão
      mr: { xs: 0.5, sm: 1.5 },
      '&:hover .MuiSvgIcon-root': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      },
    }, 

    // Estilo do Ícone Home
    HomeIcon: {
      ...baseIconStyle,
      fontSize: { xs: 20, sm: 30 },
    },
  };
}

export default HeaderPerfil;