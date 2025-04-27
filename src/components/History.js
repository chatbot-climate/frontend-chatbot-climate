import React from 'react';

const History = ({ history }) => (
    <div>
        <h3>Historique</h3>
        {history.map((item, index) => (
            <div key={index}>
                <strong>Q:</strong> {item.question}<br />
                <strong>R:</strong> {item.response}<hr />
            </div>
        ))}
    </div>
);

export default History;
