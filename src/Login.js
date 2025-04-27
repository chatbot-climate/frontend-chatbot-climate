import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username }),
            });
            // console.log(res)
            // if (!res.ok) {
            //     throw new Error("Erreur réseau ou serveur");
            // }

            const data = await res.json();
            // console.log(data);
            if (data.success) {
                // console.log(data);
                navigate('/chat');
                window.location.reload(true);
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        }

    };

    return (
        <div  style={{ width: '100%' }}>
            <div  style={{ width: '50%', margin: 'auto', marginTop: '70px' }}>
                <h2>Connexion</h2>
                <input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                /> &nbsp; &nbsp; 
                <button onClick={handleLogin}>Se connecter</button>
                {error && (
                    <div>
                        <p style={{ color: 'red' }}>{error}</p>
                        {/* <button onClick={() => navigate('/register')}>Créer un compte</button> */}
                    </div>
                )}
                <div>
                    <p style={{ }}>Je n'ai pas de compte. </p>
                    <button onClick={() => navigate('/register')}>Créer un compte</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
