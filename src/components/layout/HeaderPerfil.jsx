import { Link } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useEffect, useState } from "react";

// Função para buscar o usuário no localStorage e determinar a role
const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.role : null;
  } catch (e) {
    console.error("Erro ao ler user do localStorage:", e);
    return null;
  }
};

const HeaderPerfil = () => {
  // Inicializa o estado lendo o localStorage logo de cara
  const [userRole, setUserRole] = useState(getUserRole());
  const styles = getStyles();

  // 🚨 CORREÇÃO AQUI: Adiciona os Event Listeners 🚨
  useEffect(() => {
    const handleStorageChange = () => {
        // Reler a role quando o evento 'storage' é disparado
        setUserRole(getUserRole());
    };
    
    // Escuta mudanças no localStorage (disparado pelo EditUserModal)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuta o retorno para a aba. Ajuda a sincronizar entre abas.
    // Também garante que a role é lida corretamente caso o useEffect inicial 
    // não tenha pego.
    window.addEventListener('focus', handleStorageChange);

    return () => {
      // Limpeza dos listeners na desmontagem
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []); // Roda apenas na montagem e desmontagem

  const isManager = userRole === "manager";

  return (
    <Box sx={styles.header}>
      {isManager && (
        <IconButton
          component={Link}
          to="/adm/users"
          sx={styles.managerIconOuter} 
          aria-label="Gerenciar Usuários"
        >
          <ManageAccountsIcon sx={styles.managerIconInner} />
        </IconButton>
      )}

      <Button component={Link} to="/principal" sx={styles.buttonHome}>
        <HomeIcon sx={styles.HomeIcon} />
      </Button>
    </Box>
  );
};


function getStyles() {
  // Define um estilo base para o contêiner do ícone (o círculo vermelho)
  const baseIconContainerStyle = {
    borderRadius: "50%",
    backgroundColor: "darkred",
    border: "4px solid white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0.5,
    color: "white",
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

    // 1. Estilo do Contêiner (círculo) do Manager.
    managerIconOuter: {
      ...baseIconContainerStyle,
      mr: 1,
      width: { xs: 35, sm: 45 },
      height: { xs: 35, sm: 45 },
      '&:hover': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      }
    },

    // 2. Estilo do Desenho Interno (Personagem) do Manager. AUMENTADO AQUI.
    managerIconInner: {
      fontSize: { xs: 20, sm: 30 },
    },

    buttonHome: {
      mr: { xs: 0.5, sm: 1.5 },
    },

    // Estilo do Ícone Home
    HomeIcon: {
      ...baseIconContainerStyle,
      width: { xs: 20, sm: 30 },
      height: { xs: 20, sm: 30 },
      // Definindo o tamanho do desenho da casinha (mantido menor para preenchimento)
      fontSize: { xs: 15, sm: 25 }, 
    },
  };
}

export default HeaderPerfil;