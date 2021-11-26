import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './../../dashboard/Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('21/1/1', 0),
  createData('21/2/1', 300),
  createData('21/3/1', 600),
  createData('21/4/1', 1800),
  createData('21/5/1', 1500),
  createData('21/6/1', 2000),
  createData('21/7/1', 2400),
  createData('21/8/1', 2400),
  createData('21/9/1', 2400),
  createData('21/10/1', 2400),
  createData('21/11/1', undefined),
];

export default function GraphResult() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>実績</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
