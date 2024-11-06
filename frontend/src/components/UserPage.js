import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const UserPage = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3001/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
        console.error("Error fetching user data:", error.response);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="container my-4">
      <h1>{userInfo.username}'s Profile</h1>
      {/* Display Followers, Following, Reviews, Current Rotation, Backlog, and Recent Reviews */}
      {/* Each section can map the respective data arrays */}
    </div>
  );
};

export default UserPage;
