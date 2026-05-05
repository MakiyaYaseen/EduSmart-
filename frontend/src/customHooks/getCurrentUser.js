import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../constants';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  return loading; // return loading state
};

export default useGetCurrentUser;
