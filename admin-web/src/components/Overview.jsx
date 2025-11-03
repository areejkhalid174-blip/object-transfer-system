import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  FaUsers, FaBicycle, FaClock, FaCar, FaPlayCircle, 
  FaCheckCircle, FaWallet, FaChartLine 
} from 'react-icons/fa';
import './Overview.css';

function Overview() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRiders: 0,
    pendingRiders: 0,
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch customers
      const customersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'Customer'))
      );
      
      // Fetch riders
      const ridersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'Rider'))
      );
      
      // Fetch pending riders
      const pendingRidersSnapshot = await getDocs(
        query(
          collection(db, 'users'), 
          where('role', '==', 'Rider'), 
          where('status', '==', 'pending')
        )
      );
      
      // Fetch trips
      const tripsSnapshot = await getDocs(collection(db, 'trips'));
      const trips = tripsSnapshot.docs.map(doc => doc.data());
      
      const activeTrips = trips.filter(t => 
        t.status === 'active' || t.status === 'in_progress'
      ).length;
      const completedTrips = trips.filter(t => t.status === 'completed').length;
      
      // Calculate total earnings
      const totalEarnings = trips
        .filter(t => t.status === 'completed')
        .reduce((sum, trip) => sum + (parseFloat(trip.fare) || 0), 0);

      setStats({
        totalCustomers: customersSnapshot.size,
        totalRiders: ridersSnapshot.size,
        pendingRiders: pendingRidersSnapshot.size,
        totalTrips: tripsSnapshot.size,
        activeTrips,
        completedTrips,
        totalEarnings,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: color + '20', color }}>
        <Icon />
      </div>
      <div className="stat-info">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="overview">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to your admin dashboard</p>
        </div>
        <button className="refresh-btn" onClick={fetchStats}>
          <FaChartLine /> Refresh
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={FaUsers}
          title="Total Customers"
          value={stats.totalCustomers}
          color="#4CAF50"
        />
        <StatCard
          icon={FaBicycle}
          title="Total Riders"
          value={stats.totalRiders}
          color="#2196F3"
        />
        <StatCard
          icon={FaClock}
          title="Pending Approvals"
          value={stats.pendingRiders}
          color="#FF9800"
        />
        <StatCard
          icon={FaCar}
          title="Total Trips"
          value={stats.totalTrips}
          color="#9C27B0"
        />
        <StatCard
          icon={FaPlayCircle}
          title="Active Trips"
          value={stats.activeTrips}
          color="#00BCD4"
        />
        <StatCard
          icon={FaCheckCircle}
          title="Completed Trips"
          value={stats.completedTrips}
          color="#4CAF50"
        />
      </div>

      <div className="earnings-card">
        <div className="earnings-icon">
          <FaWallet />
        </div>
        <div className="earnings-info">
          <p className="earnings-label">Total Earnings</p>
          <h2 className="earnings-value">Rs {stats.totalEarnings.toFixed(2)}</h2>
        </div>
      </div>

      <div className="quick-stats">
        <h2>Quick Statistics</h2>
        <div className="quick-stats-grid">
          <div className="quick-stat-item">
            <span className="quick-stat-label">Average per Trip</span>
            <span className="quick-stat-value">
              Rs {stats.completedTrips > 0 
                ? (stats.totalEarnings / stats.completedTrips).toFixed(2) 
                : '0.00'}
            </span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Completion Rate</span>
            <span className="quick-stat-value">
              {stats.totalTrips > 0 
                ? ((stats.completedTrips / stats.totalTrips) * 100).toFixed(1) 
                : '0'}%
            </span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Riders per Customer</span>
            <span className="quick-stat-value">
              {stats.totalCustomers > 0 
                ? (stats.totalRiders / stats.totalCustomers).toFixed(2) 
                : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
