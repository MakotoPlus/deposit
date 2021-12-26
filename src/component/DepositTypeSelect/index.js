
import React from 'react';
//import Radio from '@material-ui/core/Radio';
//import RadioGroup from '@material-ui/core/RadioGroup';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
//import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TYPE_EXPENSES, TYPE_DEPOSIT } from '../prj_const';

/**
 * 貯金/支出 選択コントロール
 * 
 */
 const useStyles = makeStyles((theme) => ({
    root: {
        display: "inline-block",
    },
    radio:{
        margin: 10
    },
  }));
  
 const AntSwitch = withStyles((theme) => ({
   root: {
     width: 42,
     height: 26,
     padding: 0,
     margin: theme.spacing(1),
   },
   switchBase: {
    padding: 1,
    color: theme.palette.white,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#ff0000',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
   thumb: {
     width: 24,
     height: 24,
     boxShadow: 'none',
   },
   track: {
     border: `1px solid ${theme.palette.grey[500]}`,
     borderRadius: 26 / 2,
     opacity: 1,
     backgroundColor: '#52d869',
   },
   checked: {},
 }))(Switch);
 
 export default function CustomizedSwitches(props) {
   const handle = props.handle;
   const value = props.value;
   const classes = useStyles();
   const [state, setState] = React.useState({
     checkedC: (value === TYPE_DEPOSIT ) ? false : true });

   const handleChange = (event) => {
     setState({ ...state, [event.target.name]: event.target.checked });
     //console.log(event.target.checked);
     // event.target.checked = False (貯金) : True(支出)
     //setTypeValue( event.target.checked ? TYPE_EXPENSES : TYPE_DEPOSIT);
     handle(event.target.checked ? TYPE_EXPENSES : TYPE_DEPOSIT);
   };
 
   return (
    <div className={classes.root}>
        <FormGroup className={classes.radio}>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>貯金</Grid>
                <Grid item>
                    <AntSwitch checked={state.checkedC} onChange={handleChange} name="checkedC" />
                </Grid>
                <Grid item>支出</Grid>
                </Grid>
            </Typography>
        </FormGroup>
    </div>
   );
 }

 