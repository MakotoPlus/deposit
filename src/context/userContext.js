//
// USER Context
//
import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

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
    });

    const Login = ((userid, username, token)=>{
        setUser(
            {
                "userid" : userid,
                "username" : username,
                "toekn" : token,
                "isAuthenticated" : true,
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
