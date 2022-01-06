import React from 'react';
import LoginPage from '../LoginPage';
import Dashboard from '../../dashboard/Dashboard';
import {useUserContext} from '../../context/userContext';

  
/**
 * ログイン済みか否かで画面切替( Routerは、Dashboard内で利用しているのでここでは記載しない)
 * @return {JSX.Element}
 */
export default function AuthRouter(){
    const {user} = useUserContext();
    console.log(`AuthRouter::user.isAuthenticated:${user.isAuthenticated}`)
    return (
      <React.Fragment>
      {
        (user.isAuthenticated) ? <Dashboard/> : <LoginPage/>
      }
      </React.Fragment>
    )
}
   