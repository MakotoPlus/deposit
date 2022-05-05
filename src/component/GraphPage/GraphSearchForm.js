import * as React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import DepositItemMultiSelect from '../common/DepositItemMultiSelect';
//import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import DateRangePicker from '@mui/lab/DateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '@material-ui/core/Button';
import TextField from '@mui/material/TextField';

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
    //const {user} = useUserContext();
    const {setGraphSearch} = useResultDatasContext();
    const [fromtoDatevalue, setFromtoDateValue] = React.useState([startdt, enddt]);
    const [userSelectItems, setUserSelectItems] = React.useState([]);
    const handleClickShow = () => {
        console.debug("handleClickShow");
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

        setGraphSearch({
            select_items : userSelectItems,
            select_fromto_date : [fromDate, toDate],
        });    
    };

    const handleClickReset = () =>{
    console.debug("setGraphSearch");
        setUserSelectItems([]);
        setGraphSearch({select_items : []});
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