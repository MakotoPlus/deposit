import * as React from 'react';
//import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
//import { styled, createTheme } from '@mui/material/styles';
//import CssBaseline from '@mui/material/CssBaseline';
//import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
//import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
//import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
//import Divider from '@mui/material/Divider';
//import IconButton from '@mui/material/IconButton';
//import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
//import MenuIcon from '@mui/icons-material/Menu';
//import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
//import NotificationsIcon from '@mui/icons-material/Notifications';
//import { mainListItems } from '../dashboard/listItems';
import { Link as RouterLink } from "react-router-dom";
import Chart from '../dashboard/Chart';
import Deposits from '../dashboard/Deposits';
import Orders from '../dashboard/Orders';
import Results from '../dashboard/Results';
import AssetsTotalGraph from '../dashboard/AssetsTotalGraph';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://yahoo.co.jp/">
        Makoto
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


//const mdTheme = createTheme();

function MainPage() {
  //const [open, setOpen] = React.useState(true);
  //const toggleDrawer = () => {
  //  setOpen(!open);
  //};

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* 資産グラフ */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: 400,
            }}>
              <Link component={RouterLink} color="primary" to="/assets" >
                資産情報
              </Link>
              <AssetsTotalGraph />
            </Paper>
          </Grid>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
            <Chart />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 120,
              }}
            >
              <Deposits />
            </Paper>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 120,
              }}
            >
              <Results />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} color="primary" to="/result" >
                貯金実績
              </Link>
              <Orders />
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}


export default MainPage;