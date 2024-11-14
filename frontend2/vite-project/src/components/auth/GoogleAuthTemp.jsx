import { useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import SpaceRobot2 from "../SpaceRobot/SpaceRobot2";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../features/authSlice";
import { useDispatch } from "react-redux";

const GoogleAuthTemp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = JSON.parse(decodeURIComponent(urlParams.get('userData')));

        if (token && userData) {
            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Dispatch the token and user data to the Redux store
            dispatch(setAuth({ token, user: userData }));
        }

        const localToken = localStorage.getItem('token');

        if (localToken) {
            console.log("navigate to workspace also called");
            navigate('/workspace');
        } else {
            navigate('/auth/login');
        }
    }, [navigate, dispatch]);

    return (
        <PageLayout>
            <SpaceRobot2 top="40%" left="40%" delay={0.2} />
        </PageLayout>
    );
};

export default GoogleAuthTemp;
