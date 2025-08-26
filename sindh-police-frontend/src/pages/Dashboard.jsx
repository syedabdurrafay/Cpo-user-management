import { useAuth } from '../context/AuthContext';
import PersonnelStats from '../components/PersonnelStats';
import RankDistribution from '../components/RankDistribution';
import PersonnelTable from '../components/PersonnelTable'; // Missing import added

const Dashboard = () => {
  const { user } = useAuth();

  // Add null check for user to prevent errors during loading
  if (!user) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Role-Specific Greeting */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover-3d">
        <h1 className="text-2xl font-light">
          Welcome, <span className="font-bold text-policeGold">{user.rank} {user.name}</span>
        </h1>
        <p className="text-white/60 mt-2">
          {user.accessLevel === 'ig' 
            ? "You have full administrative privileges" 
            : user.accessLevel === 'constable' 
              ? "You can view and edit your profile" 
              : "You can manage subordinates in your jurisdiction"}
        </p>
      </div>

      {/* IG-Specific Analytics */}
      {user.accessLevel === 'ig' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonnelStats />
          <RankDistribution />
        </div>
      )}

      {/* Personnel Management Section */}
      <PersonnelTable accessLevel={user.accessLevel} currentUserId={user.id} />
    </div>
  );
};

export default Dashboard; // Added default export