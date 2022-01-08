import * as React from 'react';
import Link from '@mui/material/Link';
//import Typography from '@mui/material/Typography';
import { Link as RouterLink } from "react-router-dom";
import Total from '../component/SumaryPage/Total';

//function preventDefault(event) {
//  event.preventDefault();
//}

export default function Results() {
  return (
    <React.Fragment>
      <Total />
      <div>
        <Link component={RouterLink} color="primary" to="/sumary" >
          サマリ
        </Link>
      </div>
    </React.Fragment>
  );
}

