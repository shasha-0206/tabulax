import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold shadow-inner">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Welcome, {user.name || 'User'}!
        </h1>

        <div className="text-left space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-700">
            <UserCircleIcon className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Name</div>
              <div className="text-gray-900">{user.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <EnvelopeIcon className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-gray-900">{user.email}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 transition rounded-lg"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
