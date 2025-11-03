import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch, FaTrash, FaCar } from 'react-icons/fa';
import './Management.css';

function TripsManagement() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchQuery, filterStatus, trips]);

  const fetchTrips = async () => {
    try {
      const tripsSnapshot = await getDocs(
        query(collection(db, 'trips'), orderBy('createdAt', 'desc'))
      );
      const tripsData = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrips(tripsData);
      setFilteredTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(trip => trip.status === filterStatus);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(trip =>
        trip.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.riderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.dropLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTrips(filtered);
  };

  const handleDelete = async (trip) => {
    if (window.confirm(`Permanently delete trip ${trip.orderId || trip.id}?`)) {
      try {
        await deleteDoc(doc(db, 'trips', trip.id));
        alert('Trip deleted successfully');
        fetchTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const calculateEarnings = () => {
    return trips
      .filter(t => t.status === 'completed')
      .reduce((sum, trip) => sum + (parseFloat(trip.fare) || 0), 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading trips...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <h1>Trips Management</h1>
          <p>{filteredTrips.length} trips • Rs {calculateEarnings().toFixed(2)} total earnings</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by order ID, customer, rider, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['All', 'pending', 'active', 'in_progress', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Rider</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Package</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <tr key={trip.id}>
                  <td><strong>{trip.orderId || trip.id.slice(0, 8)}</strong></td>
                  <td>{trip.customerName || 'N/A'}</td>
                  <td>{trip.riderName || 'Not assigned'}</td>
                  <td>{trip.pickupLocation || 'N/A'}</td>
                  <td>{trip.dropLocation || 'N/A'}</td>
                  <td>{trip.packageType || 'N/A'}</td>
                  <td><strong>Rs {trip.fare || '0'}</strong></td>
                  <td>
                    <span className={`badge badge-${trip.status || 'pending'}`}>
                      {trip.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(trip)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  <FaCar size={40} />
                  <p>No trips found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TripsManagement;
