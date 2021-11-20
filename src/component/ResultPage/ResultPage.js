import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
//import ResultList from "./ResultFixedHeder";
//import FlexLayoutGrid from "./ResultDataGrid";
//import ResultList from "./ResultList_err";
import StickyHeadTable from "./ResultFixedHeder";
import ResultInputDialog from "./../ResultInputDialog";

function ResultPage(){
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
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 600,
                  }}
                >
              <ResultInputDialog subtitle="New Data"/>
              <StickyHeadTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResultPage;