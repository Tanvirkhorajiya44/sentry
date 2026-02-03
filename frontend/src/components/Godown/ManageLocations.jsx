import React, { useState } from 'react';
import axios from 'axios';

export default function ManageLocations() {
  const [location, setLocation] = useState('');
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post('http://localhost:5000/api/godown/add', { location });
      setMsg('Location added!');
      setLocation('');
    } catch {
      setMsg('Error adding location');
    }
  };
  return (
    <div>
      <h3>Manage Locations</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location Name" required />
        <button type="submit">Add</button>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  );
}
