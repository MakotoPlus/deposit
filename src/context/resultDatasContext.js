//
// Result Datas Context
//
//
import { createContext, useState, useContext } from 'react';

export const ResultDatasContext = createContext();

export function useResultDatasContext(){
    return useContext(ResultDatasContext);
}

export function ResultDatasProvider({children}){
    const [resultDatas, setResultDatas] = useState([]);
    const [resultSearch, setResultSearch] = useState({
        select_items : [],
        select_fromto_date : [null,null],
    });
    // 全データ件数
    const [resultAllCount, setResultAllCount] = useState({count: 0})
    const value ={
        resultDatas, setResultDatas,
        resultAllCount, setResultAllCount,
        resultSearch, setResultSearch,
    };
    return (
        <ResultDatasContext.Provider value={value}>
            {children}
        </ResultDatasContext.Provider>
    )
}