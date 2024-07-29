'use client';
import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Stack, Typography, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Alert, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { fetchCustomerById, deleteCustomerById, updateCustomerById } from '@/services/customer-service';
import { paths } from '@/paths';
import { Customer, PhoneContact, EmailContact } from '@/types/customer-api';
import PhoneContactsTable from '@/components/dashboard/customer/phone-contacts-table';
import EmailContactsTable from '@/components/dashboard/customer/email-contacts-table';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function CustomerDetailPage(): React.JSX.Element {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = React.useState<Customer | undefined>();
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');
  const [feedbackSeverity, setFeedbackSeverity] = React.useState<'success' | 'error'>('success');
  const [isEditing, setIsEditing] = React.useState(false);

  async function loadCustomer() {
    if (id) {
      try {
        const fetchedCustomer = await fetchCustomerById(Number(id));
        setCustomer(fetchedCustomer);
      } catch (error) {
        console.error('Failed to fetch customer', error);
      }
    }
  }

  React.useEffect(() => {
    loadCustomer();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadCustomer(); // Recarregar os dados para desfazer as alterações não salvas
  };

  const handleSaveEdit = async () => {
    if (id && customer) {
      try {
        await updateCustomerById(Number(id), customer);
        setFeedbackMessage('Cliente atualizado com sucesso!');
        setFeedbackSeverity('success');
        setIsEditing(false);
        setOpenFeedbackDialog(true);
      } catch (error) {
        setFeedbackMessage('Erro ao atualizar cliente.');
        setFeedbackSeverity('error');
        setOpenFeedbackDialog(true);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
  
    setCustomer(prevCustomer => {
      if (!prevCustomer) return prevCustomer;
  
      if (name === "isCorrespondenceAddress") {
        return {
          ...prevCustomer,
          isCorrespondenceAddress: checked
        };
      }

      // Se addressType for especificado, atualiza o endereço correspondente
      const prefix = name.split('.')[0];
      console.log('prefixo -> ' + prefix)
      if (prefix === "address" || prefix === "correspondenceAddress") {
        const prefixName =  name.split('.')[1];
        return {
          ...prevCustomer,
          [prefix]: {
            ...prevCustomer[prefix],
            [prefixName]: value
          }
        };
      }
  
      // Caso contrário, atualiza o nível superior
      return {
        ...prevCustomer,
        [name]: value
      };
    });
  };
  

  if (!customer) {
    return <Typography>Loading...</Typography>;
  }

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        await deleteCustomerById(Number(id));
        setFeedbackMessage('Cliente excluído com sucesso!');
        setFeedbackSeverity('success');
        handleCloseConfirmDialog();
        setOpenFeedbackDialog(true);
        setTimeout(() => {
          router.push(paths.dashboard.customers);
        }, 2000); // Redireciona após 2 segundos
      } catch (error) {
        setFeedbackMessage('Erro ao excluir cliente.');
        setFeedbackSeverity('error');
        setOpenFeedbackDialog(true);
      }
    }
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Detalhes do Cliente</Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {!isEditing ? (
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Editar Cadastro
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Excluir Cadastro
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Informações Pessoais</Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {isEditing ? (
            <>
              <TextField
                name="name"
                label="Nome"
                value={customer.name}
                onChange={handleInputChange}
                fullWidth
              />
              {customer.type === 'PF' ? (
                <TextField
                name="cpf"
                label="CPF"
                value={customer.cpf}
                onChange={handleInputChange}
                fullWidth
              />) : (<></>)}
              {customer.type === 'PJ' ? (
                <TextField
                name="businessName"
                label="Nome da Empresa"
                value={customer.businessName || ''}
                onChange={handleInputChange}
                fullWidth
              />
              ) : (<></>)}
              {customer.type === 'PJ' ? (
                <TextField
                name="cnpj"
                label="CNPJ"
                value={customer.cnpj || ''}
                onChange={handleInputChange}
                fullWidth
              />
              ) : (<></>)}
              <TextField
                name="identityDocument"
                label="Documento de Identidade"
                value={customer.identityDocument || ''}
                onChange={handleInputChange}
                fullWidth
              />
              {customer.type === 'PF' ? (
                <TextField
                name="birthDate"
                label="Data de Nascimento"
                value={customer.birthDate || ''}
                onChange={handleInputChange}
                fullWidth
              />
              ) : (<></>)}
              {customer.type === 'PF' ? (
                 <TextField
                 name="motherName"
                 label="Nome da Mãe"
                 value={customer.motherName || ''}
                 onChange={handleInputChange}
                 fullWidth
               />
              ) : (<></>)}
            </>
          ) : (
            <>
              <Typography><strong>Nome:</strong> {customer.name}</Typography>
              {customer.type === 'PF' ? (<Typography><strong>CPF:</strong> {customer.cpf}</Typography>) : (<></>)}
              {customer.type === 'PJ' ? ( <Typography><strong>Nome da Empresa:</strong> {customer.businessName || 'N/A'}</Typography>) : (<></>)}
              {customer.type === 'PJ' ? (<Typography><strong>CNPJ:</strong> {customer.cnpj}</Typography>) : (<></>)}
              <Typography><strong>Documento de Identidade:</strong> {customer.identityDocument}</Typography>
              {customer.type === 'PF' ? (<Typography><strong>Data de Nascimento:</strong> {customer.birthDate}</Typography>) : (<></>)}
              {customer.type === 'PF' ? (<Typography><strong>Nome da Mãe:</strong> {customer.motherName}</Typography>) : (<></>)}
            </>
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          {isEditing ? (
            <>
              <Typography variant="h6">Endereço</Typography>
              <TextField
                name="address.street"
                label="Endereço"
                value={customer.address.street || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.number"
                label="Número"
                value={customer.address.number || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.neighborhood"
                label="Bairro"
                value={customer.address.neighborhood || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.city"
                label="Cidade"
                value={customer.address.city || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.state"
                label="Estado"
                value={customer.address.state || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.country"
                label="País"
                value={customer.address.country || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="correspondenceAddress.street"
                label="Endereço de Correspondência"
                value={customer.correspondenceAddress?.street || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isCorrespondenceAddress"
                    checked={customer.isCorrespondenceAddress}
                    onChange={handleInputChange}
                  />
                }
                label="Endereço de Correspondência"
              />
              {customer.isCorrespondenceAddress ? (
                <>
                  <TextField
                    name="correspondenceAddress.street"
                    label="Endereço"
                    value={customer.correspondenceAddress.street || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="correspondenceAddress.number"
                    label="Número"
                    value={customer.correspondenceAddress.number || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="correspondenceAddress.neighborhood"
                    label="Bairro"
                    value={customer.correspondenceAddress.neighborhood || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="correspondenceAddress.city"
                    label="Cidade"
                    value={customer.correspondenceAddress.city || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="correspondenceAddress.state"
                    label="Estado"
                    value={customer.correspondenceAddress.state || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="correspondenceAddress.country"
                    label="País"
                    value={customer.correspondenceAddress.country || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </>) : (<></>) }
            </>
          ) : (
            <>
              <Typography><strong>Endereço:</strong> {customer.address.street}, {customer.address.number}, {customer.address.neighborhood}, {customer.address.city}, {customer.address.state}, {customer.address.country}</Typography>
              {customer.isCorrespondenceAddress ? (
                <Typography><strong>Endereço de Correspondência:</strong> {customer.correspondenceAddress ? `${customer.correspondenceAddress.street}, ${customer.correspondenceAddress.number}, ${customer.correspondenceAddress.neighborhood}, ${customer.correspondenceAddress.city}, ${customer.correspondenceAddress.state}, ${customer.correspondenceAddress.country}` : 'N/A'}</Typography>
                ) :(<></> )}
            </>
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Contatos Telefônicos</Typography>
        <PhoneContactsTable contacts={customer.phoneContacts} />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Contatos de E-mail</Typography>
        <EmailContactsTable contacts={customer.emailContacts} />
      </Card>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => router.push(paths.dashboard.customers)}>
          Voltar para a lista
        </Button>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        sx={{
          '& .MuiDialog-paper': {
            marginTop: '15vh', // Ajusta a margem superior para alinhar com o conteúdo da página
          }
        }}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Tem certeza de que deseja excluir este cadastro?</Typography>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
              <Button color="error" onClick={handleConfirmDelete}>Excluir</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={openFeedbackDialog}
        onClose={handleCloseFeedbackDialog}
        sx={{
          '& .MuiDialog-paper': {
            marginTop: '15vh', // Ajusta a margem superior para alinhar com o conteúdo da página
          }
        }}
      >
        <DialogTitle>{feedbackSeverity === 'success' ? 'Sucesso' : 'Erro'}</DialogTitle>
        <DialogContent>
          <Alert severity={feedbackSeverity}>{feedbackMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
