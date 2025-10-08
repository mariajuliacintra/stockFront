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

  const buttonContainerStyle = {
    padding: 0.8,
    minWidth: 0,
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

    buttonStyle: {
      ...buttonContainerStyle,  
      mr: 1,
      '&:hover .MuiSvgIcon-root': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      },
    },

    managerIconStyle: {
      ...baseIconStyle,
      fontSize: { xs: 20, sm: 30 },
    },

    buttonHome: {
      ...buttonContainerStyle,
      mr: { xs: 0.5, sm: 1.5 },
      '&:hover .MuiSvgIcon-root': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      },
    }, 

    HomeIcon: {
      ...baseIconStyle,
      fontSize: { xs: 20, sm: 30 },
    },
  };
}

export default HeaderPerfil;