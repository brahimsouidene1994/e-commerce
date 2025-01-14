import axios, { AxiosResponse } from 'axios';
import AccountObject from 'services/models/account';
import authHeader from './header';

const signin = async (username: string, password: string): Promise<AccountObject> => {
    console.log("signin()");
    try {
        const response: AxiosResponse<AccountObject> = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/auth/signin`,
            { username, password } // Payload for the POST request
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const verifySession = async (): Promise<AxiosResponse> => {
    console.log("verifySession()");
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/sessionVerified`,
            {
                headers: authHeader()
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    signin,
    verifySession
};
