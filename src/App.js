//import logo from './logo.svg';
//import './App.css';
import React from 'react';
//import Button from '@material-ui/core/Button';
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Dashboard from './dashboard/Dashboard';
//import PlanPage from './component/PlanPage/PlanPage';
import Singin from './component/SingIn';

function App() {
  return (
    <React.Fragment>
      <Singin />
    </React.Fragment>
  );
}

/*
  <Router>
    <Routes>
      <Route exact path="/" element={<Dashboard/>}/>
      <Route exact path="/plan" element={<PlanPage/>}/>
    </Routes>
  </Router>
    <React.Fragment>
      <Dashboard />
    </React.Fragment>

*/
/*
<Button variant="contained" color="primary">
  Hello World
</Button>
*/

export default App;
