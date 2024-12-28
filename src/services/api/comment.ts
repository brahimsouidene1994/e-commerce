import axios, { AxiosResponse } from 'axios';
import dataComments, { comment } from '../models/comments';

const refrechCommentsPerOfPage = async(access_token: string, idPage: string, checkGlobal: boolean): Promise<AxiosResponse> =>{
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchCommentsPerPage`, {
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

const getCommentsByPageId = async (page_id: string, status:string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPageComments`, {
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

const getCommentsByPostId = async (post_id: string, status:string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPostComments`, {
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

const getCommentsWith8DigitNumbersByPageId = async (page_id: string, status:string): Promise<dataComments> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPageCommentsWith8DigitNumbers`, {
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

const getCommentsWith8DigitNumbersByPostId = async (post_id: string, status:string): Promise<dataComments> => {

    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchPostCommentsWith8DigitNumbers`, {
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

const getCommentByID = async (id:number): Promise<comment> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comment/fetchCommentByID`, {
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
        await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/comment/updateStatus`, {
            id: comment_id,
            status: status

        }).then(response => {
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
    refrechCommentsPerOfPage
}