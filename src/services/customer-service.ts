// src/services/customerService.ts
import { CustomerAPI, Customer} from '@/types/customer-api';

interface FetchCustomersParams {
  type?: 'PF' | 'PJ';
  name?: string;
  cpf?: string;
  businessName?: string;
  cnpj?: string;
  identityDocument?: string;
  motherName?: string;
  page?: number;
  limit?: number;
}

export async function fetchCustomers(params: FetchCustomersParams = {}): Promise<CustomerAPI> {
  const query = new URLSearchParams(params as any).toString(); // Converta params em query string
  const url = `http://192.168.100.132:3000/api/customer?${query}`;

  console.log("Chamada da API...");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: CustomerAPI = await response.json();
    
    return data;
  } 
  catch (error) {
    console.error('Failed to fetch customers', error);
    return { customers: [], total: 0, totalPages: 0, currentPage: 0 }; // Retorne um objeto padrão
  }
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const url = `http://192.168.100.132:3000/api/customer/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch customer', error);
    throw error;
  }
}

// Novo método para deletar um cliente
export async function deleteCustomerById(id: number): Promise<void> {
  const url = `http://192.168.100.132:3000/api/customer/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Customer deleted successfully');
  } catch (error) {
    console.error('Failed to delete customer', error);
    throw error;
  }
}

export async function updateCustomerById(id: number, customerData: Partial<CustomerAPI>): Promise<void> {
  const url = `http://192.168.100.132:3000/api/customer/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Customer updated successfully');
  } catch (error) {
    console.error('Failed to update customer', error);
    throw error;
  }
}
