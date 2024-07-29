// src/components/dashboard/customer/customers-table.tsx
import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export interface TableCustomer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: {
    city: string;
    state: string;
    country: string;
    street: string;
  };
  phone: string;
  createdAt: Date;
}

interface CustomersTableProps {
  rows: TableCustomer[];
  count: number;
  page: number;
  rowsPerPage: number;
  onRowClick: (id: string) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ rows, count, onRowClick }) => {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    onRowClick(id);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Endereço</TableCell>
            <TableCell>Criado em</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{`${row.address.street}, ${row.address.city}, ${row.address.state}, ${row.address.country}`}</TableCell>
              <TableCell>{row.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomersTable;
