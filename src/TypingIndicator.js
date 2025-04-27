import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = () => {
    return (
        // <div className="typing-indicator">
        //     <span></span>
        //     <span></span>
        //     <span></span>
        // </div>
        <div className="typing-container">
            L'IA est en train de faire des recherches pour toi
            <span className="dot one">.</span>
            <span className="dot two">.</span>
            <span className="dot three">.</span>
        </div>

    );
};

export default TypingIndicator;
