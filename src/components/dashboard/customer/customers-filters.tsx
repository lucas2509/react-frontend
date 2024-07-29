// src/components/dashboard/customer/customers-filters.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { SelectChangeEvent } from '@mui/material/Select';

// Mapeamento dos atributos
const attributeMap: Record<string, string> = {
  'Nome': 'name',
  'CPF': 'cpf',
  'Razão Social': 'businessName',
  'CNPJ': 'cnpj',
  'Doc. Identidade': 'identityDocument',
};

interface CustomersFiltersProps {
  onFilter: (filters: { [key: string]: string }) => void;
}

export function CustomersFilters({ onFilter }: CustomersFiltersProps): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<string>('name');
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [selectWidth, setSelectWidth] = React.useState<number>(0);

  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    setSearchType(attributeMap[event.target.value] || 'name'); // Atualiza com o termo em inglês
  };

  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterClick = () => {
    onFilter({ [searchType]: searchValue });
  };

  React.useEffect(() => {
    // Calcula a largura do maior item do menu
    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.whiteSpace = 'nowrap';

    const items = Object.keys(attributeMap);

    items.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item;
      tempContainer.appendChild(span);
    });

    document.body.appendChild(tempContainer);

    const maxWidth = Math.max(...Array.from(tempContainer.childNodes).map((node: HTMLElement) => node.offsetWidth));
    document.body.removeChild(tempContainer);

    setSelectWidth(maxWidth + 16); // Adiciona espaço extra para o padding
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
        <FormControl sx={{ minWidth: selectWidth }}>
          <Select
            labelId="search-type-label"
            value={Object.keys(attributeMap).find(key => attributeMap[key] === searchType) || 'Nome'} // Define o valor exibido corretamente
            onChange={handleSearchTypeChange}
            fullWidth
          >
            {Object.keys(attributeMap).map(key => (
              <MenuItem key={key} value={key}>{key}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <OutlinedInput
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Pesquisar cliente"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ flex: 1, maxWidth: '100%' }}
        />
        <Button variant="contained" color="primary" onClick={handleFilterClick}>
          Filtrar
        </Button>
      </Stack>
    </Card>
  );
}
