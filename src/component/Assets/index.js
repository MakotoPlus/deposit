import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AssetsTable from "./AssetsTable";
import InputDialog from "./InputDialog";
import SearchForm from "./SearchForm";
import AssetsGraph from "./AssetsGraph";

/*
* 資産登録ページ
* 
*
*/
function Index(){
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
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 100,
                  }}
                >
              <SearchForm />
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
                    height: 530,
                  }}
                >
              <InputDialog subtitle="New Data"/>
              <AssetsTable />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 600,
                  }}
                >
              <AssetsGraph />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Index;