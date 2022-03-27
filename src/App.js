import React from 'react';
import {UserProvider} from './context/userContext';
import AuthRouter from './component/common/AuthRouter';
import {PlanProvider} from './context/planContext';
import {ResultDatasProvider} from './context/resultDatasContext';

function App() {
  return (
    <UserProvider>
      <PlanProvider>
        <ResultDatasProvider>
          <AuthRouter />
        </ResultDatasProvider>
      </PlanProvider>
    </UserProvider>
  );
}
export default App;
