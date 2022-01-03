import React from "react";
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ItemSumary from "./ItemSumary";
import GroupSumary from "./GroupSumary";
import Total from "./Total";
import CalcDialog from "./CalcDialog";

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
  TotalBox:{
    height: 180,
    display: "flex",
    border: "0px solid black",
    padding: 0,
  },
  CalcDialogBox:{
    height: 30,
    display: "flex",
    border: "0px solid black",
    padding: 0,
  },
  Dialog:{
    padding: 0,
    m: 0
  }
}));


function SumaryPage(){
  const classes = useStyles();
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container maxWidth="100%" sx={{ mt: 2, mb: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
              }}
              >
              <Box
                  component="span"
                  m={0} //margin
                  className={`${classes.TotalBox} `}
                  >
                <Total />
              </Box>
              <Box
                  component="span"
                  m={0} //margin
                  className={`${classes.CalcDialogBox} `}
                  >
                  <CalcDialog/>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: 300,
              }}
              >
              <GroupSumary />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="100%" sx={{ mt: 2, mb: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 430,
                  }}
                >
              <ItemSumary />              
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default SumaryPage;