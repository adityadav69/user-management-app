import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  return (
    user ? (
      <div>
        <h1>{user.name}</h1>
        <p>Email: {user.email}</p>
        {/* More details */}
      </div>
    ) : (
      <div>Loading...</div>
    )
  );
}

export default UserDetail;
