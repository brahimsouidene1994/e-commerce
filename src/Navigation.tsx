import { useAppDispatch, useAppSelector } from './hooks/stateHooks';
import LoginForm from './components/LoginForm';
import Pages from 'pages/Pages';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Posts from 'pages/Posts';
import Comments from 'pages/Comments';
const Navigation = () => {
    return (
        <Router>

            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}>
                <Routes>

                    <Route path="/" element={<Pages />} />
                    <Route path="/posts/:pageId/:pageToken" element={<Posts />} />
                    <Route path="/post/comments/:postId/:pageToken" element={<Comments />} />
                </Routes>

            </Box>
        </Router>
    )
}
export default Navigation;