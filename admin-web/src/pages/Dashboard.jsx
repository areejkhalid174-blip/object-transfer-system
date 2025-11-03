import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaBicycle, FaCar, FaCog, FaShieldAlt 
} from 'react-icons/fa';
import Overview from '../components/Overview';
import UsersManagement from '../components/UsersManagement';
import RidersManagement from '../components/RidersManagement';
import TripsManagement from '../components/TripsManagement';
import Settings from '../components/Settings';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaShieldAlt className="sidebar-logo" />
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaHome /> Overview
          </NavLink>
          <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaUsers /> Users
          </NavLink>
          <NavLink to="/dashboard/riders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaBicycle /> Riders
          </NavLink>
          <NavLink to="/dashboard/trips" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaCar /> Trips
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaCog /> Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <FaShieldAlt />
            </div>
            <div className="admin-details">
              <p className="admin-name">Admin</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/riders" element={<RidersManagement />} />
          <Route path="/trips" element={<TripsManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
