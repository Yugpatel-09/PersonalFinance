import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/new" element={<AddTransaction />} />
        <Route path="transactions/edit/:id" element={<AddTransaction />} />
        <Route path="budget" element={<Budget />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
