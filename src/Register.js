import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, full_name: fullName }),
            });

            if (!res.ok) {
                throw new Error("Erreur réseau ou serveur");
            }

            const data = await res.json();
            if (data.success) {
                navigate('/chat');
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
                <h2>Créer un compte</h2>
                <input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                /> &nbsp; &nbsp; 
                <input
                    placeholder="Nom complet"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                /> &nbsp; &nbsp; 
                <button onClick={handleRegister}>S’enregistrer</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <p style={{ }}>J'ai déjà un compte. </p>
                    <button onClick={() => navigate('/login')}>Se connecter</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
