import { FiFile,FiImage,FiVideo,FiHeadphones,FiFileText } from 'react-icons/fi';
import PropTypes from 'prop-types';

const FileIcon = ({ filetype }) => {
  switch (filetype) {
    case 'image':
      return <FiImage className="text-blue-500" />;
    case 'video':
      return <FiVideo className="text-green-500" />;
    case 'audio':
      return <FiHeadphones className="text-purple-500" />;
    case 'pdf':
      return <FiFileText className="text-red-500" />;
    case 'document':
      return <FiFileText className="text-orange-500" />;
    default:
      return <FiFile className="text-gray-500" />;
  }
};
FileIcon.propTypes = {
  filetype: PropTypes.string.isRequired,
};

export default FileIcon;