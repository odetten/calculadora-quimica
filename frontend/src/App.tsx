import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import BalanceCalculator from './routes/tools/balance.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BalanceCalculator />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;