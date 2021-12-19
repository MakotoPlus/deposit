//
// USER Context
//
import { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export function useUserContext(){
    return useContext(UserContext);
}

export function UserProvider({children}){
    const [user, setUser] = useState(
    {
        "userid" : "",
        "username" : "",
        "token" : "",
        "isAuthenticated" : false,
        "Authorization" : {},
    });

    const Login = ((userid, username, token)=>{
        //console.log(`LOGIN=TOKEN=>${token}`);
        setUser(
            {
                "userid" : userid,
                "username" : username,
                "token" : token,
                "isAuthenticated" : true,
                "Authorization" : {
                    Authorization : "JWT " + token
                },
            }
        )
    });

    const value = {
        user,
        setUser,
        Login,
    };


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
