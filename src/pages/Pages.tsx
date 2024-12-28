import React from "react"
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PageApi from '../services/api/page'
import page from "services/models/page";
import Utils from "services/utils/utilities";
import LoadingBtnRefrech from "components/LoadingBtnRefrech";
import axios, { AxiosResponse } from "axios";

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
    // const account = useAppSelector(state => state.account.value)
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


    const location = useLocation();

    const [authenticatedUser, setAuthenticatedUser] = React.useState(false)
    // React.useEffect(() => {
    //     // getPages()

    // }, [])
    React.useEffect(() => {
        // Parse the query parameters to extract the "code"

        const savedToken = localStorage.getItem("fb_token");
        if (savedToken) {
            setAuthenticatedUser(true);
            getPages()
        }
        else {
            const queryParams = new URLSearchParams(location.search);
            const code = queryParams.get("code");
            if (code) {
                console.log("Authorization code:", code);
                exchangeCodeForToken(code)
            } else {
                console.error("No authorization code found.");
                handleFbConnect()
            }
        }

    }, [location]);

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

    const handleRefreshClick = async (token: string) => {
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

    const handleRowClick = (idPage: string, name: string | null, status: boolean) => {
        if (!status)
            navigate('/page/comments/' + idPage + '/' + name)
    }

    const handleFbConnect = () => {
        const REDIRECT_URI = "https://xhi.tn/";
        const SCOPES = "pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement";

        // Construct the Facebook login URL
        const facebookLoginUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&scope=${SCOPES}&response_type=code`;

        // Function to redirect user to Facebook login
        window.location.href = facebookLoginUrl;

    }

    const exchangeCodeForToken = async (code: string) => {
        console.log("exchangeCodeForToken()")
        const REDIRECT_URI = "https://xhi.tn/";
        try {
            const response: AxiosResponse = await axios.get(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${process.env.REACT_APP_FACEBOOK_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_FACEBOOK_APP_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`);
            if (response.status === 200) {
                console.log("User Access Token:", response.data.access_token);
                setAuthenticatedUser(true)
                if (response.data.access_token)
                    localStorage.setItem("fb_token", response.data.access_token);
                handleRefreshClick(response.data.access_token)
            }
        } catch (error: any) {
            if (
                error.error.code === 100
            ) {
                console.error(error.error.message);
                handleFbConnect()
            } else {
                // Handle other errors
                throw error;
            }
            console.error('Error fetching data:', error);
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('fb_token');
        setAuthenticatedUser(false)
        window.location.href = "http://localhost:3001/"
    }

    return (
        <>
            {
                authenticatedUser &&
                <Box sx={{m: 1, width: '80%' }}>
                    {/* <Box sx={{ width: '100%', padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
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
                    </Box> */}
                    <Box sx={{ display: 'flex', flexDirection:'row', justifyContent:'space-between',height: '50px', marginBottom: '20px' }}>
                        <Box sx={{ height: '100%' }}>
                            <TextField
                                label="Filter by Name"
                                variant="outlined"
                                sx={{ height: '100%' }}
                                onChange={(e) => handleFilterChange("name", e.target.value)}
                            />
                            <TextField
                                label="Filter by ID"
                                variant="outlined"
                                type="number"
                                sx={{ height: '100%' }}
                                onChange={(e) => handleFilterChange("idPage", e.target.value)}
                            />

                        </Box>
                        <Button variant="contained" onClick={logout} sx={{ height: '110%', width: '180px' }} >Logout</Button>

                    </Box>
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
                                                            onClick={() => handleRowClick(row.idPage, row.name, row.status)}
                                                            tabIndex={-1}
                                                            key={row.id}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: '#f5f5f5', // Optional: Highlight on hover
                                                                },
                                                            }}
                                                        >
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <TableCell key={column.id} sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                                        {column.isRefresh && typeof value === 'number'
                                                                            ?
                                                                            <LoadingBtnRefrech key={row.id} access_token={row.access_token} idPage={row.idPage} status={row.status} setDataRows={setDataRows} />
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
            }
        </>
    )
}

export default Pages