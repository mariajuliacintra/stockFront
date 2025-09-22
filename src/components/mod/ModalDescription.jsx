import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const tipoAcoes = [
  { label: "Retirar", value: "retirar" },
  { label: "Adicionar", value: "adicionar" },
];

export default function ModalDescription({ open, onClose, item }) {
  const [modifications, setModifications] = useState({
    amount: "",
    typeAction: "",
  });

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "20px" },
      }}
    >
      <DialogTitle>
        Nome da Ferramenta: {item?.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography>Marca: {item?.brand || "—"}</Typography>
        <Typography>Descrição: {item?.description || "—"}</Typography>
        <Typography>
          Especificações Técnicas:
          {item?.technicalSpecs?.map((spec, index) => (
            <span key={index}>
              {spec.technicalSpecValue}
              {index < item.technicalSpecs.length - 1 && ", "}
            </span>
          )) || "—"}
        </Typography>
        <Typography>Quantidade: {item?.quantity || "—"}</Typography>
        <Typography>Número do lote: {item?.batchNumber || "—"}</Typography>
        <Box mt={3}>
          <Typography>Quantidade</Typography>
          <TextField
            fullWidth
            defaultValue=""
            placeholder="Selecione a quantidade"
            type="number"
          />

          <Typography mt={2} gutterBottom>
            Tipo da Ação
          </Typography>
          <TextField select fullWidth defaultValue="">
            {tipoAcoes.map((acao) => (
              <MenuItem key={acao.value} value={acao.value}>
                {acao.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Button variant="contained" color="error">
            Editar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
