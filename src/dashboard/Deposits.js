import * as React from 'react';
import Link from '@mui/material/Link';
//import Typography from '@mui/material/Typography';
import PlanTotal from "../component/PlanPage/PlanTotal";
import { Link as RouterLink } from "react-router-dom";

//function preventDefault(event) {
//  event.preventDefault();
//}

export default function Deposits() {
  return (
    <React.Fragment>
      <PlanTotal />
      <div>
        <Link component={RouterLink} color="primary" to="/plan" >
          計画
        </Link>
      </div>
    </React.Fragment>
  );
}

