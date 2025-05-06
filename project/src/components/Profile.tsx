import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<{ email?: string; name?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          email: decoded.email || 'N/A',
          name: decoded.name || 'User',
        });
      } catch {
        setUser({});
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">User Profile</h1>
        <div className="text-left space-y-3 mb-6">
          <div>
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{user.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{user.email}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline text-red-600 border-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
