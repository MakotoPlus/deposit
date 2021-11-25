import * as React from 'react';
import DepositGroupSelect from '../DepositGroupSelect';
import DepositItemSelect from '../DepositItemSelect';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
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
    const [value, setValue] = React.useState([null, null]);
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
                        value={value}
                        inputFormat="yyyy/MM/dd"
                        onChange={(newValue) => {
                        setValue(newValue);
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
                <Button variant="outlined" color="primary" >
                    search
                </Button>
            </Box>
        </React.Fragment>
    );
}