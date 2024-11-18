import React from "react"
import GraphApi from '../services/api/graph'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import page from "services/models/pages";
import { useNavigate } from "react-router-dom";

const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'category', label: 'Category', minWidth: 170 }
];

interface Column {
    id: 'id' | 'name' | 'category';
    label: string;
    minWidth?: number;
}

const Pages = () => {
    // const account = useAppSelector(state => state.account.value)
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataRows, setDataRows] = React.useState<page[]>([])
    React.useEffect(() => {
        getPages()
    }, [])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getPages = async () => {
        await GraphApi.fb_pages()
            .then((data) => {
                if (data === null) return;
                if (data) {
                    if (data.data && data.data.length > 0) {
                        let row_data: page[] = []
                        data.data.forEach(element => {
                            row_data.push(element)
                        });
                        setDataRows(row_data)
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    return (
        <Paper sx={{ width: '60%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        {dataRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover onClick={() => navigate('/posts/'+row.id+'/'+row.access_token)} role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id}>
                                                    {value}
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
    )
}

export default Pages