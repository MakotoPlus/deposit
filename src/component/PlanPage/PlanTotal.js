import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function preventDefault(event) {
  event.preventDefault();
}

export default function PlanTotal() {
  return (
    <React.Fragment>
      <Typography color="text.secondary" >
        総額預金額
      </Typography>
      <Typography component="p" variant="h4">
        ￥123,024
      </Typography>
    </React.Fragment>
  );
}
