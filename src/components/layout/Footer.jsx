import { Box, Typography } from "@mui/material";

const Footer = () => {
  const styles = getStyles();
  return (
    <Box sx={styles.footerContainer}>
      <Box sx={styles.footerBorder} />
      <Box sx={styles.footerContent}>
        <Typography sx={styles.footerText}>
          &copy;CSSTORAGE
        </Typography>
      </Box>
    </Box>
  );
};

function getStyles() {
  return {
    footerContainer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    footerBorder: {
      width: "100%",
      height: "7px", // Altura da barra branca fixa em pixels
      backgroundColor: "white",
    },
    footerContent: {
      flexGrow: 1, // Permite que o conteúdo do footer preencha o espaço restante
      minHeight: '45px', // Altura mínima para o conteúdo
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Footer;