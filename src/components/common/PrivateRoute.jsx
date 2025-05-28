import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';


export const PrivateRoute = observer(({ children }) => {
  return authStore.token ? children : <Navigate to="/login" />;
});

