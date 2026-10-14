import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import BalanceCalculator from './routes/tools/balance.tsx';
import Splash from './components/global/splash.tsx';
import Courses from './routes/courses/courses.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BalanceCalculator />
  },
  {
    path: "/cursos",
    element: <Courses />
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