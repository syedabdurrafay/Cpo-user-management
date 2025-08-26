import { useAuth } from '../../../context/AuthContext';

export default function ConstableDashboard() {
  const { user } = useAuth();

  return (
    <div className="ml-64 p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-police-blue text-white">
          <h1 className="text-2xl font-bold">
            Welcome, {user.name} ({user.id})
          </h1>
          <p className="mt-2">Current Assignment: {user.unit}</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Today's Duty</h3>
            {/* Duty information */}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">My Profile</h3>
            {/* Profile summary */}
          </div>
        </div>
      </div>
    </div>
  );
}