import { FiClock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import styles from './RecentActivities.module.css';

const RecentActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // ✅ FIXED: removed duplicate /api
        const response = await API.get('/activities');

        const activitiesData = response.data.activities || response.data.data?.activities || [];

        const formattedActivities = activitiesData.map(activity => ({
          id: activity._id,
          action: activity.action,
          time: new Date(activity.timestamp).toLocaleTimeString(),
          officer: activity.userId?.fullName || 'System',
          timestamp: activity.timestamp,
          entityType: activity.entityType || 'System'
        }));

        setActivities(formattedActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className={styles.activitiesCard}>
        <h2 className={styles.activitiesTitle}>Recent Activities</h2>
        <div className={styles.loading}>Loading activities...</div>
      </div>
    );
  }

  return (
    <div className={styles.activitiesCard}>
      <h2 className={styles.activitiesTitle}>Recent Activities</h2>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.activitiesList}>
        {activities.length > 0 ? (
          activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map(activity => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FiClock size={16} />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>
                    <span className={styles.entityType}>{activity.entityType}: </span>
                    {activity.action}
                  </p>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityTime}>
                      {formatTime(activity.timestamp)}
                    </span>
                    <span className={styles.activityOfficer}>
                      {activity.officer}
                    </span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className={styles.emptyState}>No activities found</div>
        )}
      </div>
      <button 
        className={styles.viewAllBtn}
        onClick={() => window.location.href = '/activities'}
      >
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivities;
