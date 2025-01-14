import React from "react"
import { Box, Button, Container, CssBaseline, Divider, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import UserApi from '../services/api/user'
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "hooks/stateHooks";
import { disableAuth, enableAuth } from '../services/state/reducers/auth';
import { setAccount } from '../services/state/reducers/account';
const Login = () => {
    const dispatch = useAppDispatch()
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
    }, [])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Simulate a login request
            await UserApi.signin(username, password)
                .then((response)=>{
                    localStorage.setItem('session', response.accessToken!.toString());
                    dispatch(enableAuth())
                    dispatch(setAccount(response));
                });
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setLoading(false);
            setUsername('')
            setPassword('')
        }
    };

    return (
        <Box sx={{ width:'100%',height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{width:'60%', height:'100%'}}>
                <img src="xhi-logo-1.jpeg" style={{height:'100%', width:'100%'}}  alt="logo" />
            </Box>
            <Box sx={{width:'40%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            required
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={loading}
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!username || !password ? true : false}
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Login