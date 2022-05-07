//
// Result Datas Context
//
//
import React,{ createContext, useState, useContext } from 'react';

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
    var startdt = new Date();
    startdt.setMonth(0);
    startdt.setDate(1);
    startdt.setFullYear(startdt.getFullYear()-1);
    var enddt = new Date();
    enddt.setMonth(11);
    enddt.setDate(31);

    // Graph表示選択情報
    const [graphSearch, setGraphSearch] = useState({
        select_items : [],
        select_fromto_date : [startdt, enddt],
    });
    // Graph表示結果情報
    const [graphDatas, setGraphDatas] = useState([]);

    // 全データ件数
    const [resultAllCount, setResultAllCount] = useState({count: 0})
    // グループサマリーデータ
    const [groupSumaryDatas, setGroupSumaryDatas] = useState([]);

    const value ={
        resultDatas, setResultDatas,
        resultAllCount, setResultAllCount,
        resultSearch, setResultSearch,
        groupSumaryDatas, setGroupSumaryDatas,
        graphSearch, setGraphSearch,
        graphDatas, setGraphDatas
    };
    return (
        <ResultDatasContext.Provider value={value}>
            {children}
        </ResultDatasContext.Provider>
    )
}