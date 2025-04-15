// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import '../styles/homepage.css';

// const Home = () => {
//   const [titles, setTitles] = useState([]);
//   const [newTitle, setNewTitle] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
   
//   const fetchTitles = async () => {
//     setFetchLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/api/titles', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setTitles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch titles:', err);
//       toast.error('Failed to load your tasks');
//     } finally {
//       setFetchLoading(false);
//     }
//   };
   
//   const handleCreateTitle = async () => {
//     if (!newTitle.trim()) return;
    
//     setLoading(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/titles', { name: newTitle }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Add the new title to the state
//       setTitles(prev => [...prev, response.data]);
//       setNewTitle('');
//       toast.success('Task added successfully!');
//     } catch (err) {
//       console.error('Failed to create title:', err);
//       toast.error('Failed to add task');
//     } finally {
//       setLoading(false);
//     }
//   };
   
//   const handleDeleteTitle = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       // Check what API endpoint format your backend expects
//       // Option 1: Standard REST endpoint
//       await axios.delete(`http://localhost:5000/api/titles/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // If Option 1 fails, try these alternatives:
      
//       // Option 2: Using query parameters
//       // await axios.delete(`http://localhost:5000/api/titles?id=${id}`, {
//       //   headers: { Authorization: `Bearer ${token}` }
//       // });
      
//       // Option 3: Using request body with DELETE method
//       // await axios.delete(`http://localhost:5000/api/titles`, {
//       //   headers: { Authorization: `Bearer ${token}` },
//       //   data: { id }
//       // });
      
//       // Option 4: Using POST method with _method=DELETE
//       // await axios.post(`http://localhost:5000/api/titles`, 
//       //   { id, _method: 'DELETE' },
//       //   { headers: { Authorization: `Bearer ${token}` }}
//       // );
      
//       // Remove the deleted title from the state - this should work regardless
//       // of which API option works
//       setTitles(prev => prev.filter(title => title.id !== id));
//       toast.success('Task deleted successfully!');
//     } catch (err) {
//       console.error('Failed to delete title:', err);
//       toast.error('Failed to delete task. Please try again.');
      
//       // This might help debug the problem
//       if (err.response) {
//         console.log('Error status:', err.response.status);
//         console.log('Error data:', err.response.data);
//       }
//     }
//   };
   
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     toast.info('You have been logged out');
//     window.location.href = '/login';
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && newTitle.trim()) {
//       handleCreateTitle();
//     }
//   };
   
//   useEffect(() => {
//     fetchTitles();
//   }, []);
   
//   return (
//     <div className="home-page">
//       <header className="app-header">
//         <h1>Task Manager</h1>
//         <button onClick={handleLogout} className="logout-button">Logout</button>
//       </header>
           
//       <div className="task-container">
//         <h2>My Tasks</h2>
                
//         <div className="task-form">
//           <input
//             type="text"
//             placeholder="Add a new task..."
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             onKeyPress={handleKeyPress}
//           />
//           <button
//             onClick={handleCreateTitle}
//             disabled={loading || !newTitle.trim()}
//             className={loading ? 'button-loading' : ''}
//           >
//             {loading ? 'Adding...' : 'Add'}
//           </button>
//         </div>
                
//         {fetchLoading ? (
//           <div className="loading-state">Loading your tasks...</div>
//         ) : titles.length === 0 ? (
//           <div className="empty-state">
//             No tasks yet. Add your first task above!
//           </div>
//         ) : (
//           <ul className="task-list">
//             {titles.map(title => (
//               <li key={title.id || title._id} className="task-item">
//                 <span className="task-name">{title.name}</span>
//                 <button
//                   onClick={() => handleDeleteTitle(title.id || title._id)}
//                   className="delete-button"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/homepage.css';

const Home = () => {
  const [titles, setTitles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ✅ Fetch titles from the backend
  const fetchTitles = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not logged in');
        window.location.href = '/login';
        return;
      }

      const res = await axios.get('http://localhost:5000/api/titles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitles(res.data);
      localStorage.setItem('cachedTitles', JSON.stringify(res.data)); // ✅ Save to localStorage
    } catch (err) {
      console.error('Failed to fetch titles:', err);

      if (err.response && err.response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error('Failed to load your tasks');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  // ✅ Add new title
  const handleCreateTitle = async () => {
    if (!newTitle.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/titles', { name: newTitle }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitles(prev => [...prev, response.data]);
      setNewTitle('');
      toast.success('Task added successfully!');
    } catch (err) {
      console.error('Failed to create title:', err);
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a title
  const handleDeleteTitle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/titles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitles(prev => prev.filter(title => title.id !== id && title._id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Failed to delete title:', err);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  // ✅ Log out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cachedTitles');
    toast.info('You have been logged out');
    window.location.href = '/login';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTitle.trim()) {
      handleCreateTitle();
    }
  };

  // ✅ Load from localStorage instantly, then fetch latest from backend
  useEffect(() => {
    const cached = localStorage.getItem('cachedTitles');
    if (cached) {
      setTitles(JSON.parse(cached));
    }
    fetchTitles();
  }, []);

  // ✅ Save tasks to localStorage every time they change
  useEffect(() => {
    localStorage.setItem('cachedTitles', JSON.stringify(titles));
  }, [titles]);

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="task-container">
        <h2>My Tasks</h2>

        <div className="task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleCreateTitle}
            disabled={loading || !newTitle.trim()}
            className={loading ? 'button-loading' : ''}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        {fetchLoading ? (
          <div className="loading-state">Loading your tasks...</div>
        ) : titles.length === 0 ? (
          <div className="empty-state">
            No tasks yet. Add your first task above!
          </div>
        ) : (
          <ul className="task-list">
            {titles.map(title => (
              <li key={title.id || title._id} className="task-item">
                <span className="task-name">{title.name}</span>
                <button
                  onClick={() => handleDeleteTitle(title.id || title._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
