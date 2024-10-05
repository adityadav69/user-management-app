import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserForm from './UserForm'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'; // Added TextField for search
import CircularProgress from '@mui/material/CircularProgress'; // Spinner for loading

function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For filtered user list
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State to track search input
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize with all users
        setLoading(false);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Filter users based on search query
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredUsers(users); // Reset to all users when search query is empty
    } else {
      const searchResult = users.filter(user => 
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) // Case-insensitive search
      );
      setFilteredUsers(searchResult);
    }
  };

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(() => {
          setUsers(users.filter(user => user.id !== id));
          setFilteredUsers(filteredUsers.filter(user => user.id !== id)); // Also remove from filtered list
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    setFilteredUsers(filteredUsers.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    handleClose();
  };

  return (
    <div>
      <h2>User Management</h2>
      
      {/* Search Bar */}
      <TextField 
      className='search-bar'
        label="Search by name" 
        variant="outlined" 
        value={searchQuery} 
        onChange={handleSearch} 
        fullWidth 
        style={{ marginBottom: '20px' }}
      />

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div className="button-container">
                  <Link to={`/user/${user.id}`}><button className='blue'>View</button></Link>
                  <button className='green' onClick={() => handleEditClick(user)}>Edit</button>
                  <button className='red' onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editingUser && (
            <UserForm
              isEditing={true}
              user={editingUser}
              onSave={handleSaveUser}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
