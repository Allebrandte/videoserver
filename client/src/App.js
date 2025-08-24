import React, { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/videos', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(setVideos);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎬 VideoServer</h1>
      <ul>
        {videos.map(v => <li key={v._id}>{v.filename}</li>)}
      </ul>
    </div>
  );
}

export default App;
