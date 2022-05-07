import * as React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import DepositItemMultiSelect from '../common/DepositItemMultiSelect';
//import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
//import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '@material-ui/core/Button';
import DatePickerYearMonth from '../common/DatePickerYearMonth';
const prj_func = require('./../common/prj_func');

const useStyles = makeStyles((theme) => ({
    Box: {
        height: 65,
        display: "flex",
        border: "0px solid black",
        padding: 0,
    },
    ItemBox: {
        height: 65,
        display: "flex",
        border: "0px solid black",
        padding: 0,
    },
    DateBox: {
        height: 85,
        display: "flex",
        border: "0px solid black",
        padding: 20,
    },
    SearchBox: {
        height: 85,
        display: "flex",
        border: "0px solid black",
        padding: 20
    },
    bottomLeftBox: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
}));


export default function GraphSearchForm(){

    var startdt = new Date();
    startdt.setMonth(0);
    startdt.setDate(1);
    startdt.setFullYear(startdt.getFullYear()-1);
    var enddt = new Date();
    enddt.setMonth(11);
    enddt.setDate(31);

    const classes = useStyles();
    const {setGraphSearch} = useResultDatasContext();
    const [from_yyyymmdd, setFrom_yyyymmdd] = React.useState(startdt);
    const [to_yyyymmdd, setTo_yyyymmdd] = React.useState(enddt);

    const [userSelectItems, setUserSelectItems] = React.useState([]);
    const handleClickShow = () => {
        console.debug("handleClickShow");
        console.debug(userSelectItems); 
        let setObj = {
            select_items : userSelectItems,
            select_fromto_date : [
                from_yyyymmdd, 
                to_yyyymmdd,
            ],
        };
        setGraphSearch(setObj);
    };


    const handleClickReset = () =>{
        // 日付が空白にならないため削除しない。
        console.debug("handleClickReset");
        console.debug(from_yyyymmdd);
        console.debug(to_yyyymmdd);
        setUserSelectItems([]);
        setGraphSearch({
            select_items : [],
            select_fromto_date : [from_yyyymmdd, to_yyyymmdd]
        });
        //setFrom_yyyymmdd(undefined);
        //setTo_yyyymmdd(undefined);
    }


    return (
        <React.Fragment>
            <Box
                component="span"
                m={0} //margin
                className={`${classes.Box} ${classes.buttonBox} `}
                >
                <Box
                    component="span"
                    m={0} //margin
                    className={`${classes.Box} ${classes.ItemBox}`}
                    >
                    <DepositItemMultiSelect userSelectItems={userSelectItems} setUserSelectItems={setUserSelectItems}/>
                </Box>
                <Box
                component="span"
                m={0} //margin
                className={`${classes.Box} ${classes.DateBox}`}
                >
                    <Box sx={{ m: -2, width: '30ch' }}>
                        <DatePickerYearMonth labelName={"From"} yyyymmdd={from_yyyymmdd} setYyyymmdd={setFrom_yyyymmdd} />
                    </Box>
                    <Box sx={{ m: -2, width: '30ch' }}>
                        <DatePickerYearMonth labelName={"To"} yyyymmdd={to_yyyymmdd} setYyyymmdd={setTo_yyyymmdd} />
                    </Box>
                </Box>
                <Box
                  component="span"
                  m={0} //margin
                  className={`${classes.SearchBox} ${classes.bottomLeftBox}`}
                  >       
                    <Button variant="outlined" color="primary"  onClick={handleClickReset}>
                        Reset
                    </Button>
                    <Button variant="outlined" color="primary"  onClick={handleClickShow}>
                        Show
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}
