import AccountObject from "services/models/account";

export default function authHeader (){
    const session = localStorage.getItem('session');
    if(session) {
        return  {
            Authorization: `Bearer ${session}`, // Example of an Authorization header
            'Content-Type': 'application/json', // Add other headers as needed
        }
    }
    else return {}
}
