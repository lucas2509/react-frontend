// src/components/dashboard/customer/PhoneContactsTable.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
import { PhoneContact } from '@/types/customer-api';

interface PhoneContactsTableProps {
  contacts: PhoneContact[]; // Nome da prop deve ser 'contacts' para corresponder ao que está sendo passado
}

const PhoneContactsTable: React.FC<PhoneContactsTableProps> = ({ contacts }) => {
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
          {contacts.map((contact) => (
            <TableRow key={contact.phone}>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.isWhatsapp ? 'Sim' : 'Não'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PhoneContactsTable;
