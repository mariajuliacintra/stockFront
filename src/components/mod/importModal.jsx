import { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Modal, 
    CircularProgress, 
    IconButton, 
    TextField, 
    Select, 
    MenuItem, 
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import sheets from '../../services/axios'; 
import { Delete as DeleteIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';


const getUserId = () => localStorage.getItem('idUsuario') || null; 


const ImportModal = ({ open, onClose, data, onAlert, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [technicalSpecs, setTechnicalSpecs] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editableRows, setEditableRows] = useState([]);

    const standardHeaders = [
        'name', 'brand', 'sapCode', 'description', 'minimumStock', 
        'quantity', 'expirationDate', 'fkIdLocation', 'fkIdCategory',
        'isEdited', 'isMissingCategory', 'tempSelectedSpecId', 'tempSpecValue', 
        'itemSpecs', 
        'aliases' 
    ];


    const getDynamicSpecKeys = () => {
        if (!editableRows || editableRows.length === 0) return [];
        
        const allKeys = new Set();
        
        editableRows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (!standardHeaders.includes(key)) {
                    allKeys.add(key);
                }
            });
        });
        
        return Array.from(allKeys);
    };
    
    const dynamicSpecKeys = getDynamicSpecKeys();
    
    
    useEffect(() => {
        if (!open) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catResponse, specResponse, locResponse] = await Promise.all([
                    sheets.getCategories(),
                    sheets.getTechnicalSpecs(),
                    sheets.getLocations(),
                ]);

                setCategories(catResponse.data.categories || []);
                setTechnicalSpecs(specResponse.data.technicalSpecs || []); 
                setLocations(locResponse.data.locations || locResponse.data.data || []);
                
                const initialRows = (data.validRows || []).map(row => ({
                    ...row,
                    quantity: row.quantity || '', 
                    fkIdCategory: row.fkIdCategory || '', 
                    fkIdLocation: row.fkIdLocation || '', 
                    isEdited: false,
                    isMissingCategory: !row.fkIdCategory,
                    
                    tempSelectedSpecId: '',
                    tempSpecValue: '',
                }));
                setEditableRows(initialRows);

            } catch (error) {
                onAlert('Erro ao carregar dados auxiliares. Verifique o console.', 'error');
                console.error("Erro na busca de dados auxiliares:", error.response || error);
                onClose();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open]);


    const handleFieldChange = (index, field, value) => {
        const updatedRows = [...editableRows];
        updatedRows[index][field] = value;
        updatedRows[index].isEdited = true;
        
        if (field === 'fkIdCategory') {
            updatedRows[index].isMissingCategory = !value;
        }

        setEditableRows(updatedRows);
    };
    
    const handleAddSpecToRow = (index) => {
        const row = editableRows[index];
        const selectedSpec = technicalSpecs.find(s => s.idTechnicalSpec === row.tempSelectedSpecId);
        
        if (!selectedSpec || !row.tempSpecValue.trim()) {
            onAlert('Selecione a especificação e insira um valor.', 'warning');
            return;
        }
        
        const updatedRows = [...editableRows];
        
        updatedRows[index][selectedSpec.technicalSpecKey] = row.tempSpecValue.trim();

        updatedRows[index].tempSelectedSpecId = '';
        updatedRows[index].tempSpecValue = '';
        updatedRows[index].isEdited = true;
        
        setEditableRows(updatedRows);
    };


    const handleRemoveRow = (index) => {
        const updatedRows = editableRows.filter((_, i) => i !== index);
        setEditableRows(updatedRows);
    };

    const handleRemoveSpec = (rowIndex, specKey) => {
        const updatedRows = [...editableRows];
        delete updatedRows[rowIndex][specKey]; 
        updatedRows[rowIndex].isEdited = true;
        setEditableRows(updatedRows);
    };


    // Lógica para Envio Final dos Dados
    const handleSubmitImport = async () => {
        const userId = getUserId();
        
        // VALIDAÇÕES CRÍTICAS
        if (!userId) {
             onAlert('Sessão expirada. Por favor, faça login novamente.', 'error');
             onClose();
             return;
        }
        if (editableRows.some(row => row.isMissingCategory)) {
            onAlert('Por favor, selecione uma Categoria para todos os itens pendentes.', 'warning');
            return;
        }
        if (editableRows.length === 0) {
            onAlert('Nenhum item restante para importar.', 'info');
            onClose();
            return;
        }
        const invalidTextRow = editableRows.find(row => 
            !row.brand || String(row.brand).trim() === '' || 
            !row.description || String(row.description).trim() === ''
        );
        if (invalidTextRow) {
            onAlert(`O item "${invalidTextRow.name}" está com a Marca ou Descrição vazia/inválida. Por favor, corrija antes de finalizar.`, 'error');
            return;
        }
        // Validação de Quantidade
        const invalidQuantityRow = editableRows.find(row => 
            !row.quantity || Number(row.quantity) <= 0 || isNaN(Number(row.quantity))
        );
        if (invalidQuantityRow) {
            onAlert(`O item "${invalidQuantityRow.name}" requer uma Quantidade Inicial válida (maior que 0).`, 'error');
            return;
        }


        setIsSubmitting(true);
        
        const fkIdUser = Number(userId); 
        const successfulImports = [];
        const failedImports = [];
        let shouldStopProcessing = false;

        for (const row of editableRows) {
            if (shouldStopProcessing) break;
            
            const technicalSpecsObject = {};
            
            const allSpecKeys = Object.keys(row).filter(key => !standardHeaders.includes(key));
            
            allSpecKeys.forEach(key => {
                const specEntry = technicalSpecs.find(spec => spec.technicalSpecKey === key); 
                const specId = specEntry ? specEntry.idTechnicalSpec : null;
                const specValue = row[key]; 
                
                if (specId && specValue) {
                    technicalSpecsObject[specId] = String(specValue);
                }
            });

            // Envia null se não houver technicalSpecs
            const finalTechnicalSpecs = Object.keys(technicalSpecsObject).length > 0 
                                            ? technicalSpecsObject 
                                            : null; 
            
            const itemData = {
                sapCode: String(row.sapCode),
                name: row.name,
                brand: row.brand,
                description: row.description,
                
                minimumStock: row.minimumStock ? Number(row.minimumStock) : null,
                quantity: Number(row.quantity), 
                
                fkIdCategory: Number(row.fkIdCategory), 
                fkIdLocation: row.fkIdLocation ? Number(row.fkIdLocation) : null, 
                fkIdUser: fkIdUser, 
                
                expirationDate: row.expirationDate || null,
                
                technicalSpecs: finalTechnicalSpecs, 
            };
            
            try {
                await sheets.postAddItem(itemData);
                successfulImports.push(row.name);
            } catch (error) {
                const responseData = error.response?.data;
                
                const apiErrorDetails = responseData?.details || responseData?.error || 'Erro desconhecido da API.';
                
                let alertMessage = `Falha na Linha (${row.name}): ${apiErrorDetails}`;

                if (responseData?.error === 'Código SAP já em uso') {
                    shouldStopProcessing = true; 
                    alertMessage = `Falha Crítica na Linha (${row.name}): Código SAP '${row.sapCode}' já em uso. ${responseData.details || ''}. Por favor, corrija o código na tabela.`;
                } 
                
                failedImports.push({ name: row.name, error: alertMessage });
                
                onAlert(alertMessage, 'error');

                console.error(`Falha ao importar ${row.name}:`, responseData || error);
            }
        }

        setIsSubmitting(false);
        
        let finalMessage = `Importação concluída. Sucesso: ${successfulImports.length}. Falhas: ${failedImports.length}.`;
        
        if (shouldStopProcessing) {
            onClose(); 
        } else if (failedImports.length > 0) {
            finalMessage += ` Itens com falha: ${failedImports.length}. Consulte os alertas de erro para detalhes.`;
            onAlert(finalMessage, 'warning');
            onClose(); 
        } else {
            onSuccess(finalMessage);
        }
        
    };

    const hasData = (editableRows || []).length > 0 || (data?.invalidRows || []).length > 0;

    if (loading || isSubmitting) {
        return (
            <Modal open={open} onClose={onClose} sx={modalStyles.modalOverlay}>
                <Box sx={modalStyles.modalContent}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>{isSubmitting ? 'Finalizando Importação...' : 'Carregando dados...'}</Typography>
                    <Typography sx={{ mt: 1, fontSize: '0.8rem', color: 'gray' }}>
                        {isSubmitting ? 'Verificando itens na API...' : 'Buscando categorias e locais...'}
                    </Typography>
                </Box>
            </Modal>
        );
    }
    
    return (
        <Modal open={open} onClose={onClose} sx={modalStyles.modalOverlay}>
            <Box sx={modalStyles.modalContent}>
                <IconButton onClick={onClose} sx={modalStyles.closeButton}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={modalStyles.modalTitle}>
                    Pré-visualização e Edição de Itens ({editableRows.length} Pendentes)
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {!hasData && (
                    <Typography>Nenhum dado válido para pré-visualização.</Typography>
                )}
                
                {(data?.invalidRows || []).length > 0 && (
                    <Typography color="error" sx={{ mb: 1, fontSize: '0.9rem' }}>
                        {(data.invalidRows || []).length} itens foram **ignorados** por falta de campos obrigatórios (Nome, Marca, SAP Code, etc.).
                    </Typography>
                )}


                {(editableRows || []).length > 0 && (
                    <Box sx={{ mt: 1, maxHeight: 'calc(90vh - 250px)', overflowY: 'auto', width: '100%' }}>
                        <TableContainer component={Paper}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={modalStyles.tableHeader}></TableCell>
                                        
                                        <TableCell sx={modalStyles.tableHeader}>Nome</TableCell>
                                        <TableCell sx={modalStyles.tableHeader}>SAP Code</TableCell>
                                        <TableCell sx={{...modalStyles.tableHeader, color: 'darkred'}}>Categoria *</TableCell>
                                        <TableCell sx={{...modalStyles.tableHeader, color: 'darkred'}}>Localização *</TableCell>
                                        <TableCell sx={{...modalStyles.tableHeader, color: 'darkred'}}>Quantidade *</TableCell>
                                        
                                        {/* Cabeçalhos de Especificação Dinâmica (DO EXCEL/ADICIONADAS) */}
                                        {dynamicSpecKeys.map(key => (
                                            <TableCell key={key} sx={modalStyles.tableHeader}>
                                                {key} 
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleRemoveSpec(0, key)} 
                                                    sx={{ ml: 0.5, color: 'red' }}
                                                >
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </TableCell>
                                        ))}
                                        {/* Coluna para ADICIONAR Specs na Linha */}
                                        <TableCell sx={{...modalStyles.tableHeader, width: '250px' }}>
                                            <AddCircleIcon fontSize="small" sx={{ mr: 0.5, color: 'green' }} /> Adicionar Especificação
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {editableRows.map((row, index) => (
                                        <TableRow key={index} sx={row.isMissingCategory || Number(row.quantity) <= 0 ? modalStyles.pendingRow : row.isEdited ? modalStyles.editedRow : {}}>
                                            <TableCell>
                                                <IconButton onClick={() => handleRemoveRow(index)} size="small" color="error">
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.sapCode}</TableCell>
                                            
                                            {/* CAMPO DE SELEÇÃO DE CATEGORIA */}
                                            <TableCell>
                                                <Select
                                                    value={row.fkIdCategory}
                                                    onChange={(e) => handleFieldChange(index, 'fkIdCategory', e.target.value)}
                                                    size="small"
                                                    error={row.isMissingCategory}
                                                    displayEmpty
                                                    sx={{ minWidth: 120, height: 30 }}
                                                >
                                                    <MenuItem value="" disabled>Selecione a Categoria</MenuItem>
                                                    {categories.map(cat => (
                                                        <MenuItem key={cat.idCategory} value={cat.idCategory}>
                                                            {cat.categoryValue}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            
                                            {/* CAMPO DE SELEÇÃO DE LOCALIZAÇÃO */}
                                            <TableCell>
                                                <Select
                                                    value={row.fkIdLocation}
                                                    onChange={(e) => handleFieldChange(index, 'fkIdLocation', e.target.value)}
                                                    size="small"
                                                    displayEmpty
                                                    sx={{ minWidth: 120, height: 30 }}
                                                >
                                                    <MenuItem value="" disabled>Selecione o Local</MenuItem>
                                                    {locations.map(loc => (
                                                        <MenuItem key={loc.idLocation} value={loc.idLocation}>
                                                            {loc.place} - {loc.code}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            
                                            {/* CAMPO DE QUANTIDADE */}
                                            <TableCell>
                                                <TextField 
                                                    value={row.quantity}
                                                    onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                                                    size="small"
                                                    type="number"
                                                    error={Number(row.quantity) <= 0}
                                                    sx={{ width: 80 }}
                                                />
                                            </TableCell>

                                            {/* Células de Especificação Dinâmica (VALORES DO EXCEL/ADICIONADAS) */}
                                            {dynamicSpecKeys.map(key => (
                                                <TableCell key={key}>
                                                     <TextField 
                                                         value={row[key] || ''}
                                                         onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                                         size="small"
                                                         sx={{ width: 100 }}
                                                     />
                                                </TableCell>
                                            ))}
                                            
                                            {/* COLUNA DE ADIÇÃO DE SPECS (Adiciona Spec e Valor) */}
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', p: '4px 4px 4px 0'}}>
                                                <Select
                                                    value={row.tempSelectedSpecId}
                                                    onChange={(e) => handleFieldChange(index, 'tempSelectedSpecId', e.target.value)}
                                                    size="small"
                                                    displayEmpty
                                                    sx={{ minWidth: 100, height: 30, mr: 0.5 }}
                                                >
                                                    <MenuItem value="" disabled>Selecione a Espec</MenuItem>
                                                    {technicalSpecs.map(spec => (
                                                        <MenuItem 
                                                            key={spec.idTechnicalSpec} 
                                                            value={spec.idTechnicalSpec}
                                                            // Verifica se a Spec já existe na linha (se existe, desabilita)
                                                            disabled={row[spec.technicalSpecKey] !== undefined}
                                                        >
                                                            {spec.technicalSpecKey}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <TextField 
                                                    value={row.tempSpecValue}
                                                    onChange={(e) => handleFieldChange(index, 'tempSpecValue', e.target.value)}
                                                    size="small"
                                                    placeholder="Valor"
                                                    sx={{ width: 80, mr: 0.5 }}
                                                    disabled={!row.tempSelectedSpecId}
                                                />
                                                <IconButton onClick={() => handleAddSpecToRow(index)} size="small" color="primary">
                                                    <AddIcon fontSize="inherit" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmitImport}
                    disabled={isSubmitting || (editableRows || []).some(row => row.isMissingCategory || Number(row.quantity) <= 0)}
                    sx={{ mt: 3, backgroundColor: '#217346' }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : `Finalizar Importação (${(editableRows || []).length} itens)`}
                </Button>
            </Box>
        </Modal>
    );
};

// Estilos específicos do Modal
const modalStyles = {
    modalOverlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: 24,
        width: '90%',
        maxWidth: '1200px', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
    },
    modalTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        mb: 1,
    },
    closeButton: {
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'gray',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
        padding: '8px 4px',
    },
    editedRow: {
        backgroundColor: '#f0f8ff', 
    },
    pendingRow: {
        backgroundColor: '#fff0f0', 
    }
};

export default ImportModal;