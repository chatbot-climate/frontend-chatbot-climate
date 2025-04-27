import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import TypingIndicator from './TypingIndicator';

function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [historiesLoading, setHistoriesLoading] = useState(false);


    useEffect(() => {
        try {
            fetch('http://localhost:5000/check-auth', {
                credentials: 'include'
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erreur de réponse serveur");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.authenticated) {
                        setUsername(data.username);
                        loadHistory(data.username);
                    } else {
                        navigate('/login');
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (e) {
            setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        }

    }, []);

    const loadHistory = async (username) => {
        setHistoriesLoading(true);
        try {
            if (username) {
                const res = await fetch(`http://localhost:5000/history?username=${username}`, {
                    credentials: 'include'
                });
                
                if (!res.ok) {
                    throw new Error("Erreur réseau ou serveur");
                }
    
                const data = await res.json();
                if (data) {
                    setMessages(data); // .reverse() newest last
                }

            } else {
                navigate('/login');
            }
        } catch (e) {
            setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        } finally {
            setHistoriesLoading(false);
        }


    };

    const sendQuestion = async () => {
        setLoading(true);
        try {
            if (!question.trim()) return;

            const res = await fetch('http://localhost:5000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ question, username }),
            });

            if (!res.ok) {
                throw new Error("Erreur réseau ou serveur");
            }

            const data = await res.json();
            if (data && data.answer) {
                setMessages(prev => [...prev, { question, answer: data.answer }]);
                setQuestion('');
            }
        } catch (e) {
            setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }

    };


    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error("Erreur réseau ou serveur");
            }

            const data = await res.json();
            if (data.success) {
                navigate('/login');
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
        }

    };



    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h2>Bienvenue, {username} ! <button onClick={handleLogout}>Déconnecter</button></h2>
            <div style={{
                border: '1px solid #ccc',
                padding: 15,
                borderRadius: 10,
                minHeight: 300,
                marginBottom: 20,
                backgroundColor: '#f9f9f9'
            }}>
                {historiesLoading && <p style={{ color: 'blue' }}>Chargement...</p>}
                {(!historiesLoading && messages.length === 0) && <p>Aucune question posée pour le moment.</p>}
                {messages.length !== 0 && (
                    messages.map((msg, i) => (
                        <div key={i} style={{ marginBottom: 15 }}>
                            <p><strong>Vous :</strong> {msg.question}</p>
                            <p><strong>Réponse IA :</strong> {msg.answer}</p>
                            <hr />
                        </div>
                    ))
                )}
                {/* {loading && <div className="loader"></div>} */}
                {loading && <TypingIndicator />}
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
                <input
                    style={{ flex: 1, padding: 10 }}
                    placeholder="Posez une question..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
                />
                <button onClick={sendQuestion} disabled={loading}>{loading ? <span>Traitement en cours</span> : <span>Envoyer</span>}</button>
            </div>
        </div>
    );
}

export default Chat;
