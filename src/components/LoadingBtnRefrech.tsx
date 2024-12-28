import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CommentApi from '../services/api/comment';
import PageApi from '../services/api/page';
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material';
import page from 'services/models/page';
import { HiStop } from "react-icons/hi";


type LoadingBtnRefrechProps = {
    idPage: string
    access_token: string
    setDataRows: Function
    status: boolean
}

export default function LoadingBtnRefrech({ idPage, access_token, setDataRows, status }: LoadingBtnRefrechProps) {
    const [btnEnabled, setBtnEnabled] = React.useState<boolean>(status);
    const [loading, setLoading] = React.useState<boolean>(status);
    const [checkGlobal, setCheckGlobal] = React.useState<boolean>(false);

    const handleRefrechPage = async (event: React.MouseEvent) => {
        event.stopPropagation();
        setLoading(true)
        setBtnEnabled(true)
        handleDataRows(true)
        await CommentApi.refrechCommentsPerOfPage(access_token, idPage, checkGlobal)
            .then(() => {
                setLoading(false)
                setBtnEnabled(false)
                handleDataRows(false)
            }
            )
            .catch(error => console.log(error))
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckGlobal(event.target.checked);
    }
    const handleDataRows = (_status: boolean) => {
        setDataRows((prevRows: page[]) =>
            prevRows.map(_page =>
                _page.idPage === idPage
                    ? { ..._page, status: _status } // Update the status if id matches
                    : _page // Keep the comment unchanged otherwise
            )
        );
    }

    const handleStopRefresh = async(event: React.MouseEvent) => {
        event.stopPropagation();
        await PageApi.stopRefreshPage(idPage)
            .then(() => {
                setLoading(false)
                setBtnEnabled(false)  
                handleDataRows(false)
            })
            .catch(error => console.log(error));
    }
    return (
        <Box>
            <LoadingButton
                sx={{ width: '60%' }}
                size="large"
                color={"primary"}
                variant="contained"
                // loadingPosition="end"
                onClick={(event) => handleRefrechPage(event)}
                loading={loading}
                disabled={btnEnabled}
            >
                Refresh
            </LoadingButton>
            {
                !status && !btnEnabled?
                <Tooltip title="Global Refresh">
                    <Checkbox onClick={(event) => event.stopPropagation()} onChange={handleChange} checked={checkGlobal} size="large" />
                </Tooltip>
                :
                <IconButton aria-label="stop" onClick={(event)=>handleStopRefresh(event)}>
                    <HiStop color='red' size={36}/>
                </IconButton>
            }

        </Box>
    )
}