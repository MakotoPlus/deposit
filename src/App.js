import {UserProvider} from './context/userContext';
import AuthRouter from './component/AuthRouter';
import {PlanProvider} from './context/planContext';

function App() {
  return (
    <UserProvider>
      <PlanProvider>
        <AuthRouter />
      </PlanProvider>
    </UserProvider>
  );
}
export default App;
