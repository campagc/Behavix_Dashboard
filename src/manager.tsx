import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ViewCanteenDashboard from './manager/ViewCanteenDashboard';
import './index.css';

createRoot(document.getElementById('manager-root')!).render(
  <StrictMode>
    <ViewCanteenDashboard />
  </StrictMode>,
);
