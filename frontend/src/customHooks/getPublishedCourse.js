import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../constants';
import { setCourseData } from '../redux/courseSlice';

const useGetPublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublished", { withCredentials: true });
        dispatch(setCourseData(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCourseData();
  }, [dispatch]);
};

export default useGetPublishedCourse;
