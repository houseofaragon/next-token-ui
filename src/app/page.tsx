"use client"
import { useState } from 'react';
import axios from 'axios';
import BarChart from './barChart';
import WordScatterPlot from './plotly';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [topTokens, setTopTokens] = useState([]);
  const [topProbabilities, setTopProbabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const fetchNextToken = async () => {
    console.log('fetching')
    if (inputText.trim() === '') return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', { text: inputText });
      console.log('Response:', response.data);
      setTopTokens(response.data.top_tokens);
      setTopProbabilities(response.data.top_probabilities);
    } catch (error) {
      console.error('Error fetching token probabilities:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Next Token Prediction</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text here"
        style={{ padding: '10px', width: '80%', color: 'black' }}
      />
      <button onClick={fetchNextToken} disabled={loading} style={{ padding: '10px' }}>
        {loading ? 'Loading...' : 'Get Next Token'}
      </button>
      {topTokens.length > 0 && <BarChart data={{ top_tokens: topTokens, top_probabilities: topProbabilities }} />}
    </div>
  );
};

export default Home;
