import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserForm({ isEditing, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '' },
    company: { name: '' },
  });

  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: { street: user.address.street, city: user.address.city },
        company: { name: user.company.name },
      });
    }
  }, [isEditing, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, formData)
        .then(response => {
          onSave(response.data); 
        })
        .catch(error => console.error('Error updating user:', error));
    } else {
      axios.post('https://jsonplaceholder.typicode.com/users', formData)
        .then(response => {
          onSave(response.data);
        })
        .catch(error => console.error('Error creating user:', error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Street:</label>
        <input
          type="text"
          value={formData.address.street}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          value={formData.address.city}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
          required
        />
      </div>
      <div>
        <label>Company Name:</label>
        <input
          type="text"
          value={formData.company.name}
          onChange={(e) => setFormData({ ...formData, company: { name: e.target.value } })}
        />
      </div>
      <button className='blue' type="submit">{isEditing ? 'Update User' : 'Create User'}</button>
    </form>
  );
}

export default UserForm;
