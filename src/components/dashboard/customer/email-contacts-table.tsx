// src/components/dashboard/customer/EmailContactsTable.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
import { EmailContact } from '@/types/customer-api';

interface EmailContactsTableProps {
  contacts: EmailContact[];
}

const EmailContactsTable: React.FC<EmailContactsTableProps> = ({ contacts }) => {
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
          {contacts.map((contact) => (
            <TableRow key={contact.email}>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmailContactsTable;
