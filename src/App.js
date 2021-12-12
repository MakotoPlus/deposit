import {UserProvider} from './context/userContext';
import AuthRouter from './component/AuthRouter';

function App() {
  return (
    <UserProvider>
      <AuthRouter />
    </UserProvider>
  );
}
export default App;
