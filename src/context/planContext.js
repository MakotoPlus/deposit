//
// Plan Data Context
//
//
import React from 'react'
import { createContext, useState, useContext } from 'react';

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
        planAllCount, setPlanAllCount,
    }
    return (
        <PlanContext.Provider value={value}>
            {children}
        </PlanContext.Provider>
    )
}