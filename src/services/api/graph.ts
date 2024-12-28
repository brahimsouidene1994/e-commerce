import axios, { AxiosResponse } from "axios";
import oauthObject from "services/models/oauth";
import dataPages from "services/models/page";
import dataPosts from "services/models/posts";
import dataComments from "services/models/comments";

const test = async (token:string):Promise<void> => {
    let url=`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}`
    console.log("test url ", url)
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}/me?`, {
          params: {
            access_token:token, 
          },
        });
        console.log("response ", response.data)
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    
}

const fb_oauth = async ():Promise<oauthObject>=>{
    console.log("fb_oauth ")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}/oauth/access_token?`,{
            params: {
                grant_type:'fb_exchange_token',
                client_id:`${process.env.REACT_APP_FACEBOOK_APP_CLIENT_ID}`,
                client_secret:`${process.env.REACT_APP_FACEBOOK_APP_CLIENT_SECRET}`,
                fb_exchange_token:`${process.env.REACT_APP_FACEBOOK_APP_BIS}`
            }
        });
        console.log("response ", response.data)
        return response.data as oauthObject;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
}

const fb_pages = async ():Promise<dataPages>=>{

    console.log("fb_oauth ")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}/me/accounts?`,{
            params: {
                access_token:'EAAPsZAXoYOwIBO3ftagcBV3nZCl4dSHKfe53dSwfPydzbyYm9N32TNZCP3ckig24rwjyaFg7gPHcZA6eYSSZBE1fmF3M6WX5QFdd4tHrVIvtVVAQpTahvJlN2vIO0Kk0llxnIGQMHz6wGWPbZAj3wsMlxjvsyCQoaTWxWpxOQZCQV30eRt8RCwv4Rsgdcaj3EOAOm150fWq'
            }
        });
        console.log("response ", response.data)
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
}

const fb_posts = async (pageToken:string, pageId:string):Promise<dataPosts>=>{

    console.log("fb_posts ")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}/${pageId}/posts?`,{
            params: {
                access_token:`${pageToken}`
            }
        });
        console.log("response ", response.data)
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
}

const fb_comments = async (pageToken:string, postId:string):Promise<dataComments>=>{

    console.log("fb_comments ")
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_FACEBOOK_GRAPH_BASE_URL}/${postId}/comments?`,{
            params: {
                access_token:`${pageToken}`
            }
        });
        console.log("response ", response.data)
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
}

export default{
    test,
    fb_oauth,
    fb_pages,
    fb_posts,
    fb_comments
}