import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BlacklistPage from './pages/BlacklistPage';
import ClientsPage from './pages/ClientsPage';
import TransactionsPage from './pages/TransactionsPage';
import ImportPage from './pages/ImportPage';
import UsersPage from './pages/UsersPage';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
    const {isAuthenticated} = useAuth();

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard"/> : <LoginPage/>
            }/>
            <Route path="/dashboard" element={
                <PrivateRoute><AppLayout><DashboardPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="/blacklist" element={
                <PrivateRoute><AppLayout><BlacklistPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="/clients" element={
                <PrivateRoute roles={['ADMIN', 'OPERATOR']}><AppLayout><ClientsPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="/transactions" element={
                <PrivateRoute><AppLayout><TransactionsPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="/import" element={
                <PrivateRoute roles={['ADMIN']}><AppLayout><ImportPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="/users" element={
                <PrivateRoute roles={['ADMIN']}><AppLayout><UsersPage/></AppLayout></PrivateRoute>
            }/>
            <Route path="*" element={<Navigate to="/dashboard"/>}/>
        </Routes>
    );
}