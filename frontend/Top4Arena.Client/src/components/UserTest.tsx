import { useUser, useAuth } from "@clerk/clerk-react";
import { useState } from "react";

const UserTest = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [backendUser, setBackendUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserFromBackend = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5157/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBackendUser(data);
        setError(null);
      } else {
        setError(`Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (!user) return <div>Not signed in</div>;

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>User Test Component</h3>
      <button onClick={fetchUserFromBackend}>Fetch User from Backend</button>
      
      {backendUser && (
        <div style={{ marginTop: '10px' }}>
          <h4>Backend User Data:</h4>
          <pre>{JSON.stringify(backendUser, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default UserTest;
