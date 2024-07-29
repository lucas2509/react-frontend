import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox } from '@mui/material';
import React, { useState } from 'react';
import { PhoneContact } from '@/types/customer-api';
import CheckIcon from '@mui/icons-material/Check'; // Ícone de marcação
import ClearIcon from '@mui/icons-material/Clear'; // Ícone de não marcação

interface PhoneContactsTableProps {
  contacts: PhoneContact[];
  onUpdateContact: (updatedContact: PhoneContact) => void; // Função para atualizar o contato
  editable: boolean; // Propriedade para definir se a tabela está editável
}

const PhoneContactsTable: React.FC<PhoneContactsTableProps> = ({ contacts, onUpdateContact, editable }) => {
  const [editingContact, setEditingContact] = useState<PhoneContact | null>(null);
  const [localContacts, setLocalContacts] = useState(contacts);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof PhoneContact) => {
    const { value, checked, type } = event.target;
  
    const updatedContacts = localContacts.map(contact =>
      contact.phone === editingContact?.phone
        ? {
            ...contact,
            [field]: type === 'checkbox' ? checked : value
          }
        : contact
    );
  
    setLocalContacts(updatedContacts);
  
    // Se precisar salvar automaticamente, descomente a linha abaixo:
    // onUpdateContact(updatedContacts.find(c => c.phone === editingContact?.phone) || contact);
  };

  const columns = [
    { id: 'phone', label: 'Telefone' },
    { id: 'name', label: 'Nome' },
    { id: 'isWhatsapp', label: 'WhatsApp' }
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {localContacts.map((contact) => (
            <TableRow key={contact.phone}>
              <TableCell>
                {editable ? (
                  <TextField
                    value={contact.phone}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'phone')}
                    fullWidth
                  />
                ) : (
                  contact.phone
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <TextField
                    value={contact.name}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'name')}
                    fullWidth
                  />
                ) : (
                  contact.name
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <Checkbox
                    checked={contact.isWhatsapp}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'isWhatsapp')}
                  />
                ) : contact.isWhatsapp ? (
                  <CheckIcon color="success" />
                ) : (
                  <ClearIcon color="error" />
                )}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PhoneContactsTable;
