import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import { useAuth } from './pages/AuthContext';
import RegisterMsg from './pages/registermsg';
import TermsAndConditions from './pages/TermsAndConditions';
import NewslatterRegistration from './pages/NewslatterRegistration';
import NewsletterManagement from './pages/NewsletterManagement';
import NewsletterTemplates from './pages/NewsletterTemplates';

function App() {
  const { authenticated } = useAuth();
 
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/add-patient" element={authenticated ? <AddPatient /> : <Navigate to="/" />} />
        <Route path="/edit-patient/:id" element={authenticated ? <EditPatient /> : <Navigate to="/" />} /> */}
        <Route path="/newsletter-management" element={authenticated ? <NewsletterManagement /> : <Navigate to="/" />} />
        <Route path="/newsletter-templates" element={authenticated ? <NewsletterTemplates /> : <Navigate to="/" />} />
        {/* <Route path="/registermsg" element={<RegisterMsg />} /> */}
        {/* <Route path="/terms" element={<TermsAndConditions />} /> */}
        <Route path="/newslatter-registration" element={<NewslatterRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
