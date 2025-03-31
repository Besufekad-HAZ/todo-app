import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/store';

export function Toaster() {
  // Get the error state in a more reliable way
  const error = useAppSelector(
    (state) =>
      Object.values(state.api.queries).some((query) => query?.status === 'rejected') ||
      Object.values(state.api.mutations).some((mutation) => mutation?.status === 'rejected'),
  );

  useEffect(() => {
    if (error) {
      toast.error('Something went wrong');
    }
  }, [error]);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
