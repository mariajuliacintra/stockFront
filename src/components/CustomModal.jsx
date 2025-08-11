import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Slide,
  Fade,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const closeDelay = 5000;

export default function CustomModal({
  open,
  onClose,
  title,
  message,
  buttonText = "OK",
  type = "info",
}) {
  const iconProps =
    {
      success: { IconComponent: CheckCircleOutlineIcon, color: "#4CAF50" },
      error: { IconComponent: ErrorOutlineIcon, color: "#F44336" },
      info: { IconComponent: InfoOutlinedIcon, color: "#2196F3" },
    }[type] || {};

  const backgroundColors = {
    success: "#E8F5E9",
    error: "#FFEBEE",
    info: "#E3F2FD",
  };

  const borderColors = {
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
  };

  const buttonColors = {
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
  };

  const isSmallMessage = message && message.length < 60;

  useEffect(() => {
    if (open && isSmallMessage) {
      const timer = setTimeout(() => {
        onClose();
      }, closeDelay);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, isSmallMessage]);

  const getDynamicStyles = () => {
    const iconColor = iconProps.color;
    const backgroundColor = backgroundColors[type] || backgroundColors.info;
    const borderColor = borderColors[type] || borderColors.info;
    const buttonBgColor = buttonColors[type] || buttonColors.info;

    return {
      overlay: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(3px)",
      },
      container: {
        width: { xs: "90%", sm: 400 },
        maxWidth: 400,
        padding: { xs: "24px", sm: "32px" },
        borderRadius: "15px",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow:
          "0 8px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        textAlign: "center",
      },
      icon: {
        fontSize: { xs: "6rem", sm: "7rem" },
        color: iconColor,
        mb: "16px",
      },
      title: {
        fontSize: { xs: "1.5rem", sm: "1.8rem" },
        fontWeight: "700",
        color: "#333",
        mb: "12px",
        lineHeight: 1.2,
      },
      message: {
        fontSize: { xs: "1rem", sm: "1.1rem" },
        color: "#666",
        lineHeight: 1.5,
        mb: "24px",
      },
      button: {
        width: "80%",
        paddingY: "12px",
        borderRadius: "10px",
        backgroundColor: buttonBgColor,
        color: "#fff",
        fontSize: { xs: "1rem", sm: "1.1rem" },
        fontWeight: "600",
        textTransform: "none",
        boxShadow: `0 4px 5px ${buttonBgColor}40`,
        "&:hover": {
          backgroundColor: buttonBgColor,
          boxShadow: `0 6px 8px ${buttonBgColor}60`,
        },
        transition: "all 0.3s ease-in-out",
      },
      toastOverlay: {
        position: "fixed",
        top: { xs: "20px", sm: "30px" },
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1400,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      },
      toastContainer: {
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: { xs: "60px", sm: "70px" },
        width: { xs: "90%", sm: 500 },
        maxWidth: 500,
        padding: { xs: "12px 16px", sm: "5px 20px" },
        borderRadius: "10px",
        borderLeft: `6px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        gap: { xs: "8px", sm: "12px" },
      },
      toastIcon: {
        fontSize: { xs: "1.5rem", sm: "1.8rem" },
        color: iconColor,
        mr: { xs: "8px", sm: "12px" },
        flexShrink: 0,
      },
      toastMessage: {
        flexGrow: 1,
        fontSize: { xs: "0.9rem", sm: "1rem" },
        fontWeight: "500",
        color: iconColor,
        wordBreak: "break-word",
        textAlign: "left",
      },
      toastCloseButton: {
        color: iconColor,
        padding: "4px",
        ml: { xs: "8px", sm: "12px" },
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.05)",
        },
        flexShrink: 0,
      },
    };
  };

  const styles = getDynamicStyles();

  const IconComponent = iconProps.IconComponent;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      BackdropProps={{
        timeout: 300,
      }}
      // Apply overlay styles only when it's not a small message (toast)
      sx={isSmallMessage ? {} : styles.overlay}
    >
      {isSmallMessage ? (
        <Fade in={open} timeout={{ enter: 0, exit: 300 }}>
          <Box sx={styles.toastOverlay}>
            <Slide
              direction="down"
              in={open}
              mountOnEnter
              unmountOnExit
              timeout={300}
            >
              <Box sx={styles.toastContainer}>
                {IconComponent && <IconComponent sx={styles.toastIcon} />}
                <Typography sx={styles.toastMessage}>{message}</Typography>
                <IconButton onClick={onClose} sx={styles.toastCloseButton}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Slide>
          </Box>
        </Fade>
      ) : (
        // For standard modals
        <Fade in={open} timeout={{ enter: 300, exit: 300 }}>
          <Box sx={styles.container}>
            {IconComponent && <IconComponent sx={styles.icon} />}
            <Typography id="modal-title" sx={styles.title}>
              {title}
            </Typography>
            <Typography id="modal-description" sx={styles.message}>
              {message}
            </Typography>
            <Button onClick={onClose} sx={styles.button} variant="contained">
              {buttonText}
            </Button>
          </Box>
        </Fade>
      )}
    </Modal>
  );
}
