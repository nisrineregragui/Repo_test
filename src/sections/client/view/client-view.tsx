import type { Client } from 'src/types/client';
import type { SelectChangeEvent } from '@mui/material/Select';

import { debounce } from 'es-toolkit';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { getClients, createClient, updateClient, deleteClient } from 'src/services/client-service';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { ClientDialog } from '../client-dialog';
import { ClientTableRow } from '../client-table-row';
import { TableEmptyRows } from '../table-empty-rows';
import { ClientTableHead } from '../client-table-head';
import { ClientTableToolbar } from '../client-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export function ClientView() {
    const table = useTable();

    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentClient, setCurrentClient] = useState<Client | null>(null);

    const fetchData = useCallback(
        async (searchQuery: string, typeQuery: string) => {
            try {
                const data = await getClients({ search: searchQuery, typeClient: typeQuery });
                setClients(data);
            } catch (error) {
                console.error('Failed to fetch clients', error);
            }
        },
        []
    );

    // Debounced fetch function
    const debouncedFetchData = useCallback(
        debounce((query: string, type: string) => {
            fetchData(query, type);
        }, 500),
        [fetchData]
    );

    useEffect(() => {
        fetchData('', '');
    }, [fetchData]);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setFilterName(newName);
        table.onResetPage();
        debouncedFetchData(newName, filterType);
    };

    const handleFilterType = (event: SelectChangeEvent) => {
        const newType = event.target.value;
        setFilterType(newType);
        table.onResetPage();
        fetchData(filterName, newType); // No debounce needed for select
    };

    const handleOpenNewClient = () => {
        setCurrentClient(null);
        setOpenDialog(true);
    };

    const handleOpenEditClient = (client: Client) => {
        setCurrentClient(client);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentClient(null);
    };

    const handleSubmitClient = async (data: Partial<Client>) => {
        try {
            if (currentClient) {
                // Update
                await updateClient(currentClient.clientID, data);
            } else {
                // Create
                await createClient(data);
            }
            handleCloseDialog();
            fetchData(filterName, filterType); // Refresh list
        } catch (error) {
            console.error('Failed to save client', error);
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await deleteClient(id);
                fetchData(filterName, filterType); // Refresh list
            } catch (error) {
                console.error('Failed to delete client', error);
            }
        }
    };

    const handleDeleteRows = async () => {
        const selectedIds = table.selected;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} clients?`)) {
            try {
                // Sequentially delete (could be parallelized or bulk API used if available)
                for (const id of selectedIds) {
                    await deleteClient(id);
                }
                table.onSelectAllRows(false, []); // Clear selection
                fetchData(filterName, filterType); // Refresh list
            } catch (error) {
                console.error('Failed to delete clients', error);
            }
        }
    };

    // We only pass clients to applyFilter, and we pass '' as filterName
    // because the clients array is ALREADY filtered by the server.
    // applyFilter will still handle sorting.
    const dataFiltered: Client[] = applyFilter({
        inputData: clients,
        comparator: getComparator(table.order, table.orderBy),
        filterName: '', // Frontend filtering disabled for name
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Clients
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleOpenNewClient}
                >
                    New Client
                </Button>
            </Box>

            <Card>
                <ClientTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterName}
                    onDeleteRows={handleDeleteRows}
                    filterType={filterType}
                    onFilterType={handleFilterType}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <ClientTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={clients.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        clients.map((client) => client.clientID)
                                    )
                                }
                                headLabel={[
                                    { id: 'nomContact', label: 'Name' },
                                    { id: 'numTelephone', label: 'Phone' },
                                    { id: 'email', label: 'Email' },
                                    { id: 'ville', label: 'City' },
                                    { id: 'typeClient', label: 'Type' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row) => (
                                        <ClientTableRow
                                            key={row.clientID}
                                            row={row}
                                            selected={table.selected.includes(row.clientID)}
                                            onSelectRow={() => table.onSelectRow(row.clientID)}
                                            onEdit={() => handleOpenEditClient(row)}
                                            onDelete={() => handleDeleteClient(row.clientID)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, clients.length)}
                                />

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={clients.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>

            <ClientDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitClient}
                client={currentClient}
            />
        </DashboardContent>
    );
}

// ----------------------------------------------------------------------

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}
