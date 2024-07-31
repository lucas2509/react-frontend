import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  RadioGroup,
  Radio,
  FormControl,
  Divider
} from '@mui/material';
import { Customer, Address, PhoneContact, EmailContact } from '@/types/customer-api';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  feedbackMessage: string;
  feedbackSeverity: 'success' | 'error';
}

export default function CustomerModal({
  open,
  onClose,
  onSave,
  feedbackMessage,
  feedbackSeverity
}: CustomerModalProps) {
  const [customer, setCustomer] = React.useState<Customer>({
    type: 'PF',
    name: '',
    cpf: null,
    businessName: null,
    cnpj: null,
    identityDocument: '',
    issuingAgency: '',
    birthDate: null,
    motherName: null,
    isCorrespondenceAddress: false,
    address: {
      zipCode: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: null,
      city: '',
      state: 'SP',
      country: '',
      type: 'OWN',
      hasMultipleUnits: false
    },
    correspondenceAddress: {
      zipCode: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: null,
      city: '',
      state: 'SP',
      country: '',
      type: 'OWN',
      hasMultipleUnits: false
    },
    phoneContacts: [],
    emailContacts: []
  });
  const [openFeedbackDialog, setOpenFeedbackDialog] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setCustomer(prevCustomer => {
      if (!prevCustomer) return prevCustomer;

      if (name === 'isCorrespondenceAddress') {
        return {
          ...prevCustomer,
          isCorrespondenceAddress: checked
        };
      }

      const [prefix, key] = name.split('.');
      if (prefix === 'address' || prefix === 'correspondenceAddress') {
        return {
          ...prevCustomer,
          [prefix as keyof Customer]: {
            ...prevCustomer[prefix as keyof Customer] as Address,
            [key]: value
          }
        };
      }

      if (name.startsWith('phoneContacts.') || name.startsWith('emailContacts.')) {
        const [section, indexStr, field] = name.split('.');
        const index = parseInt(indexStr, 10);
        return {
          ...prevCustomer,
          [section as keyof Customer]: (prevCustomer[section as keyof Customer] as (PhoneContact | EmailContact)[]).map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
          )
        };
      }

      return {
        ...prevCustomer,
        [name as keyof Customer]: value
      };
    });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as 'PF' | 'PJ';
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      type,
      cpf: type === 'PF' ? prevCustomer.cpf : null,
      birthDate: type === 'PF' ? prevCustomer.birthDate : null,
      motherName: type === 'PF' ? prevCustomer.motherName : null,
      cnpj: type === 'PJ' ? prevCustomer.cnpj : null,
      businessName: type === 'PJ' ? prevCustomer.businessName : null
    }));
  };

  const handleAddContact = (type: 'phone' | 'email') => {
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      [`${type}Contacts`]: [
        ...prevCustomer[`${type}Contacts` as keyof Customer] as (PhoneContact | EmailContact)[],
        type === 'phone'
          ? { phone: '', name: '', isWhatsapp: false }
          : { email: '', name: '' }
      ]
    }));
  };

  const handleSave = () => {
    onSave(customer);
    setOpenFeedbackDialog(true); // Mostrar o feedback dialog após salvar
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  return (
    <>
      <Dialog open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md" // You can adjust this as needed
        PaperProps={{
          style: {
            width: '80%', // Make the modal take up the full width of the parent
            maxWidth: '100%' // Ensure the modal does not exceed the parent's width
          }
        }}
        >
        <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {feedbackMessage && (
              <Alert severity={feedbackSeverity}>{feedbackMessage}</Alert>
            )}
            <FormControl component="fieldset">
              <RadioGroup
                name="type"
                value={customer.type}
                onChange={handleTypeChange}
                row
              >
                <FormControlLabel value="PF" control={<Radio />} label="Pessoa Física" />
                <FormControlLabel value="PJ" control={<Radio />} label="Pessoa Jurídica" />
              </RadioGroup>
            </FormControl>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body1">Informações Pessoais</Typography>
            <Stack spacing={1}>
              <TextField
                name="name"
                label="Nome"
                value={customer.name}
                onChange={handleInputChange}
                fullWidth
              />
              {customer.type === 'PF' && (
                <>
                  <TextField
                    name="cpf"
                    label="CPF"
                    value={customer.cpf || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="birthDate"
                    label="Data de Nascimento"
                    value={customer.birthDate || ''}
                    onChange={handleInputChange}
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="motherName"
                    label="Nome da Mãe"
                    value={customer.motherName || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </>
              )}
              {customer.type === 'PJ' && (
                <>
                  <TextField
                    name="cnpj"
                    label="CNPJ"
                    value={customer.cnpj || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="businessName"
                    label="Razão Social"
                    value={customer.businessName || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </>
              )}
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body1">Endereços</Typography>
            <Stack spacing = {1}>
              <TextField
                name="address.street"
                label="Endereço"
                value={customer.address.street}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.number"
                label="Número"
                value={customer.address.number}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.neighborhood"
                label="Bairro"
                value={customer.address.neighborhood}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address.city"
                label="Cidade"
                value={customer.address.city}
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
            {customer.isCorrespondenceAddress && (
              <>
                <TextField
                  name="correspondenceAddress.street"
                  label="Endereço de Correspondência"
                  value={customer.correspondenceAddress.street}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="correspondenceAddress.number"
                  label="Número de Correspondência"
                  value={customer.correspondenceAddress.number}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="correspondenceAddress.neighborhood"
                  label="Bairro de Correspondência"
                  value={customer.correspondenceAddress.neighborhood}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="correspondenceAddress.city"
                  label="Cidade de Correspondência"
                  value={customer.correspondenceAddress.city}
                  onChange={handleInputChange}
                  fullWidth
                />
              </>
            )}
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={2}>
              <Typography variant="h6">Contatos Telefônicos</Typography>
              {customer.phoneContacts.map((contact, index) => (
                <Stack key={index} spacing={2}>
                  <TextField
                    name={`phoneContacts.${index}.phone`}
                    label="Telefone"
                    value={contact.phone}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name={`phoneContacts.${index}.name`}
                    label="Nome"
                    value={contact.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={`phoneContacts.${index}.isWhatsapp`}
                        checked={contact.isWhatsapp}
                        onChange={handleInputChange}
                      />
                    }
                    label="WhatsApp"
                  />
                </Stack>
              ))}
              <Button onClick={() => handleAddContact('phone')}>Adicionar Telefone</Button>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={2}>
              <Typography variant="h6">Contatos de Email</Typography>
              {customer.emailContacts.map((contact, index) => (
                <Stack key={index} spacing={2}>
                  <TextField
                    name={`emailContacts.${index}.email`}
                    label="Email"
                    value={contact.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name={`emailContacts.${index}.name`}
                    label="Nome"
                    value={contact.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Stack>
              ))}
              <Button onClick={() => handleAddContact('email')}>Adicionar Email</Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openFeedbackDialog}
        onClose={handleCloseFeedbackDialog}
      >
        <DialogTitle>{feedbackSeverity === 'success' ? 'Sucesso' : 'Erro'}</DialogTitle>
        <DialogContent>
          <Alert severity={feedbackSeverity}>{feedbackMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
