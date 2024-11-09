import PropTypes from 'prop-types';
import spaceImage from "./space1.jpg"; // Importing the image file

const PageLayout = ({children}) => {
    return (
        <div 
            className="bg-cover bg-center min-h-screen items-center justify-center"
            style={{ backgroundImage: `url(${spaceImage})` }} // Using imported path
        >
            {children}
        </div>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageLayout;
