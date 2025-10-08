import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import logo from "../../../img/logo.png";
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


  return (
    <Box sx={styles.header}>
      <img src={logo} alt="Logo" style={styles.logo} />
      <Box>
        {isManager && (
            <Button 
                component={Link} 
                to="/adm/reports"
                sx={{
                    ...buttonContainerStyle, 
                    '&:hover .MuiSvgIcon-root': {
                        backgroundColor: "rgba(100, 0, 0, 1)",
                    },
                }}
            >
                <FolderIcon 
                    sx={{
                        ...baseIconStyle,
                        fontSize: { xs: 20, sm: 30 },
                    }} 
                />
            </Button>
        )}
        <Button component={Link} to="/perfil" >
          <PersonIcon sx={styles.PersonIcon} />
        </Button>
        <Button component={Link} to="/" sx={styles.buttonHome} onClick={logout}>
          <LogoutIcon sx={styles.LogoutIcon} />
        </Button>
      </Box>
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
    fontSize: { xs: 20, sm: 30 },
  };

  return {
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1vh solid white",
    },
    buttonHome: { 
      mr: { xs: 0.5, sm: 1.5 },
      '&:hover .MuiSvgIcon-root': {
          backgroundColor: "rgba(100, 0, 0, 1)",
      },
    },
    LogoutIcon: {
      ...baseIconStyle,
    },
    PersonIcon: {
      ...baseIconStyle,
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:hover .MuiSvgIcon-root': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      },
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: 30,
    },
  };
}

export default HeaderPrincipal;