import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const UserPage = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [backlog, setBacklog] = useState([]);
  const [currentRotation, setCurrentRotation] = useState([]);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      // Fetch basic user info
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);

      // Fetch user backlog
      const backlogResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}/backlog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBacklog(backlogResponse.data);

      // Fetch user current rotation
      const rotationResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}/current-rotation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentRotation(rotationResponse.data);

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
      {/* Display username with follower and following counts */}
      <div className="d-flex align-items-center mb-2">
        <h1 className="me-3">{userInfo.username}'s Profile</h1>
        <div>
          <span className="me-2"><strong>{userInfo.followers?.length || 0}</strong> followers</span>
          <span><strong>{userInfo.following?.length || 0}</strong> following</span>
        </div>
      </div>
      
      {/* Display Bio */}
      <p>{userInfo.bio || 'This user has not added a bio yet.'}</p>

      {/* Reviews Section */}
      {userInfo.reviews && userInfo.reviews.length > 0 ? (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Reviews</h5>
            {userInfo.reviews.map((review, index) => (
              <p key={index}><strong>{review.albumTitle}</strong>: {review.content}</p>
            ))}
          </div>
        </div>
      ) : (
        <p>No reviews available.</p>
      )}

      {/* Backlog Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Backlog</h5>
          {backlog.length > 0 ? (
            backlog.map((album) => (
              <p key={album.id}><strong>{album.title}</strong> by {album.artist}</p>
            ))
          ) : (
            <p>No albums in backlog.</p>
          )}
        </div>
      </div>

      {/* Current Rotation Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Current Rotation</h5>
          {currentRotation.length > 0 ? (
            currentRotation.map((album) => (
              <p key={album.id}><strong>{album.title}</strong> by {album.artist}</p>
            ))
          ) : (
            <p>No albums in current rotation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
