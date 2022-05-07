//
// USER Context
//
import React, { createContext, useState, useContext } from 'react';
const prj_const = require('../component/common/prj_const.js')

export const UserContext = createContext();

export function useUserContext(){
    return useContext(UserContext);
}


function loadStrage(){
    //console.debug("loadStrage");
    let initState = {
        "userid" : "",
        "username" : "",
        "token" : "",
        "isAuthenticated" : false,
        "Authorization" : {},
    };
    const appState = localStorage.getItem(prj_const.APP_KEY);
    if (appState){
        initState = JSON.parse(appState);
    }
    //console.debug(initState);
    return initState;
}

export function UserProvider({children}){
    const [user, setUser] = useState(loadStrage());

    const Logout = () =>{
        let data = {
            "userid" : "",
            "username" : "",
            "token" : "",
            "isAuthenticated" : false,
            "Authorization" : {},
        };
        //
        // ログインした時にローカルストレージに保存実施
        localStorage.setItem(prj_const.APP_KEY, JSON.stringify(data))
        console.debug("Logout");
        //console.debug(JSON.stringify(data));
        setUser(data);
    }
    const Login = ((userid, username, token)=>{
        //console.debug(`LOGIN=TOKEN=>${token}`);
        let data = {
            "userid" : userid,
            "username" : username,
            "token" : token,
            "isAuthenticated" : true,
            "Authorization" : {
                Authorization : "JWT " + token
            },
        };
        //
        // ログインした時にローカルストレージに保存実施
        localStorage.setItem(prj_const.APP_KEY, JSON.stringify(data))
        //console.debug("Save Strage");
        //console.debug(JSON.stringify(data));
        setUser(data);
    });

    const value = {
        user,
        setUser,
        Login,
        Logout,
    };


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
