import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import PublicRoute from './components/publicRoute/PublicRoute';
import ApplyDoctor from './pages//admin/applyDoctor/ApplyDoctor';
import Notifications from './pages/notifications/Notifications';
import UsersList from './pages/admin/usersList/UsersList';
import DoctorsList from './pages/admin/doctorsList/DoctorsList';
import DoctorProfile from './pages/doctor/DoctorProfile';
import BookAppointment from './pages/bookAppointment/BookAppointment';
import Appointments from './pages/appointments/Appointments';
import DoctorAppointments from './pages/doctor/doctorAppointments/DoctorAppointments';
import AppointmentPage from './pages/doctor/appointmentPage/AppointmentPage';
import Recipes from './pages/recipes/Recipes';

function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/apply-doctor' element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
        <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path='/recipes' element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path='/admin/doctors' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path='/doctor/profile/:userId' element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
        <Route path='/book-appointment/:doctorId' element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
        <Route path='/appointments' element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path='/doctor/appointments' element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
        <Route path='/doctor/appointments/detail-info/:appointmentId' element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
