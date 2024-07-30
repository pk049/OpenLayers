import React, { useState } from 'react';

const TextPredictor = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Text Predictor</h1>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text here..."
            />
            <button onClick={handleSubmit}>Submit</button>
            {result && (
                <div>
                    <h2>Result</h2>
                    <p>Category: {result.category}</p>
                    <p>Location: {result.location}</p>
                </div>
            )}
        </div>
    );
};

export default TextPredictor;
