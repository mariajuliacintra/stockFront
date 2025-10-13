import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';


export default function DeleteConfirmationModal({
    open,
    onClose,
    itemName,
    onConfirm,
    isDeleting,
}) {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{ sx: { borderRadius: "10px" } }}
        >
            <DialogTitle sx={{ color: 'red', fontWeight: 'bold' }}>
                Confirmar Exclusão
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Você tem certeza que deseja EXCLUIR o item 
                    <span style={{ fontWeight: 'bold' }}> "{itemName}"</span>?
                    <br />
                    <br />
                    Esta ação é irreversível e removerá todos os dados associados (lotes, transações e imagem).
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    color="primary"
                    disabled={isDeleting}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained"
                    disabled={isDeleting}
                    startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                >
                    {isDeleting ? 'Excluindo...' : 'Sim, Excluir Item'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}