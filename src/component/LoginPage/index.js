import React, { useState, useEffect }  from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from '../../dashboard/Dashboard';


import axios from 'axios';
const prj_const = require('../prj_const.js')



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        簡易貯金管理APL
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginPage(props) {
  const setAuthenticated = props.setAuthenticated;
  const isAuthenticated = props.isAuthenticated;
  const classes = useStyles();
  const [userid, setUserid] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  function handleSubmit(e){
    e.preventDefault();
    //console.log(`userid=${userid} password=${password}`);
    //fetchData();
    const body = {
        username : userid,
        password : password
    };
    axios.post(prj_const.ServerUrl + "/api-auth/", body).then((result) =>{
        console.log(result);
        console.log("login OK");
        console.log(`token=${result.data.token}`);
        setMessage("Success");
        setAuthenticated(true);
    }).catch((error)=>{
        console.error(error);
        setMessage(prj_const.MSG_ERROR_LOGIN_ERR)
    });
}
  const handleUseridChange = (event) =>{
    setUserid(event.target.value);
  }
  const handlePasswordChange = (event) =>{
    setPassword(event.target.value);
  }
  //
  // このLogin画面はAuthRouterで isAuthenticatedがFalseの場合のみ表示される
  // よってログインんが成功した場合はこの画面は表示されない?
  //
  return (
    (isAuthenticated) ?
    <Dashboard />
    :
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Typography component="h1" variant="h6" color="error" >
          {message}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userid"
            label="user id"
            name="userid"
            autoFocus
            onChange={handleUseridChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}