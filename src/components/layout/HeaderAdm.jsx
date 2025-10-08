import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

const HeaderAdm = ({}) => {
  const styles = getStyles();

  return (
    <Box sx={styles.header}>
      <Box>
        {/* Botão Perfil */}
        <Button component={Link} to="/perfil" sx={styles.buttonIcon}> 
          <PersonIcon sx={styles.PersonIcon} />
        </Button>
        {/* Botão Home */}
        <Button component={Link} to="/principal" sx={styles.buttonHome}>
          <HomeIcon sx={styles.HomeIcon} />
        </Button>
      </Box>
    </Box>
  );
};

function getStyles() {
    // Definimos o estilo padrão do ícone para evitar repetição
    const iconBaseStyle = {
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
    buttonHome: {
      mr: { xs: 0.5, sm: 1.5 },
    },
    buttonIcon: { // Adicionado para dar padding zero aos botões de ícone (opcional)
        padding: 0,
        minWidth: 0,
        mr:1.1
    },
    
    // Ícone Home - Adicionado para padronizar o visual
    HomeIcon: {
        ...iconBaseStyle,
    },
    
    // Ícone Logout - Mantido para referência (se precisar usá-lo)
    LogoutIcon: {
      ...iconBaseStyle,
    },
    
    // Ícone Perfil
    PersonIcon: {
      ...iconBaseStyle,
    },

    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: { xs: 1, sm: 3 }, 
    },
  };
}

export default HeaderAdm;