
import {
  Box,
  Typography,
} from "@mui/material";

const Footer = () => {
  const styles = getStyles();
  return (
    <Box sx={styles.footer}>
      <Typography sx={styles.footerText}>
        &copy;CSSTORAGE
      </Typography>
    </Box>
  );
};

function getStyles() {
  return {
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
      marginTop: "auto",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Footer;
