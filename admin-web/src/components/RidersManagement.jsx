import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch, FaEye, FaCheckCircle, FaTimesCircle, FaTrash, FaBicycle } from 'react-icons/fa';
import './Management.css';

function RidersManagement() {
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiders();
  }, []);

  useEffect(() => {
    filterRiders();
  }, [searchQuery, filterStatus, riders]);

  const fetchRiders = async () => {
    try {
      const ridersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'Rider'))
      );
      const ridersData = ridersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRiders(ridersData);
      setFilteredRiders(ridersData);
    } catch (error) {
      console.error('Error fetching riders:', error);
      alert('Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  };

  const filterRiders = () => {
    let filtered = riders;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(rider => rider.status === filterStatus);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(rider =>
        rider.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.phone?.includes(searchQuery) ||
        rider.cnic?.includes(searchQuery)
      );
    }

    setFilteredRiders(filtered);
  };

  const handleApprove = async (rider) => {
    if (window.confirm(`Approve ${rider.firstName} ${rider.lastName} as a rider?`)) {
      try {
        await updateDoc(doc(db, 'users', rider.id), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
        });
        alert('Rider approved successfully');
        fetchRiders();
      } catch (error) {
        console.error('Error approving rider:', error);
        alert('Failed to approve rider');
      }
    }
  };

  const handleReject = async (rider) => {
    if (window.confirm(`Reject ${rider.firstName} ${rider.lastName}'s application?`)) {
      try {
        await updateDoc(doc(db, 'users', rider.id), {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
        });
        alert('Rider rejected');
        fetchRiders();
      } catch (error) {
        console.error('Error rejecting rider:', error);
        alert('Failed to reject rider');
      }
    }
  };

  const handleDelete = async (rider) => {
    if (window.confirm(`Permanently delete ${rider.firstName} ${rider.lastName}?`)) {
      try {
        await deleteDoc(doc(db, 'users', rider.id));
        alert('Rider deleted successfully');
        fetchRiders();
      } catch (error) {
        console.error('Error deleting rider:', error);
        alert('Failed to delete rider');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading riders...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <h1>Riders Management</h1>
          <p>{filteredRiders.length} riders • {riders.filter(r => r.status === 'pending').length} pending</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email, phone, or CNIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['All', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map(rider => (
                <tr key={rider.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        <FaBicycle />
                      </div>
                      <span>{rider.firstName} {rider.lastName}</span>
                    </div>
                  </td>
                  <td>{rider.email}</td>
                  <td>{rider.phone || 'N/A'}</td>
                  <td>{rider.cnic || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${rider.status || 'pending'}`}>
                      {rider.status || 'pending'}
                    </span>
                  </td>
                  <td>⭐ {rider.rating || '0.0'}</td>
                  <td>
                    <div className="action-buttons">
                      {rider.status === 'pending' && (
                        <>
                          <button
                            className="btn-icon btn-approve"
                            onClick={() => handleApprove(rider)}
                            title="Approve"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            className="btn-icon btn-reject"
                            onClick={() => handleReject(rider)}
                            title="Reject"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(rider)}
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
                <td colSpan="7" className="no-data">
                  <FaBicycle size={40} />
                  <p>No riders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RidersManagement;
