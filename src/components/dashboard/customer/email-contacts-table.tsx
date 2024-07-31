// src/components/dashboard/customer/email-contacts-table.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import React, { useState } from 'react';
import { EmailContact } from '@/types/customer-api';

interface EmailContactsTableProps {
  contacts: EmailContact[];
  onUpdateContact: (updatedContact: EmailContact) => void;
  editable: boolean;
}

const EmailContactsTable: React.FC<EmailContactsTableProps> = ({ contacts, onUpdateContact, editable }) => {
  const [localContacts, setLocalContacts] = useState(contacts);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    email: string,
    field: keyof EmailContact
  ) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    const updatedContacts = localContacts.map(contact => {
      if (contact.email === email) {
        return {
          ...contact,
          [field]: value
        };
      }
      return contact;
    });

    setLocalContacts(updatedContacts);
    onUpdateContact(updatedContacts.find(contact => contact.email === email)!);
  };

  const columns = [
    { id: 'email', label: 'Email' },
    { id: 'name', label: 'Nome' }
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
            <TableRow key={contact.email}>
              <TableCell>
                {editable ? (
                  <TextField
                    value={contact.email}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, contact.email, 'email')}
                    fullWidth
                  />
                ) : (
                  contact.email
                )}
              </TableCell>
              <TableCell>
                {editable ? (
                  <TextField
                    value={contact.name}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, contact.email, 'name')}
                    fullWidth
                  />
                ) : (
                  contact.name
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmailContactsTable;
