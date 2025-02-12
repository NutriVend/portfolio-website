import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function PrivateRoute({ children }) {
    const user = auth.currentUser;
    
    return user ? children : <Navigate to="/login" />;
} 