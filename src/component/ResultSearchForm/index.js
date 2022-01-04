import React, {useEffect} from 'react';
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import DepositItemMultiSelect from '../DepositItemMultiSelect';
//import Typography from '@mui/material/Typography';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
    const [fromtoDatevalue, setFromtoDateValue] = React.useState([null, null]);
    const {resultDatas, setResultDatas, 
        resultAllCount, setResultAllCount,
        resultSearch, setResultSearch,} = useResultDatasContext();  
    const [isDelete, setIsDelete] = React.useState(false);
    const handleClickSearch = () => {
        console.debug("Search");
        console.debug("fromtoDatevalue");
        console.debug(fromtoDatevalue);
        console.debug("userSelectItems");
        console.debug(userSelectItems);

        function changeString(dt){
            console.debug(`changeString=${dt}`);
            //let dt = Date(value);
            return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDate()).slice(-2);
        }
        let fromDate = "";
        let toDate = "";
        if (fromtoDatevalue[0]){
            fromDate = changeString(fromtoDatevalue[0]); 
        }
        if (fromtoDatevalue[1]){
            toDate = changeString(fromtoDatevalue[1]); 
        }

        setResultSearch({
            select_items : userSelectItems,
            select_fromto_date : [fromDate, toDate],
            select_delete : isDelete,
        });    
    };
    const [userSelectItems, setUserSelectItems] = React.useState([]);

    const handleClickReset = () =>{
        setFromtoDateValue([null,null]);
        setUserSelectItems([]);
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
                    <DepositItemMultiSelect userSelectItems={userSelectItems} setUserSelectItems={setUserSelectItems}/>
                </Box>
                <Box
                component="span"
                m={0} //margin
                className={`${classes.Box} ${classes.DateBox}`}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns} > 
                        <DateRangePicker
                            startText="日付 FROM"
                            endText="日付 TO"
                            value={fromtoDatevalue}
                            inputFormat="yyyy/MM/dd"
                            mask={"____/__/__"}
                            onChange={(value) => setFromtoDateValue(value)}
                            renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                            )}
                        />
                    </LocalizationProvider>
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