// NotFound.jsx
const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>
        <a href="/workspaces" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Go to Workspaces
        </a>
      </div>
    </div>
  );
};

export default NotFound;
