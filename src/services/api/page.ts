import axios, { AxiosResponse } from 'axios';
import dataPages from '../models/page';
const getPages = async (): Promise<dataPages> => {
    console.log("getPages()")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/getPages`);
        console.log("response ", response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const refrechFBPages = async (token:String): Promise<AxiosResponse> => {
    console.log("getPages()")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/fetchAndSaveAccountPages`, {
            params: {
                access_token: `${token}`
            }
        });
        console.log("response ", response.data)
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const stopRefreshPage = async (idPage:String): Promise<AxiosResponse> => {
    console.log("getPages()", idPage);
    try {
        const response: AxiosResponse = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/page/stopRefreshPage`, {
            params: {
                idPage: `${idPage}`
            }
        });
        console.log("response ", response)
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default {
    getPages,
    refrechFBPages,
    stopRefreshPage
}