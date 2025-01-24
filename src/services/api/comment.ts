import axios, { AxiosResponse } from 'axios';
import dataComments, { comment } from '../models/comments';
import authHeader from './header';

const refrechCommentsPerOfPage = async (access_token: string, idPage: string, checkGlobal: boolean): Promise<AxiosResponse> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchCommentsPerPage`,
            {
                headers: authHeader(),
                params: {
                    idPage: `${idPage}`,
                    tokenPage: `${access_token}`,
                    globalRefresh: `${checkGlobal}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const refreshAllPagesComments = (): void => {
    try {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/refreshAllPagesCommentsByUser`,
            {
                headers: authHeader(),
            });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentsByPageId = async (page_id: string, status: string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPageComments`,
            {
                headers: authHeader(),
                params: {
                    idPage: `${page_id}`,
                    status: status
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentsByPostId = async (post_id: string, status: string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPostComments`,
            {
                headers: authHeader(),
                params: {
                    idPost: `${post_id}`,
                    status: status
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentsWith8DigitNumbersByPageId = async (page_id: string, status: string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPageCommentsWith8DigitNumbers`,
            {
                headers: authHeader(),
                params: {
                    idPage: `${page_id}`,
                    status: status
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentsWith8DigitNumbersByPostId = async (post_id: string, status: string): Promise<dataComments> => {

    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPostCommentsWith8DigitNumbers`,
            {
                headers: authHeader(),
                params: {
                    idPost: `${post_id}`,
                    status: status
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentsDistinctByPostId = async (post_id: string, status: string): Promise<dataComments> => {

    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchDistinctCommentsOfPost`,
            {
                headers: authHeader(),
                params: {
                    idPost: `${post_id}`,
                    status: status
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const getCommentByID = async (id: number): Promise<comment> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchCommentByID`,
            {
                headers: authHeader(),
                params: {
                    id: `${id}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const updateCommentStatus = async (comment_id: number, status: string): Promise<void> => {
    try {
        await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/comment/updateStatus`,
            {
                id: comment_id,
                status: status
            },
            {
                headers: authHeader()
            }
        ).then(response => {
                console.log("comment status updated", response)
            })
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default {
    getCommentsByPageId,
    getCommentsByPostId,
    getCommentsWith8DigitNumbersByPageId,
    getCommentsWith8DigitNumbersByPostId,
    updateCommentStatus,
    getCommentByID,
    refrechCommentsPerOfPage,
    getCommentsDistinctByPostId,
    refreshAllPagesComments
}