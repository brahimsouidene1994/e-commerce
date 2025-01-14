import { useAppDispatch, useAppSelector } from './hooks/stateHooks';
import Pages from 'pages/Pages';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Comments from 'pages/Comments';
import Login from 'pages/Login';
import React from 'react';
import { enableAuth } from './services/state/reducers/auth';
import { setAccount } from './services/state/reducers/account';
import AccountObject from 'services/models/account';
import UserApi from 'services/api/user'
const Navigation = () => {
    const auth = useAppSelector((state) => state.auth.value);
    const dispatch = useAppDispatch()
    React.useEffect(() => {
        const session = localStorage.getItem('session');
        if(session) {
            UserApi.verifySession()
            .then(() => {
                const acc : AccountObject = {
                    accessToken: session
                }
                dispatch(setAccount(acc));
                dispatch(enableAuth());
            })
            .catch(()=>{
                localStorage.removeItem('session');
            })
        }
    },[])
    return (
        <Router>

            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center'}}>
                <Routes>
                    {
                        !auth ?
                            <Route path="/" element={<Login />}  />
                            :
                            <>
                                <Route path="/" element={<Pages />} />
                                <Route path="/page/comments/:pageID/:pageName" element={<Comments />} />
                            </>
                    }
                </Routes>

            </Box>
        </Router>
    )
}
export default Navigation;