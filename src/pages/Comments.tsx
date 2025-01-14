import React, { forwardRef } from "react"
import CommentApi from '../services/api/comment'
import { Box, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import { columns, comment } from "services/models/comments";
import dataComments from "services/models/comments";
import { FaSearch } from "react-icons/fa";
import formatDate from "services/utils/utilities";
import DropDownMenu from "components/DropDownMenu";
import { COLORS } from "services/constants";
import FilterRadioBtns from "components/FilterRadioBtns";
import { useReactToPrint } from "react-to-print";
import { PrintableTable } from "components/PrintableTable";


type commentsProps = {
    pageID: string
    pageName: string
}

const Comments = () => {
    // const account = useAppSelector(state => state.account.value)
    const { pageID, pageName } = useParams<commentsProps>()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataRows, setDataRows] = React.useState<comment[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [filtered, setFiltered] = React.useState<boolean>(false)
    const [searchByPostID, setSearchByPostID] = React.useState('')
    const [filterByStatus, setFilterByStatus] = React.useState('')

    const [sortColumn, setSortColumn] = React.useState<keyof comment | null>(null);
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

    const [loadPrintable, setLoadPrintable] = React.useState<boolean>(false)

    const handleSort = (columnId: keyof comment) => {
        const isAscending = sortColumn === columnId && sortOrder === 'asc';
        setSortOrder(isAscending ? 'desc' : 'asc');
        setSortColumn(columnId);
        sortData(columnId, isAscending ? 'desc' : 'asc');
    };
    const sortData = (columnId: keyof comment, order: 'asc' | 'desc') => {
        const sortedData = [...dataRows].sort((a, b) => {
            const aValue = a[columnId] ?? '';
            const bValue = b[columnId] ?? '';

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setDataRows(sortedData);
    };


    React.useEffect(() => {
        getComments()
    }, [filterByStatus])

    React.useEffect(() => {
        return () => {
            setDataRows([])
        };
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getComments = async (_reset?: boolean) => {
        console.log('getComments')
        setFiltered(false)
        setLoading(true)
        setDataRows([])
        if (!searchByPostID || _reset) {
            if (pageID)
                await CommentApi.getCommentsByPageId(pageID, filterByStatus)
                    .then((data) => {
                        setLoading(false)
                        if (data === null) return;
                        if (data) {
                            fillTable(data)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false)
                    })
        }
        else {
            await CommentApi.getCommentsByPostId(searchByPostID, filterByStatus)
                .then((data) => {
                    setLoading(false)
                    if (data === null) return;
                    if (data) {
                        fillTable(data)
                    }
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false)
                })
        }
    }

    const filterComments = async (filter: boolean) => {
        setFiltered(filter)
        setLoading(true)
        if (searchByPostID) {
            if (filter)
                await CommentApi.getCommentsWith8DigitNumbersByPostId(searchByPostID, filterByStatus)
                    .then((data) => {
                        setLoading(false)
                        if (data === null) return;
                        if (data) {
                            fillTable(data)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false)
                    })
            else getComments()
        }
        else {
            if (pageID)
                if (filter)
                    await CommentApi.getCommentsWith8DigitNumbersByPageId(pageID, filterByStatus)
                        .then((data) => {
                            setLoading(false)
                            if (data === null) return;
                            if (data) {
                                fillTable(data)
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            setLoading(false)
                        })
                else getComments()
        }
    }
    const handlePostIDFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handlePostIDFieldChange', e.target.value)
        setSearchByPostID(e.target.value);
        if (e.target.value === '')
            getComments(true)
    }

    const advancedFilter = async (filter: boolean) => {
        setFiltered(filter)
        setLoading(true)
        await CommentApi.getCommentsDistinctByPostId(searchByPostID, filterByStatus)
            .then((data) => {
                setLoading(false)
                if (data === null) return;
                if (data) {
                    fillTable(data)
                }
            })
            .catch(error => {
                console.log(error);
                setLoading(false)
            })
    }

    const fillTable = (data: dataComments) => {
        console.log("fillTable", data)
        if (data.data)
            if (data.data.length > 0) {
                let row_data: comment[] = []
                data.data.forEach(element => {
                    element.from = element.from ? element.from : 'Unkown';
                    row_data.push(element)
                });
                setDataRows(row_data)
            }
            else {
                setDataRows([])
            }

    }

    const commentDetails = async (id: number) => {
        await CommentApi.getCommentByID(id)
            .then((data) => {
                console.log("data", data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
            <Button onClick={() => setLoadPrintable(true)}>Print</Button>
            <Box sx={{ width: '100%', padding: '16px 0', display: 'flex' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
                        <InputLabel htmlFor="filledInput-adornment-search">Post ID/Link</InputLabel>
                        <FilledInput
                            id="filledInput-adornment-search"
                            type={'text'}
                            onChange={handlePostIDFieldChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            'search'
                                        }
                                        disabled={!searchByPostID ? true : false}
                                        onClick={() => getComments()}
                                        // onMouseDown={handleMouseDownPassword}
                                        // onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        <FaSearch />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FilterRadioBtns filterByStatus={filterByStatus} setFilterByStatus={setFilterByStatus} />
                </Box>
                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', gap: '10px' }}>
                    {
                        !filtered ?
                            <Button variant="contained" onClick={() => filterComments(true)} size={'large'} sx={{ width: '300px' }}>Filter By Phone Numbers</Button>
                            :
                            <Button variant="outlined" onClick={() => filterComments(false)} size={'large'}>Reset Filter</Button>

                    }
                    <Button variant="contained" onClick={() => advancedFilter(true)} size={'large'} sx={{ width: '300px' }} disabled={!searchByPostID}>Advanced By Phone Numbers</Button>
                </Box>
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
                                                style={{ width: column.width, maxWidth: column.width, minWidth: column.width }}
                                                sortDirection={sortColumn === column.id ? sortOrder : false}
                                            >
                                                <TableSortLabel
                                                    active={sortColumn === column.id}
                                                    direction={sortColumn === column.id ? sortOrder : 'asc'}
                                                    onClick={() => handleSort(column.id as keyof comment)}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                        {/* <TableCell
                                            key={'action-cell'}
                                            style={{ minWidth: 50 }}
                                        >
                                            Actions
                                        </TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow

                                                    sx={{
                                                        cursor: 'pointer',
                                                        backgroundColor: row.status ? COLORS[row.status as keyof typeof COLORS] : COLORS.CONFIRMED,
                                                        '&:hover': {
                                                            backgroundColor: '#f5f5f5', // Optional: Highlight on hover
                                                        },
                                                    }}
                                                    onClick={() => commentDetails(row.id)} role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                                {column.format && typeof value === 'boolean'
                                                                    ? column.format(value)
                                                                    : column.format_date && typeof value === 'string' ?
                                                                        column.format_date(value)
                                                                        :
                                                                        column.isStatus ?
                                                                            <DropDownMenu key={row.id} status={value} comment_id={row.id} setDataRows={setDataRows} />
                                                                            :
                                                                            value
                                                                }
                                                            </TableCell>
                                                        );
                                                    })}
                                                    {/* <TableCell key={row.id} sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                        <DropDownMenu status={row.status} comment_id={row.id} handleCommentStatus={handleCommentStatus}/>
                                                    </TableCell> */}
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
                        No comments found.
                    </Box>
            }
            {
                loadPrintable &&
                <div style={{ display: "none" }}>
                    <PrintableTable data={dataRows} setLoadPrintable={setLoadPrintable} pageTitle={pageName} />
                </div>
            }
        </Box>
    )
}

export default Comments