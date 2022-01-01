//import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
//import { withStyles, makeStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
      display: "inline-block",
  },
}));

export default function DatePicker01(props) {
  // The first commit of Material-UI
  console.debug("DatePicker01");
  console.debug(`yyyymmdd=${props.yyyymmdd}`);
  console.debug(props);
  const [labelName, ] = React.useState(props.labelName);
  const [selectedDate, setSelectedDate] = React.useState(props.yyyymmdd);
  const classes = useStyles();
  const handleDateChange = (dt) => {
    setSelectedDate(dt);
    let LocalDate = dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDate()).slice(-2);
    props.setYyyymmdd(LocalDate);
  };

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="start">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={labelName}
            format="yyyy/MM/dd"
            mask={"____/__/__"}   
            value={selectedDate}
            onChange={handleDateChange}
            disableMaskedInput={true} 
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}
