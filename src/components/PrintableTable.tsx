import { forwardRef } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { COLORS } from "services/constants";
import { columns } from "services/models/comments";
import DropDownMenu from "./DropDownMenu";
import React from "react";
import { useReactToPrint } from "react-to-print";
import Utils from "services/utils/utilities";

export const PrintableTable = forwardRef<HTMLDivElement, { data: any[],setLoadPrintable:Function, pageTitle:string|undefined }>(
    ({ data, setLoadPrintable,pageTitle }, ref) => {
        const contentRef = React.useRef<HTMLDivElement>(null);
        const [documentTitle, setDocumentTitle] = React.useState<string>(pageTitle+'-'+Utils.formatDate(new Date().toString()));

        React.useEffect(() => {
            console.log("documentTitle", documentTitle)
            if(data.length > 0){

                console.log("data loaded");
                reactToPrintFn()
            }
            else console.log("waiting for data");
        },[contentRef])
        const reactToPrintFn = useReactToPrint({
            contentRef,
            documentTitle: documentTitle,
            onAfterPrint: () => {
                console.log("Printing completed.");
                setLoadPrintable(false)
            },
            onPrintError: (error) => {
                console.error("Print error:", error);
                setLoadPrintable(false)
            },
        });
        const fn_console = (value: string) => {
            console.log(value)
        }
        return (
            <div ref={contentRef}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ width: column.width, maxWidth: column.width, minWidth: column.width }}
                                        >

                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
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
                                                onClick={() => console.log("clicked Row!!!")} role="checkbox" tabIndex={-1} key={row.id}>
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
                                                                        <DropDownMenu key={row.id} status={value} comment_id={row.id} setDataRows={() => fn_console('simple log')} />
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
                </Paper>
            </div>
        )
    }
)