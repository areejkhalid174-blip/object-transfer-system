import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch, FaEdit, FaTrash, FaUser, FaTimes } from 'react-icons/fa';
import './Management.css';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [editForm, setEditForm] = useState({});
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role !== 'Admin'); // Don't show admin users
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (filterRole !== 'All') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setEditModal({ show: true, user });
  };

  const handleUpdate = async () => {
    if (!editForm.firstName.trim() || !editForm.email.trim()) {
      alert('First name and email are required');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', editModal.user.id), {
        ...editForm,
        updatedAt: new Date().toISOString(),
      });
      alert('User updated successfully');
      setEditModal({ show: false, user: null });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await deleteDoc(doc(db, 'users', user.id));
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const setAllCustomersCityToSargodha = async () => {
    if (bulkUpdating) return;
    if (!window.confirm('Set city to Sargodha for ALL customers? This will update all customer records.')) {
      return;
    }
    try {
      setBulkUpdating(true);
      const customersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'Customer')));
      if (customersSnap.empty) {
        alert('No customers found');
        return;
      }
      const batch = writeBatch(db);
      customersSnap.docs.forEach((d) => {
        batch.update(doc(db, 'users', d.id), { city: 'Sargodha', updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      alert('All customers updated to city: Sargodha');
      fetchUsers();
    } catch (error) {
      console.error('Bulk update error:', error);
      alert('Failed to update customers');
    } finally {
      setBulkUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>{filteredUsers.length} users found</p>
        </div>
        <div>
          <button
            className={`btn-primary ${bulkUpdating ? 'disabled' : ''}`}
            onClick={setAllCustomersCityToSargodha}
            disabled={bulkUpdating}
            title="Set city to Sargodha for all customers"
          >
            {bulkUpdating ? 'Updating…' : 'Set Customers City: Sargodha'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['All', 'Customer', 'Rider'].map(role => (
            <button
              key={role}
              className={`filter-tab ${filterRole === role ? 'active' : ''}`}
              onClick={() => setFilterRole(role)}
            >
              {role}
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
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        <FaUser />
                      </div>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user)}
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
                <td colSpan="5" className="no-data">
                  <FaUser size={40} />
                  <p>No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editModal.show && (
        <div className="modal-overlay" onClick={() => setEditModal({ show: false, user: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={() => setEditModal({ show: false, user: null })}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditModal({ show: false, user: null })}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
