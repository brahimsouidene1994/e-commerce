import React from "react"
import GraphApi from '../services/api/graph'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useParams } from "react-router-dom";
import { comment } from "services/models/comments";

type commentsProps = {
    pageToken: string
    postId: string
}

const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'message', label: 'Comment', minWidth: 100 },
    { id: 'fromOwner', label: 'By', minWidth: 170 },
    { id: 'created_time', label: 'Created ', minWidth: 170 }
];

interface Column {
    id: 'id' | 'message' | 'created_time' | 'fromOwner';
    label?: string;
    minWidth?: number;
}

const Comments = () => {
    // const account = useAppSelector(state => state.account.value)
    const { pageToken, postId } = useParams<commentsProps>()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataRows, setDataRows] = React.useState<comment[]>([])
    React.useEffect(() => {
        getComments()
    }, [])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getComments = async () => {
        if (pageToken && postId)
            await GraphApi.fb_comments(pageToken, postId)
                .then((data) => {
                    if (data === null) return;
                    if (data) {
                        console.log("data: " + JSON.stringify(data))
                        if (data.data && data.data.length > 0) {
                            let row_data: comment[] = []
                            data.data.forEach(element => {
                                element.fromOwner = element?.from?.name ?? 'Unkown';
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
                                    <TableRow hover onClick={() => console.log("clicked!!!", JSON.stringify(row))} role="checkbox" tabIndex={-1} key={row.id}>
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

export default Comments