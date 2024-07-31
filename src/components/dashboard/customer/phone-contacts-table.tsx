// phone-contacts-table.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox } from '@mui/material';
import React, { useState } from 'react';
import { PhoneContact } from '@/types/customer-api';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface PhoneContactsTableProps {
  contacts: PhoneContact[];
  onUpdateContact: (updatedContact: PhoneContact) => void;
  editable: boolean;
}

const PhoneContactsTable: React.FC<PhoneContactsTableProps> = ({ contacts, onUpdateContact, editable }) => {
  const [localContacts, setLocalContacts] = useState(contacts);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
    field: keyof PhoneContact
  ) => {
    const target = e.target as HTMLInputElement;
    const { value, checked, type } = target;

    const newContacts = localContacts.map(contact => {
      if (contact.id === id) {
        return {
          ...contact,
          [field]: type === 'checkbox' ? checked : value
        };
      }
      return contact;
    });

    setLocalContacts(newContacts);
    onUpdateContact(newContacts.find(contact => contact.id === id)!);
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
            <TableRow key={contact.id}>
              <TableCell>
                {editable ? (
                  <TextField
                    value={contact.phone}
                    onChange={(e) => handleChange(e, contact.id as number, 'phone')}
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
                    onChange={(e) => handleChange(e, contact.id as number, 'name')}
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
                    onChange={(e) => handleChange(e, contact.id as number, 'isWhatsapp')}
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
