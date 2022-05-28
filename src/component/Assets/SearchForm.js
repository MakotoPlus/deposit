import React from 'react';
import DatePickerYearMonth from '../common/DatePickerYearMonth';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import {useResultDatasContext} from '../../context/resultDatasContext';
import Button from '@material-ui/core/Button';
import {date2StringYyyymmdd} from '../common/prj_func';

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


export default function SearchForm(){
    const classes = useStyles();
    const [from_yyyymmdd, setFrom_yyyymmdd] = React.useState(null);
    const [to_yyyymmdd, setTo_yyyymmdd] = React.useState(null);
    const {assetSearch, setAssetSearch} = useResultDatasContext();
    const handleClickSearch = () => {
        console.debug("Search");
        setAssetSearch({
            select_fromto_date : [
                date2StringYyyymmdd(from_yyyymmdd, 1), 
                date2StringYyyymmdd(to_yyyymmdd, 99)
            ],
        });    
    };
    const handleClickReset = () =>{
        // クリアしたい・・
        setFrom_yyyymmdd(null);
        setTo_yyyymmdd(null);
        console.debug("handleClickReset-----");
        setAssetSearch({
            select_fromto_date : [
                undefined, 
                undefined
            ]}
        )
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
                    <Button variant="outlined" color="primary"  onClick={handleClickSearch}>
                        search
                    </Button>
            </Box>
            </Box>
        </React.Fragment>
    );
}