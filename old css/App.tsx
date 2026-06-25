import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CreditsProvider } from './contexts/CreditsContext';
import { AuthProvider } from './contexts/AuthContext';


import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LoggedInHome from './pages/LoggedInHome';
import Design from './pages/Design';
import GeneratedPage from './pages/GeneratedPage';
import ModifyPage from './pages/ModifyPage';
import Profile from './pages/Profile';
import BuyCredits from './pages/BuyCredits';
import PrivateRoute from './routes/PrivateRoute';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';





const App: React.FC = () => {



  return (
    <Router>

      <AuthProvider>
        <CreditsProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />



              
              <Route path="/logged-in-home"   element={
                <PrivateRoute>
                  <LoggedInHome />
                </PrivateRoute>}/>
              <Route path="/design"   element={
                <PrivateRoute>
                  <Design />
                </PrivateRoute>
              }/>
              <Route path="/generated/:planId"   element={
                <PrivateRoute>
                  <GeneratedPage />
                </PrivateRoute>
              } />
              <Route path="/modify/:planId"  element={
                <PrivateRoute>
                  <ModifyPage />
                </PrivateRoute>
              } />
              <Route path="/profile"   element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }/>
              <Route path="/buy-credits"  element={
                <PrivateRoute>
                  <BuyCredits />
                </PrivateRoute>
              }/>

              

            </Routes>
        </CreditsProvider>
      </AuthProvider>
    </Router>

  );
};

export default App;