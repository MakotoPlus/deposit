import React from "react";
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PlanTable from "./PlanTable";
import PlanInputDialog from "./PlanInputDialog";
import PlanGroupSumary from "./PlanGroupSumary";
import PlanTotal from "./PlanTotal";
import PlanBatchInputDialog from "./PlanBatchInputDialog";

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
  Dialog:{
    padding: 0,
    m: 0
  }
}));


function PlanPage(){
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
              <PlanTotal />
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
              <PlanGroupSumary />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="100%" sx={{ mt: 2, mb: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 430,
                  }}
                >
                <Box
                    component="span"
                    m={0} //margin
                    className={`${classes.Box} ${classes.ItemBox}`}
                    >
                  <PlanInputDialog subtitle="New Data" className={`${classes.Dialog}`}/>
                  <PlanBatchInputDialog subtitle="Batch" className={`${classes.Dialog}`} />
                </Box>
              <PlanTable />              
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default PlanPage;