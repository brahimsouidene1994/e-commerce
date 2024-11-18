import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { useAppDispatch, useAppSelector } from '../hooks/stateHooks';
import { setAccount } from '../services/state/reducers/account';
import { enableAuth } from '../services/state/reducers/auth';
const LoginForm = (props) => {
    const dispatch = useAppDispatch()
    const handleFacebookCallback = (response) => {
        if (response?.status === "unknown") {
            console.error('Sorry!', 'Something went wrong with facebook Login.');
            return;
        }
        console.log(response);
        dispatch(setAccount(response));
        dispatch(enableAuth());
    }

    return (
        <FacebookLogin
            buttonStyle={{ padding: "6px" }}
            appId={`537312459166869`}  // we need to get this from facebook developer console by setting the app.
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookCallback} />
    );
};
export default LoginForm;