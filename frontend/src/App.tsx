import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import BalanceCalculator from './routes/tools/balance.tsx';
import Splash from './components/global/splash.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BalanceCalculator />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Splash />
    </>
  );
}

export default App;