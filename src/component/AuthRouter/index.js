import React, {AppFrame, BaseRepository, Switch, NotFound, location} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import LoginPage from '../LoginPage';
import Dashboard from '../../dashboard/Dashboard';

/*
* ログイン済みならば true,そうでないならば false を返す関数
* @return {Promise<boolean>}
*/
const getIsAuthenticated = async () => {
    try{
      // API にアクセスして認証済みか確認するなど、何か認証を確認する適当な非同期処理
      const response = await BaseRepository.post('is-auth', {/** トークン等の認証状態を示すデータ */});
      console.log("getIsAuthenticated:success");
      return !!response.data.success;
    }catch(err){
      console.log("getIsAuthenticated:error");
      return false;
    }
   };
   
   /**
   * ログイン済みか否かをチェックするフック
   * @return {{isLoading: boolean, setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>, isAuthenticated: boolean}}
   */
   const useAuthChecker = () => {
    const [isLoading, setLoading] = React.useState(false);
    const [isAuthenticated, setAuthenticated] = React.useState(false);
    // アプリ（厳密にはこのフックを使っているコンポーネント）がマウントされた際に一度だけログイン済みか否かを確認
    React.useEffect( () => {
      getIsAuthenticated().then(auth => {
        // ログイン済みか否かの確認が終われば、それを state にセット
        setAuthenticated(auth);
        setLoading(false);
      });
    },[])
    return {
      isLoading,
      isAuthenticated,
      setAuthenticated,
    }
   }
   
/**
 * ログイン済みか否かで画面切替( Routerは、Dashboard内で利用しているのでここでは記載しない)
 * @return {JSX.Element}
 */
export default function AuthRouter(){
    const {isLoading, isAuthenticated, setAuthenticated} = useAuthChecker();
    // ログイン済みか否かを確認している間は具体的な画面を表示せず、ローディングのみを表示
    //if(isLoading){
    //  return (<div>通信中...</div>)
    //}
    console.log(`AuthRouter::isAuthenticated:${isAuthenticated}`)
    return (
      <React.Fragment>
      {
        (isAuthenticated) ? <Dashboard/> : <LoginPage isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />
      }
      </React.Fragment>
    )
}
   