import React from "react"
import GraphApi from '../services/api/graph'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import post from "services/models/posts";

type postsProps = {
    pageToken: string
    pageId: string
}

const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'message', label: 'Title', minWidth: 100 },
    { id: 'created_time', label: 'Created', minWidth: 170 }
];

interface Column {
    id: 'id' | 'message' | 'created_time';
    label?: string;
    minWidth?: number;
}

const Posts = () => {
    // const account = useAppSelector(state => state.account.value)
    const navigate = useNavigate();
    const { pageToken, pageId } = useParams<postsProps>()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataRows, setDataRows] = React.useState<post[]>([])
    React.useEffect(() => {
        getPosts()
    }, [])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getPosts = async () => {
        if (pageToken && pageId)
            await GraphApi.fb_posts(pageToken, pageId)
                .then((data) => {
                    if (data === null) return;
                    if (data) {
                        console.log("data: " + JSON.stringify(data))
                        if (data.data && data.data.length > 0) {
                            let row_data: post[] = []
                            data.data.forEach(element => {
                                element.message = element.message? element.message : 'Untitled'
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
                                    <TableRow hover onClick={() => navigate('/post/comments/'+row.id+'/'+pageToken)} role="checkbox" tabIndex={-1} key={row.id}>
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

export default Posts