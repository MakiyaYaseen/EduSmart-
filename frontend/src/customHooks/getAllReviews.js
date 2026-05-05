import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReviewData } from "../redux/reviewSlice";
import { serverUrl } from "../constants";

const useGetAllReviews = (courseId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = (courseId && courseId !== "undefined")
          ? `${serverUrl}/api/review/getreview/${courseId}`
          : `${serverUrl}/api/review/getreview`;

        const response = await axios.get(url, { withCredentials: true });

        if (response.data.success) {
          dispatch(setReviewData(response.data.reviews));
        }
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [courseId, dispatch]);
};
export default useGetAllReviews;  