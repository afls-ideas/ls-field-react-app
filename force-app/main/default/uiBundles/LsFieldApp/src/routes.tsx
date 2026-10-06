import type { RouteObject } from 'react-router';
import AppLayout from './appLayout';
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Samples from './pages/Samples';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: { showInNavigation: true, label: 'Dashboard' },
      },
      {
        path: 'calls',
        element: <Calls />,
        handle: { showInNavigation: true, label: 'Calls' },
      },
      {
        path: 'samples',
        element: <Samples />,
        handle: { showInNavigation: true, label: 'Samples' },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
