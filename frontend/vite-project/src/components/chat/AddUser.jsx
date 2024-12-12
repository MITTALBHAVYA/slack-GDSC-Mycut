import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChannelMembers, addChannelMembers } from '../../features/channelSlice';
import { useParams } from 'react-router-dom';

const AddUser = () => {
    const [showModal, setShowModal] = useState(false);
    const [emails, setEmails] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { workspaceId, channelId } = useParams();

    const handleAddEmail = () => {
        if (emailInput.trim() === '') {
            setError('Email cannot be empty!');
            return;
        }
        setEmails([...emails, emailInput.trim()]);
        setEmailInput('');
        setError('');
    };

    const handleRemoveEmail = (email) => {
        setEmails(emails.filter((e) => e !== email));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!emails || emails.length === undefined) {
          setError('Unexpected error with emails!');
          return;
        }
      
        if (emails.length === 0) {
          setError('Emails are required!');
          return;
        }
      
        setIsLoading(true);
        setError('');
        try {
          console.log('Submitting emails:', emails);
          await dispatch(addChannelMembers({ workspaceId, channelId, emails })).unwrap();
          dispatch(fetchChannelMembers({ workspaceId, channelId }));
          setEmails([]);
          setShowModal(false);
        } catch (err) {
          console.error(err);
          setError(err.message || 'Failed to add members');
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-[#374151] hover:bg-[#6b7280] text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
                Add Members
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-gray-900 text-white rounded-lg shadow-xl w-96 p-6">
                        {/* Modal Title */}
                        <h2 className="text-lg font-semibold mb-4 text-gray-100">Add Members</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Email Input Section */}
                            <div className="mb-4">
                                <label
                                    htmlFor="emailInput"
                                    className="block text-sm font-medium text-gray-200 mb-2"
                                >
                                    Enter Email
                                </label>
                                <input
                                    type="email"
                                    id="emailInput"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddEmail}
                                    className="mt-2 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-sm text-white rounded-md transition duration-200"
                                >
                                    Add Email
                                </button>
                            </div>

                            {/* List of Added Emails */}
                            {emails.length > 0 && (
                                <ul className="mb-4">
                                    {emails.map((email, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between text-sm text-gray-300 py-1"
                                        >
                                            <span>{email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEmail(email)}
                                                className="text-red-500 hover:text-red-700 text-sm transition duration-200"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Error Message */}
                            {error && (
                                <p className="text-sm text-red-400 mb-4">{error}</p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 rounded-md transition duration-200"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-sm text-white rounded-md transition duration-200 ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddUser;
