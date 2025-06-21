import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  getUserFromStorage, 
  saveToStorage, 
  getFromStorage,
  clearStorage 
} from '../utils/localStorage';

function Profile() {
  const { user, isAuthenticated } = useAuth0();
  const [storedUser, setStoredUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    // Load stored user data
    const userData = getUserFromStorage();
    setStoredUser(userData);

    // Load user preferences
    const preferences = getFromStorage('userPreferences');
    setUserPreferences(preferences || {});
  }, []);

  const savePreferences = () => {
    const preferences = {
      theme: 'dark',
      notifications: true,
      language: 'en',
      savedAt: new Date().toISOString()
    };
    saveToStorage('userPreferences', preferences);
    setUserPreferences(preferences);
  };

  const clearAllData = () => {
    clearStorage();
    setStoredUser(null);
    setUserPreferences({});
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Profile</h1>
      
      {/* Current Auth0 User Data */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Current User (from Auth0)</h2>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
            {user.picture && <img src={user.picture} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />}
          </div>
        )}
      </div>

      {/* Stored User Data */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Stored User Data (from localStorage)</h2>
        {storedUser ? (
          <div>
            <p><strong>Name:</strong> {storedUser.name}</p>
            <p><strong>Email:</strong> {storedUser.email}</p>
            <p><strong>Email Verified:</strong> {storedUser.email_verified ? 'Yes' : 'No'}</p>
            {storedUser.picture && <img src={storedUser.picture} alt="Stored Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />}
          </div>
        ) : (
          <p>No stored user data found</p>
        )}
      </div>

      {/* User Preferences */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>User Preferences</h2>
        {Object.keys(userPreferences).length > 0 ? (
          <div>
            <p><strong>Theme:</strong> {userPreferences.theme}</p>
            <p><strong>Notifications:</strong> {userPreferences.notifications ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Language:</strong> {userPreferences.language}</p>
            <p><strong>Saved At:</strong> {userPreferences.savedAt}</p>
          </div>
        ) : (
          <p>No preferences saved</p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={savePreferences}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Save Preferences
        </button>
        
        <button 
          onClick={() => {
            const userData = getUserFromStorage();
            console.log('Current stored user:', userData);
            alert('Check console for stored user data');
          }}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Show Stored Data
        </button>
        
        <button 
          onClick={clearAllData}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear All Storage
        </button>
      </div>
    </div>
  );
}

export default Profile;