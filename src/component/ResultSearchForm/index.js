import * as React from 'react';
import DepositGroupSelect from '../DepositGroupSelect';
import DepositItemSelect from '../DepositItemSelect';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
//import Typography from '@mui/material/Typography';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    Box: {
        height: 60,
        display: "flex",
        border: "0px solid black",
        padding: 8
    },
    bottomLeftBox: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    }
}));

export default function ResultSearchForm(){
    const classes = useStyles();
    const {user} = useUserContext();
    const {resultDatas, setResultDatas, 
        resultAllCount, setResultAllCount,
        resultSearch, setResultSearch,
    } = useResultDatasContext();
    const [fromtoDatevalue, setFromtoDateValue] = React.useState([null, null]);
    const handleClickSearch = () => {
        console.debug("Search");
        console.debug("fromtoDatevalue");
        console.debug(fromtoDatevalue);
    };
    
    return (
        <React.Fragment>
            <Box
                component="span"
                m={2} //margin
                className={`${classes.Box} ${classes.buttonBox}`}
                >        
                <DepositGroupSelect />
                <DepositItemSelect />
                <LocalizationProvider dateAdapter={AdapterDateFns} > 
                    <DateRangePicker
                        startText="日付 FROM"
                        endText="日付 TO"
                        value={fromtoDatevalue}
                        inputFormat="yyyy/MM/dd"
                        onChange={(newDateValue) => {
                        setFromtoDateValue(newDateValue);
                        }}
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
                m={0} //margin
                className={`${classes.Box} ${classes.bottomLeftBox}`}
                >        
                <Button variant="outlined" color="primary"  onClick={handleClickSearch}>
                    search
                </Button>
            </Box>
        </React.Fragment>
    );
}