import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';
import { COLORS } from 'services/constants';
import LoadingButton from '@mui/lab/LoadingButton';
import CommentApi from '../services/api/comment'
import { comment } from 'services/models/comments';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

type DropDownMenuProps = {
    status: string | null
    comment_id: number | null
    setDataRows: Function
}
interface optionItem {
    key: string
    value: string
}

export default function DropDownMenu({ status, comment_id, setDataRows }: DropDownMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [options, setOptions] = React.useState<optionItem[]>([])
    const [loading, setLoading] = React.useState<boolean>(false);
    const open = Boolean(anchorEl);
    React.useEffect(() => {
        printObject(COLORS)
    }, [])
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (status: string) => {
        setAnchorEl(null);
        handleCommentStatus(comment_id, status);
    };
    const handleBtnClose = () => {
        setAnchorEl(null);
    }

    const handleCommentStatus = (comment_id: number | null, status: string) => {
        console.log('handleCommentStatus', comment_id, status)
        setLoading(true);
        if (comment_id && status)
            CommentApi.updateCommentStatus(comment_id, status)
                .then(() => {
                    setLoading(false)
                    setDataRows((prevRows: comment[]) =>
                        prevRows.map(comment =>
                            comment.id === comment_id
                                ? { ...comment, status: status } // Update the status if id matches
                                : comment // Keep the comment unchanged otherwise
                        )
                    );
                })
                .catch((error) => console.error(error));
    }

    const printObject = (obj: Record<string, any>) => {
        let items: Array<optionItem> = [];
        for (const [key, value] of Object.entries(obj)) {
            let item: optionItem = {
                key: key,
                value: value
            }
            items.push(item)
        }
        setOptions(items)
    }

    const options_component = options.map(option => {
        return (
            <MenuItem key={option.key} disabled={option.key === status ? true : false} onClick={() => handleClose(option.key)} sx={{ backgroundColor: option.value }} disableRipple>
                {option.key}
            </MenuItem>
        )
    });

    return (
        <div>
            <LoadingButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                loadingPosition="start"
                loading={loading}
                disableElevation
                onClick={handleClick}
                sx={{ width: '150px', height: 'auto', fontSize: '1rem', fontWeight: 'bold' }}
            >
                {status}
            </LoadingButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleBtnClose}
            >
                {options_component}
            </StyledMenu>
        </div>
    );
}