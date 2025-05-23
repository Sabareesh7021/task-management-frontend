import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/users';
import UserForm from '../../components/users/UserForm';
import UserList from '../../components/users/UserList';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData);
      setUsers(prev => [...prev, response.data]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const response = await updateUser(id, userData);
      setUsers(prev => prev.map(u => u.id === id ? response.data : u));
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        {user.is_superuser && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create New User'}
          </button>
        )}
      </div>

      {showForm && (
        <UserForm 
          onSubmit={editingUser ? 
            (data) => handleUpdateUser(editingUser.id, data) : 
            handleCreateUser}
          initialData={editingUser}
        />
      )}

      <UserList 
        users={users} 
        currentUser={user}
        onEdit={setEditingUser}
        onDelete={handleDeleteUser}
        setShowForm={setShowForm}
      />
    </div>
  );
};

export default AdminUsers;