// src/app/dashboard/customers/page.tsx
'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import CustomersTable, { TableCustomer } from '@/components/dashboard/customer/customers-table';
import { fetchCustomers, createCustomer } from '@/services/customer-service';
import { useRouter } from 'next/navigation';
import CustomerModal from '@/components/dashboard/customer/new-customer-modal';
import { Customer } from '@/types/customer-api';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = React.useState<TableCustomer[]>([]);
  const [page, setPage] = React.useState(0);
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});
  const [openModal, setOpenModal] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');
  const [feedbackSeverity, setFeedbackSeverity] = React.useState<'success' | 'error'>('success');
  const rowsPerPage = 5;
  const router = useRouter();

  const loadCustomers = async () => {
    try {
      const fetchedCustomers = await fetchCustomers({
        ...filters,
        page: page + 1, // Supondo que a API usa páginas baseadas em 1
        limit: rowsPerPage,
      });
  
      console.log('API response:', fetchedCustomers); // Verifique a resposta aqui
  
      if (!Array.isArray(fetchedCustomers)) {
        console.error('fetchedCustomers is not an array:', fetchedCustomers);
        return;
      }
  
      const transformedCustomers: TableCustomer[] = fetchedCustomers.map((apiCustomer) => {
        console.log('apiCustomer.id ->', apiCustomer.id);
  
        const customerId = apiCustomer.id as number;
        return {
          id: customerId.toString(),
          avatar: '', // Adicione a lógica para o avatar se necessário
          name: apiCustomer.name,
          email: apiCustomer.emailContacts[0]?.email ?? '',
          address: {
            city: apiCustomer.address.city,
            state: apiCustomer.address.state,
            country: apiCustomer.address.country,
            street: apiCustomer.address.street,
          },
          phone: apiCustomer.phoneContacts[0]?.phone ?? '',
          createdAt: new Date(apiCustomer.updatedAt),
        };
      });
  
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    }
  };

  React.useEffect(() => {
    loadCustomers();
  }, [page, filters]);

  const handleFilter = (newFilters: { [key: string]: string }) => {
    setFilters(newFilters);
    setPage(0); // Resetar a página para a primeira quando o filtro é aplicado
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/customers/${id}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveCustomer = async (customer: Customer) => {
    try {
      await createCustomer(customer);
      setFeedbackMessage('Cliente cadastrado com sucesso!');
      setFeedbackSeverity('success');
      handleCloseModal();
      // Atualize a lista de clientes após salvar
      loadCustomers();
    } catch (error) {
      setFeedbackMessage('Erro ao cadastrar cliente.');
      setFeedbackSeverity('error');
    }
  };

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Clientes</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Importar
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Exportar
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenModal}>
            Novo Cliente
          </Button>
        </div>
      </Stack>
      <CustomersFilters onFilter={handleFilter} />
      <CustomersTable
        count={customers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onRowClick={handleRowClick}
      />
      <CustomerModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        feedbackMessage={feedbackMessage}
        feedbackSeverity={feedbackSeverity}
      />
    </Stack>
  );
}

function applyPagination(rows: TableCustomer[], page: number, rowsPerPage: number): TableCustomer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
