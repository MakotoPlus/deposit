//
// Plan Data Context
//
//
import { createContext, useState, useContext } from 'react';
//const prj_const = require('./../component/prj_const.js')

export const PlanContext = createContext();

export function usePlanContext(){
    return useContext(PlanContext);
}

export function PlanProvider({children}){
    const [plan, setPlan] = useState([])
    // 全データ件数
    const [planAllCount, setPlanAllCount] = useState({count: 0})
    const value ={
        plan, setPlan,
        planAllCount, setPlanAllCount
    }
    return (
        <PlanContext.Provider value={value}>
            {children}
        </PlanContext.Provider>
    )
}