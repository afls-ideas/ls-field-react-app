import { Navigate, type RouteObject } from 'react-router';
import AppLayout from './appLayout';
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Samples from './pages/Samples';
import Inventory from './pages/Inventory';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Calendar from './pages/Calendar';
import Inquiries from './pages/Inquiries';
import NewVisit from './pages/NewVisit';
import VisitDetail from './pages/VisitDetail';
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
        path: 'accounts',
        element: <Accounts />,
        handle: { showInNavigation: true, label: 'Accounts' },
      },
      { path: 'accounts/:accountId', element: <AccountDetail /> },
      {
        path: 'calendar',
        element: <Calendar />,
        handle: { showInNavigation: true, label: 'Calendar' },
      },
      { path: 'visits/new', element: <NewVisit /> },
      { path: 'visits/:visitId', element: <VisitDetail /> },
      {
        path: 'inquiries',
        element: <Inquiries />,
        handle: { showInNavigation: true, label: 'Inquiries' },
      },
      {
        path: 'visits',
        element: <Calls />,
        handle: { showInNavigation: true, label: 'Visits' },
      },
      { path: 'calls', element: <Navigate to="/visits" replace /> },
      {
        path: 'inventory',
        element: <Inventory />,
        handle: { showInNavigation: true, label: 'Inventory' },
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
