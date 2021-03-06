import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
//import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from "react-router-dom";

export const mainListItems = (
  <List component="nav">
    <Link to="/">
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    </Link>
    <Link to="/plan">
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="貯金計画" />
      </ListItem>
    </Link>
    <Link to="/result">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="貯金実績" />
      </ListItem>
    </Link>
    <Link to="/sumary">
      <ListItem button>
        <ListItemIcon>
          <SummarizeIcon />
        </ListItemIcon>
        <ListItemText primary="貯金サマリ" />
      </ListItem>
    </Link>
    <Link to="/graph">
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="貯金Graph" />
      </ListItem>
    </Link>
  </List>
);

/**
 * 削除
 *  
 * 
 * */
export const secondaryListItems = (
  <div>
    <ListSubheader inset>Assets Page</ListSubheader>
    <Link to="/assets">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="資産情報" />
      </ListItem>
    </Link>
  </div>
);
/*
<div>
<ListSubheader inset>Saved reports</ListSubheader>
<ListItem button>
  <ListItemIcon>
    <AssignmentIcon />
  </ListItemIcon>
  <ListItemText primary="Current month" />
</ListItem>
<ListItem button>
  <ListItemIcon>
    <AssignmentIcon />
  </ListItemIcon>
  <ListItemText primary="Last quarter" />
</ListItem>
<ListItem button>
  <ListItemIcon>
    <AssignmentIcon />
  </ListItemIcon>
  <ListItemText primary="Year-end sale" />
</ListItem>
</div>
*/