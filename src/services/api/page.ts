import axios, { AxiosResponse } from 'axios';
import dataPages from '../models/page';
import authHeader from './header';
const getPages = async (): Promise<dataPages> => {
    console.log("getPages()")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/getPages`,
            {
                headers: authHeader()
            }
        );
        console.log("response ", response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const refrechFBPages = async (token: String): Promise<AxiosResponse> => {
    console.log("getPages()")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/fetchAndSaveAccountPages`,
            {
                headers: authHeader(),
                params: {
                    fbToken: `${token}`
                }
            });
        console.log("response ", response.data)
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const stopRefreshPage = async (idPage: String): Promise<AxiosResponse> => {
    console.log("stopRefreshPage()", idPage);
    try {
        const response: AxiosResponse = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/page/stopRefreshPage`,{},
            {
                headers: authHeader(),
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