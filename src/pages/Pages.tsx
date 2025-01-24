import React from "react"
import { Box, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageApi from '../services/api/page';
import CommentApi from '../services/api/comment';
import page from "services/models/page";
import Utils from "services/utils/utilities";
import { FaSearch } from "react-icons/fa";
import LoadingBtnRefrech from "components/LoadingBtnRefrech";
import { useAppSelector,useAppDispatch } from "hooks/stateHooks";
import { disableAuth, enableAuth } from '../services/state/reducers/auth';
import { clearAccount } from '../services/state/reducers/account';

const columns: readonly Column[] = [
    { id: 'idPage', label: 'ID', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'category', label: 'Category', minWidth: 170 },
    { id: 'lastRefresh', label: 'Last Refresh', minWidth: 170, format_date: (value: string) => Utils.timeDifference(value) },
    // { id: 'id', label: 'Global Refresh', minWidth: 100, isCheckBox: true },
    { id: 'id', label: 'Action', minWidth: 100, isRefresh: true }
];

interface Column {
    id: 'idPage' | 'lastRefresh' | 'name' | 'category' | 'id';
    label: string;
    minWidth?: number;
    format_date?: (value: string) => string;
    isRefresh?: boolean;
    isCheckBox?: boolean;
}

const Pages = () => {
    const account = useAppSelector(state => state.account.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataRows, setDataRows] = React.useState<page[]>([]);
    const [token, setToken] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false);
    const [btnRefreshEnabled, setBtnRefreshEnabled] = React.useState<boolean>(true);
    const [filter, setFilter] = React.useState<{ [key: string]: string }>({
        idPage: "",
        name: ""
    });

    React.useEffect(() => {
        console.log("account", account)
        getPages()
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleTokenFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToken(e.target.value);
        setBtnRefreshEnabled(false)
        if (e.target.value === '')
            setBtnRefreshEnabled(true)
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilter((prev) => ({ ...prev, [key]: value.toLowerCase() }));
    };

    const filteredData = dataRows.filter((row) =>
        Object.keys(filter).every((key) =>
            String(row[key as keyof page])
                .toLowerCase()
                .includes(filter[key])
        )
    );

    const getPages = async () => {
        setLoading(true)
        await PageApi.getPages()
            .then((data) => {
                setLoading(false)
                if (data === null) return;
                if (data) {
                    if (data.data && data.data.length > 0) {
                        setDataRows(data.data)
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleRefreshClick = async () => {
        setLoading(true)
        setDataRows([])
        if (token)
            await PageApi.refrechFBPages(token)
                .then(() => {
                    getPages()
                })
                .catch(error => {
                    console.log(error);
                })
    }

    const handleRowClick = (idPage: string, name: string | null, status: boolean, _refreshSuccess:boolean) => {
        if (!status && _refreshSuccess )
            navigate('/page/comments/' + idPage + '/' + name)
    }

    const handleRefreshAllPagesComments = () => {
        CommentApi.refreshAllPagesComments()
    }

    const logout = () => {
        localStorage.removeItem('session');
        dispatch(disableAuth());
        dispatch(clearAccount())
    }
    return (
        <Box sx={{ width: '80%' }}>
            <Box sx={{ width: '100%', padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ m: 1, width: '80%' }} variant="filled">
                    <InputLabel htmlFor="filledInput-adornment-search">Oauth token</InputLabel>
                    <FilledInput
                        id="filledInput-adornment-search"
                        type={'text'}
                        onChange={handleTokenFieldChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        'search'
                                    }
                                    disabled={btnRefreshEnabled}
                                    onClick={handleRefreshClick}
                                    edge="end"
                                >
                                    <FaSearch />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                    <Button onClick={logout}>Logout</Button>
                    <Button onClick={handleRefreshAllPagesComments}>Refresh All</Button>
                </Box>
            </Box>
            <TextField
                label="Filter by Name"
                variant="outlined"
                size="small"
                margin="dense"
                onChange={(e) => handleFilterChange("name", e.target.value)}
            />
            <TextField
                label="Filter by ID"
                variant="outlined"
                size="small"
                margin="dense"
                type="number"
                onChange={(e) => handleFilterChange("idPage", e.target.value)}
            />
            {
                loading && <LinearProgress />
            }
            {
                dataRows.length > 0 ?
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow
                                                    onClick={() => handleRowClick(row.idPage, row.name, row.status,row.refreshSuccess)}
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: row.refreshSuccess?'#f5f5f5':'#f16c6273', // Optional: Highlight on hover
                                                        },
                                                        backgroundColor: row.refreshSuccess?'transparent':'#f16c6273'
                                                    }}
                                                    
                                                >
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                                {column.isRefresh && typeof value === 'number'
                                                                    ?
                                                                    <LoadingBtnRefrech key={row.id} access_token={row.access_token} idPage={row.idPage} status={row.status} setDataRows={setDataRows}/>
                                                                    :
                                                                    column.format_date && typeof value === 'string' ?
                                                                        column.format_date(value)
                                                                        :

                                                                        value
                                                                }
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={dataRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    :
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                        No Pages found.
                    </Box>
            }
        </Box>
    )
}

export default Pages