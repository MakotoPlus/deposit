import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PlanFixedHeader from "./PlanTable";
import PlanInputDialog from "./../PlanInputDialog";
import PlanGroupSumary from "./PlanGroupSumary";
import PlanTotal from "./PlanTotal";

function PlanPage(){
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
      <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}>
        <Grid container spacing={1}>
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
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 300,
              }}
            >
              <PlanTotal />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
              <PlanInputDialog subtitle="New Data"/>
              <PlanFixedHeader />              
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default PlanPage;