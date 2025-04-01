import React, { useState, useEffect } from 'react';
import { useUser } from '../Login _signup_pages/UserContext'; // Adjust path
import '../CustomerPages_css/newAccount.css';

function Account() {
  const { userData, setUserData } = useUser();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePhoto: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define a list of motivational quotes
  const motivationalQuotes = [
    "Believe in yourself and all that you are.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Do not wait to strike till the iron is hot, but make it hot by striking.",
    "The future depends on what you do today.",
    "You are never too old to set another goal or to dream a new dream.",
    "Success is not in what you have, but who you are.",
    "Don't watch the clock; do what it does. Keep going.",
    "Opportunities don't happen, you create them.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones."
  ];

  const [currentQuote, setCurrentQuote] = useState(''); // State to hold the current quote

  // Load profile from localStorage if available
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile) {
      setProfile(storedProfile);
      setImagePreview(storedProfile.profilePhoto || '');
    } else if (userData) {
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        profilePhoto: userData.profilePhoto || '',
      });
      setImagePreview(userData.profilePhoto || '');
    }

    // Change the quote every 10 seconds
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]); // Set a random quote
    }, 10000); // Change quote every 10 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(quoteInterval);

  }, [userData]); // Re-run when userData changes

  // Handle file input change (for uploading profile image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile({ ...profile, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    if (!profile.name || !profile.email) {
      setFormError('Name and Email are required.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`, // Include token if authentication is needed
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile. Please try again.');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser.user);
      
      // Save updated profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(updatedUser.user));

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-container">
      <h2 className="account-title">Profile Information</h2>
      {formError && <p className="account-error">{formError}</p>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-photo-section">
            <label htmlFor="profile-photo" className="account-photo-label">Profile Photo:</label>
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              onChange={handleFileChange}
              className="account-photo-input"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Profile Preview" className="account-photo-preview" />
            )}
          </div>

          <div className="account-input-group">
            <label htmlFor="name" className="account-label">Name:</label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="account-input"
              required
            />
          </div>

          <div className="account-input-group">
            <label htmlFor="email" className="account-label">Email:</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="account-input"
              required
            />
          </div>

          <button type="submit" className="account-submit-btn" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div className="account-info">
          <div className="account-photo-display">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="account-photo-preview" />
            ) : (
              <p className="account-no-photo">No Profile Photo</p>
            )}
          </div>
          <div className="account-details">
            <p className="account-detail"><strong>Name:</strong> {profile.name}</p>
            <p className="account-detail"><strong>Email:</strong> {profile.email}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="account-edit-btn">Edit Profile</button>

            {/* Display the motivational quote */}
      <div className="motivational-quote">
        <p>{currentQuote || "Stay positive and keep going!"}</p>
      </div>
        </div>
      )}
    </div>
  );
}

export default Account;
