import React, {useEffect} from 'react';
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
//import TextField from '@mui/material/TextField';
//import DateRangePicker from '@mui/lab/DateRangePicker';
import DatePickerYearMonth from '../common/DatePickerYearMonth';
//import AdapterDateFns from '@mui/lab/AdapterDateFns';
//import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import DepositItemMultiSelect from '../common/DepositItemMultiSelect';
//import Typography from '@mui/material/Typography';
//import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const prj_func = require('./../common/prj_func');


const useStyles = makeStyles((theme) => ({
    Box: {
        height: 85,
        display: "flex",
        border: "0px solid black",
        padding: 0,
    },
    ItemBox: {
        height: 85,
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
    deleteCheckBok : {
        color : "gray",
    },
    bottomLeftBox: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
}));


export default function ResultSearchForm(){
    const classes = useStyles();
    //const {user} = useUserContext();
    const [from_yyyymmdd, setFrom_yyyymmdd] = React.useState(null);
    const [to_yyyymmdd, setTo_yyyymmdd] = React.useState(null);

    const { setResultDatas, setResultSearch,} = useResultDatasContext();

    const [isDelete, setIsDelete] = React.useState(false);
    const handleClickSearch = () => {
        console.debug("Search");
        setResultSearch({
            select_items : userSelectItems,
            select_fromto_date : [
                prj_func.date2StringYyyymmdd(from_yyyymmdd, 1), 
                prj_func.date2StringYyyymmdd(to_yyyymmdd, 99)
            ],
            select_delete : isDelete,
        });    
    };
    const [userSelectItems, setUserSelectItems] = React.useState([]);

    const handleClickReset = () =>{
        console.debug("handleClickReset-----");
        setUserSelectItems([]);
        setIsDelete(false);
        // 日付がクリア出来ないため リセットを押してもクリアしないよう変更
        setResultSearch({
            select_items : userSelectItems,
            select_fromto_date : [
                prj_func.date2StringYyyymmdd(from_yyyymmdd, 1), 
                prj_func.date2StringYyyymmdd(to_yyyymmdd, 99)
                //prj_func.date2StringYyyymmdd(null, 1), 
                //prj_func.date2StringYyyymmdd(null, 99)
            ],
            select_delete : false,
        });    
        setFrom_yyyymmdd(from_yyyymmdd);
        setTo_yyyymmdd(to_yyyymmdd);
    }

    const handleClickIsDelete = event =>{
        setIsDelete(event.target.checked);
    }
    useEffect(()=>{
        console.debug("Data Clean-----");
        //この画面から実績画面へ移動すると1ページ目のオブジェクトが空になってしまう
        //仕方がないのでここで実績画面で監視しているオブジェクトを更新する
        setResultDatas([]);
    },[]);

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
                    <DepositItemMultiSelect 
                        userSelectItems={userSelectItems} 
                        setUserSelectItems={setUserSelectItems}
                        deposit_flag={true}
                    />
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
                    m={2} //margin
                    className={`${classes.Box} ${classes.ItemBox}`}
                    >
                    <FormControl component="fieldset">
                        <FormLabel component="legend"></FormLabel>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel 
                            value={isDelete}
                            control={<Checkbox color="primary" />}
                            label="Delete"
                            labelPlacement="top"
                            className={`${classes.deleteCheckBok}`}
                            onClick={handleClickIsDelete}
                            />                    
                        </FormGroup>
                    </FormControl>    
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
                    <Button variant="outlined" color="primary"  onClick={handleClickSearch}>
                        search
                    </Button>
                </Box>
        </React.Fragment>
    );
}