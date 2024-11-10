import { useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import SpaceRobot2 from "../SpaceRobot/SpaceRobot2";
import { useNavigate } from "react-router-dom";

const GoogleAuthTemp = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
        }

        const localtoken = localStorage.getItem('token');

        if(localtoken){
            navigate('/workspace');
        }
        else{
            navigate('/auth/login');
        }
    }, [navigate]);

    return (
        <PageLayout>
            <SpaceRobot2 top="40%" left="40%" delay={0.2} />
        </PageLayout>
    );
};

export default GoogleAuthTemp;
