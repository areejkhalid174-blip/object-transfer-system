import { FaShieldAlt, FaCog, FaBell, FaDatabase, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import './Settings.css';

function Settings() {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your admin account and system settings</p>
      </div>

      <div className="settings-content">
        <div className="admin-profile-card">
          <div className="profile-avatar">
            <FaShieldAlt />
          </div>
          <div className="profile-info">
            <h2>Admin User</h2>
            <p>admin@objecttransfer.com</p>
            <span className="admin-badge">Administrator</span>
          </div>
        </div>

        <div className="settings-section">
          <h3><FaCog /> System Settings</h3>
          <div className="settings-item">
            <div>
              <h4>System Configuration</h4>
              <p>Configure system-wide settings</p>
            </div>
            <button className="settings-btn">Configure</button>
          </div>
          <div className="settings-item">
            <div>
              <h4>Notification Settings</h4>
              <p>Manage notification preferences</p>
            </div>
            <button className="settings-btn">Manage</button>
          </div>
          <div className="settings-item">
            <div>
              <h4>Backup & Restore</h4>
              <p>Backup and restore system data</p>
            </div>
            <button className="settings-btn">Backup</button>
          </div>
        </div>

        <div className="settings-section">
          <h3><FaQuestionCircle /> Support</h3>
          <div className="settings-item">
            <div>
              <h4>Help & Support</h4>
              <p>Contact: admin@objecttransfer.com</p>
            </div>
            <button className="settings-btn">Contact</button>
          </div>
          <div className="settings-item">
            <div>
              <h4>About</h4>
              <p>Admin Portal v1.0.0</p>
            </div>
            <button className="settings-btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
