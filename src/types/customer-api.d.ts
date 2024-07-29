export interface Address {
  id: number;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  city: string;
  state: string;
  country: string;
  type: string;
  hasMultipleUnits: boolean;
}

export interface PhoneContact {
  id: number;
  phone: string;
  name: string;
  isWhatsapp: boolean;
}

export interface EmailContact {
  id: number;
  email: string;
  name: string;
}

export interface Customer {
  id: number;
  type: 'PF' | 'PJ';
  name: string;
  cpf: string | null;
  businessName: string | null;
  cnpj: string | null;
  identityDocument: string;
  issuingAgency: string;
  birthDate: string | null;
  motherName: string | null;
  isCorrespondenceAddress: boolean;
  updatedAt: string;
  address: Address;
  correspondenceAddress: Address;
  phoneContacts: PhoneContact[];
  emailContacts: EmailContact[];
}

export interface CustomerAPI {
  customers: Customer[];
  total: number;
  totalPages: number;
  currentPage: number;
}
