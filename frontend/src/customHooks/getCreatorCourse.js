import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorCourseData } from '../redux/courseSlice';

const useGetCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchCreatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true });
        console.log(result.data);
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCreatorCourses();
  }, [dispatch, userData]);
};

export default useGetCreatorCourse;
