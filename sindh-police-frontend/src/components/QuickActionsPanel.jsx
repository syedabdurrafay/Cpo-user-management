import { FiUsers, FiAlertTriangle, FiMap, FiFileText } from 'react-icons/fi';
import './QuickActionsPanel.css';

const QuickActionsPanel = ({ scrollToSection }) => {
  const actions = [
    { 
      icon: <FiUsers size={20} />, 
      label: 'Add Personnel', 
      type: 'blue',
      sectionId: 'personnel-management'
    },
    { 
      icon: <FiAlertTriangle size={20} />, 
      label: 'Issue Alert', 
      type: 'red',
      sectionId: 'emergency-alerts'
    },
    { 
      icon: <FiMap size={20} />, 
      label: 'Map View', 
      type: 'green',
      sectionId: 'map-section'
    },
    { 
      icon: <FiFileText size={20} />, 
      label: 'Generate Report', 
      type: 'purple',
      sectionId: 'crime-trend-chart'
    },
  ];

  return (
    <div className="quick-actions-card">
      <h2 className="quick-actions-heading">Quick Actions</h2>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-button action-${action.type}`}
            onClick={() => scrollToSection(action.sectionId)}
          >
            <div className="action-icon">{action.icon}</div>
            <span className="action-text">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;