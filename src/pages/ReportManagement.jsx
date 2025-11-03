import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sheets from '../services/axios'; 

import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Grid,
  Button,
} from '@mui/material';
import {
  Description as PdfIcon,
  Assessment as AssessmentIcon,
  Folder as ReportIcon,
  InsertDriveFile as ExcelIcon,
  LowPriority as LowStockIcon,
  History as TransactionIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';

import HeaderAdm from '../components/layout/HeaderAdm';
import Footer from '../components/layout/Footer';
import ImportModal from '../components/mod/importModal';

const REPORTS = [
  {
    title: 'Relatório Geral do Estoque',
    description: 'Relatório completo de todos os itens, localizações e especificações.',
    type: 'general', 
    icon: ReportIcon,
  },
  {
    title: 'Relatório de Estoque Baixo',
    description: 'Lista de itens que estão abaixo do estoque mínimo definido.',
    type: 'low-stock', 
    icon: LowStockIcon,
  },
  {
    title: 'Relatório de Transações',
    description: 'Histórico detalhado das últimas movimentações de entrada e saída.',
    type: 'transactions', 
    icon: TransactionIcon,
  },
];


function ReportManagement() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const [importData, setImportData] = useState({ 
    validRows: [], 
    invalidRows: [] 
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); 

  const styles = getStyles();

  useEffect(() => {
    document.title = 'Gerenciamento de Relatórios';
    checkUserRole();
  }, []);

  const handleAlert = (message, severity = 'error') => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

  const checkUserRole = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'manager') {
      handleAlert('Acesso negado. Você não tem permissão para esta página.', 'error');
      setTimeout(() => navigate('/principal'), 3000);
      return false;
    }
    return true;
  };

  const handleDownload = async (reportType, format, reportTitle) => {
    handleAlert(`Preparando o download de "${reportTitle}"...`, 'info');

    try {
        const response = await sheets.downloadReport(reportType, format);

        const contentDisposition = response.headers['content-disposition'];
        let filename = `${reportType}_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        
        if (contentDisposition) {
            const matches = /filename="?(.+)"?/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = decodeURIComponent(matches[1]);
            }
        }
        
        const blob = new Blob([response.data], { 
            type: response.headers['content-type'] 
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        
        handleAlert(`Download de "${filename}" concluído!`, 'success');

    } catch (error) {
        if (error.response && error.response.status === 404) {
             handleAlert('Erro: Endpoint não encontrado (404). Verifique as rotas da API.', 'error');
        } else {
             handleAlert('Erro ao baixar relatório.');
        }
        console.error('Erro detalhado:', error);
    }
  };
    
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    handleAlert(`Processando arquivo "${file.name}"...`, 'info');

    try {
        const response = await sheets.importItemsExcel(file);
        
        event.target.value = null; 

        const { validRows, invalidRows } = response.data;
        
        if (validRows.length > 0 || invalidRows.length > 0) {
            setImportData({ validRows, invalidRows });
            setIsImportModalOpen(true);
            handleAlert('Pré-visualização carregada. Edite as categorias e finalize.', 'info'); 
        } else {
            handleAlert('O arquivo Excel não contém dados de itens válidos para processamento.', 'warning');
        }

    } catch (error) {
        event.target.value = null
        const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Erro desconhecido ao processar arquivo.';
        handleAlert(`Falha no Processamento: ${errorMessage}`, 'error');
    }
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportData({ validRows: [], invalidRows: [] });
  };

  const handleFinalImportSuccess = (message) => {
    handleCloseImportModal();
    handleAlert(message, 'success');
  };


  return (
    <Box sx={styles.pageLayout}>
      <HeaderAdm />
      <Container component="main" sx={styles.container}>
        <Snackbar
          open={alert.open}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>

        <Box sx={styles.cardContainer}>
          <Box sx={{ ...styles.header, justifyContent: 'space-between', mb: 3 }}>
            <Box sx={styles.header}>
              <AssessmentIcon sx={{ color: 'rgba(177, 16, 16, 1)', mr: 1 }} />
              <Typography variant="h6" component="h2">
                Gerenciamento de Relatórios
              </Typography>
            </Box>

            <Box sx={styles.importActions}>
                <Button
                    variant="contained"
                    startIcon={<ExcelIcon />}
                    href="/excelBase.xlsx" 
                    download="excelBase.xlsx"
                    sx={styles.templateButton} 
                >
                    Baixar Modelo
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                />
            
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={() => fileInputRef.current.click()}
                    sx={styles.importButton}
                >
                    Importar Itens
                </Button>
            </Box>

          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {REPORTS.map((report) => (
              <Grid item xs={12} key={report.title}>
                <Paper sx={styles.reportCard}>
                  <Box sx={styles.reportInfo}>
                    <report.icon sx={styles.reportIcon} />
                    <Box>
                      <Typography variant="body1" sx={styles.reportTitle}>
                        {report.title}
                      </Typography>
                      <Typography variant="body2" sx={styles.reportDescription}>
                        {report.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={styles.actionButtons}>
                    <Button
                      variant="contained" 
                      startIcon={<ExcelIcon />}
                      onClick={() => handleDownload(report.type, 'excel', report.title)} 
                      sx={styles.excelButton}
                    >
                      Excel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PdfIcon />}
                      onClick={() => handleDownload(report.type, 'pdf', report.title)} 
                      sx={styles.pdfButton}
                    >
                      PDF
                    </Button>
                </Box>
              </Paper>
            </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      <ImportModal 
          open={isImportModalOpen}
          onClose={handleCloseImportModal}
          data={importData}
          onAlert={handleAlert}
          onSuccess={handleFinalImportSuccess}
      />
      
      <Footer />
    </Box>
  );
}

function getStyles() {
  return {
    pageLayout: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: "#E4E4E4"
    },
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    cardContainer: {
      borderRadius: '15px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '700px',
      padding: '20px',
      backgroundColor: "#F9F9F9"
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      mb: 2,
    },
    importActions: {
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        mt: { xs: 2, sm: 0 },
    },
    templateButton: { 
        backgroundColor: '#217346',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#1e623d',
        },
    },
    importButton: { 
        backgroundColor: '#1F4E79',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#1b456e',
        },
      },
    reportCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      borderRadius: '10px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#fff',
      flexWrap: 'wrap',
    },
    reportInfo: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      minWidth: '200px',
      mb: { xs: 2, sm: 0 },
    },
    reportIcon: {
      fontSize: 35,
      color: '#1F4E79',
      mr: 2,
    },
    reportTitle: {
      fontWeight: 'bold',
      color: '#333',
    },
    reportDescription: {
      color: 'gray',
      fontSize: '0.85rem',
    },
    actionButtons: {
      display: 'flex',
      gap: 1,
    },
    excelButton: {
      backgroundColor: '#217346',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#1E633D',
      },
    },
    pdfButton: {
      backgroundColor: 'rgba(177, 16, 16, 1)',
      '&:hover': {
        backgroundColor: 'rgba(150, 14, 14, 1)',
      },
    },
  };
}

export default ReportManagement;