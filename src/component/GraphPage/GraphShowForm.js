import * as React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import DepositItemMultiSelect from '../DepositItemMultiSelect';
//import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import Button from '@material-ui/core/Button';

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
    const classes = useStyles();
    //const {user} = useUserContext();
    const {setGraphSearch} = useResultDatasContext();
    const [userSelectItems, setUserSelectItems] = React.useState([]);
    const handleClickShow = () => {
        console.debug("handleClickShow");
        console.debug("userSelectItems");
        console.debug(userSelectItems);        
        setGraphSearch({
            select_items : userSelectItems,
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