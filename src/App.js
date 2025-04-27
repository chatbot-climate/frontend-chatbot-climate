import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import { useEffect, useState } from 'react';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try{
      fetch('http://localhost:5000/check-auth', {
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur de réponse serveur");
          }
          return response.json();
        })
        .then(data => setAuth(data.authenticated))
        .catch((err) => {
          console.error(err);
        });
    }catch(e){
      //
    }
    
  }, []);

  if (auth === null) return <p>Chargement...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={auth ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={auth ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
