import { motion } from 'framer-motion';
import { FaUserShield, FaUserCheck, FaUserClock, FaUserPlus } from 'react-icons/fa';

const stats = [
  { 
    title: "Total Personnel", 
    value: "1,842", 
    change: "+2.1%", 
    icon: <FaUserShield className="text-2xl text-policeGold" />,
    trend: "up"
  },
  { 
    title: "Active Duty", 
    value: "1,723", 
    change: "+5.3%", 
    icon: <FaUserCheck className="text-2xl text-green-400" />,
    trend: "up"
  },
  { 
    title: "On Leave", 
    value: "119", 
    change: "-1.2%", 
    icon: <FaUserClock className="text-2xl text-yellow-400" />,
    trend: "down"
  },
  { 
    title: "New Hires", 
    value: "24", 
    change: "+8.7%", 
    icon: <FaUserPlus className="text-2xl text-blue-400" />,
    trend: "up"
  }
];

export default function PersonnelStats() {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <h3 className="text-lg font-medium mb-6">Personnel Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-policeGold/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">{stat.title}</p>
                <p className="text-2xl font-light mt-1">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
            <p className={`mt-2 text-sm ${
              stat.trend === 'up' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}