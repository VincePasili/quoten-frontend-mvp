// src/App.js

import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './providers/AuthProvider';
import { QueryProvider } from './providers/QueryProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MainLayout from './pages/MainLayout';
import { AlertProvider } from './providers/AlertProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import LegalDocument from './pages/LegalDocuments';

function App() {
  return (
    <Router>
     <QueryProvider>
       <AlertProvider>
        <NotificationProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <Routes>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/legal" element={<LegalDocument/>}/>
                  <Route path="/forgot-password" element={<ForgotPassword/>}/>
                  <Route path="/reset-password" element={<ResetPassword/>}/>

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Dashboard"/>
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/projects"
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Projects"/>
                      </ProtectedRoute>
                    }
                  />  
  
                  <Route
                    path='/team'
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Team"/>
                      </ProtectedRoute>
                    }
                  />  
  
                  <Route
                    path='/quotes'
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Quotes"/>
                      </ProtectedRoute>
                    }
                  />  
  
                  <Route
                    path='/resources'
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Resources"/>
                      </ProtectedRoute>
                    }
                  />  

                  <Route
                    path='/subscriptions'
                    element={
                      <ProtectedRoute>
                        <MainLayout activeComponent="Subscriptions"/>
                      </ProtectedRoute>
                    }
                  />  

                </Routes>
            </GoogleOAuthProvider> 
          </AuthProvider>
        </NotificationProvider>
      </AlertProvider>
    </QueryProvider>
  </Router>
  );
}

export default App;
