import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import logo from "../../../public/logo.png";
import { useEffect, useState } from "react";

const getUserRole = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole || null;
};


const HeaderPrincipal = ({}) => {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
    navigate("/");
  }

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
  
  // Base style object definido no componente para neutralizar o padding do Button
  const buttonContainerStyle = {
    padding: 0,
    minWidth: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    ml: { xs: 0.5, sm: 1 }, // Espaçamento entre ícones
  };


  return (
    <Box sx={styles.header}>
      <img src={logo} alt="Logo" style={styles.logo} />
      <Box sx={styles.iconGroupContainer}> 
        {isManager && (
            <Button 
                component={Link} 
                to="/adm/reports"
                sx={styles.iconButtonContainer} 
            >
                <Box sx={styles.ReportsIconContainer}>
                    <FolderIcon sx={styles.iconContent} />
                </Box>
            </Button>
        )}
        <Button component={Link} to="/perfil" sx={styles.iconButtonContainer}>
          <Box sx={styles.PersonIconContainer}>
            <PersonIcon sx={styles.iconContent} />
          </Box>
        </Button>
        <Button component={Link} to="/" sx={styles.buttonHome} onClick={logout}>
          <Box sx={styles.LogoutIconContainer}>
            <LogoutIcon sx={styles.iconContent} />
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

function getStyles() {
    // Definição base ajustada para mobile (xs: 25px) e desktop (sm: 30px)
  const baseSize = { xs: 35, sm: 40 }; 
  const iconSize = { xs: 20, sm: 25 }; 
    const senaiRed = "rgba(177, 16, 16, 1)";
    const darkRed = "darkred"; 

    // 1. Estilo Base do Círculo (Container Vermelho/Borda Branca)
    const iconBaseStyle = {
        width: baseSize,
        height: baseSize,
        borderRadius: "50%",
        backgroundColor: darkRed,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white",
        color: "white",
        flexShrink: 0,
        transition: 'background-color 0.3s',
        // Garante que o ícone interno seja visível
        '& .MuiSvgIcon-root': {
            fontSize: iconSize, 
        }
    };
    
    // 2. Estilo do Conteúdo SVG (Ícone interno)
    const iconContentStyle = {
        fontSize: iconSize,
    };


  return {
    header: {
      backgroundColor: senaiRed,
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center", // Centraliza tudo verticalmente
      justifyContent: "space-between",
      borderBottom: "1vh solid white",
    },
    // Container para os 3 ícones, alinhado à direita
    iconGroupContainer: { 
        display: 'flex',
        alignItems: 'center', 
        gap: { xs: 0.5, sm: 1 }, // Espaçamento mínimo entre os ícones
        mr: { xs: 1, sm: 3 }, // Margem direita para respirar
    },
    // Estilo para o Button (Neutraliza o padding do MUI)
    iconButtonContainer: {
        padding: 0,
        minWidth: 0,
        ml: { xs: 0.5, sm: 1 }, 
        '&:hover': {
            backgroundColor: 'transparent',
        }
    },
    // Estilo para o botão de logout (sem margem extra)
    buttonHome: { 
        padding: 0,
        minWidth: 0,
        '&:hover': { backgroundColor: 'transparent' },
        ml: { xs: 0.5, sm: 1 },
    },

    // --- Definições dos Ícones (Usam o estilo base) ---
    iconContent: iconContentStyle,

    ReportsIconContainer: {
        ...iconBaseStyle,
        '&:hover': {
            backgroundColor: "rgba(100, 0, 0, 1)",
        }
    },
    PersonIconContainer: {
        ...iconBaseStyle,
         '&:hover': {
            backgroundColor: "rgba(100, 0, 0, 1)",
        }
    },
    LogoutIconContainer: {
        ...iconBaseStyle,
         '&:hover': {
            backgroundColor: "rgba(100, 0, 0, 1)",
        }
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      // 🎯 CORREÇÃO: Diminui a margem esquerda no mobile
      marginLeft: { xs: 8, sm: 30 }, 
    },
  };
}

export default HeaderPrincipal;