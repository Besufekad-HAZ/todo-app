import { useEffect } from 'react';
import { useAppSelector } from '../../store/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toaster() {
  const error = useAppSelector((state) => state.api.queries['getTasksByCollection']?.error);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load tasks');
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
