"use client"

import { useState } from 'react';
import axios from 'axios';
import BarChart from './barChart';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [topTokens, setTopTokens] = useState([]);
  const [topProbabilities, setTopProbabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTokenizer, setSelectedTokenizer] = useState('gpt2'); // Default tokenizer

  const tokenizers = ['gpt2', 'distilgpt2', 'EleutherAI/gpt-neo-1.3B', 't5-small', 'facebook/bart-small'];

  const handleKeyDown = () => (e) => {
    if (e.key === 'Enter') {
      fetchNextToken();
    }
  }
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTokenizerChange = (e) => {
    setSelectedTokenizer(e.target.value);
  };

  const fetchNextToken = async () => {
    if (inputText.trim() === '') return;
    setLoading(true);
    console.log('tokenizer_name', selectedTokenizer)
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', {
        text: inputText,
        tokenizer_name: selectedTokenizer
      });
      setTopTokens(response.data.top_tokens);
      setTopProbabilities(response.data.top_probabilities);
    } catch (error) {
      console.error('Error fetching token probabilities:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Enter a phrase:</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text here"
        style={{ padding: '10px', width: '80%', color: 'black' }}
        onKeyDown={handleKeyDown()}
      />
      <button onClick={fetchNextToken} disabled={loading} style={{ padding: '10px' }}>
        {loading ? 'Loading...' : 'Get Next Token'}
      </button>
      <div style={{ padding: '10px 0' }}>
        <label>Select Tokenizer: </label>
        <select value={selectedTokenizer} onChange={handleTokenizerChange}>
          {tokenizers.map(tokenizer => <option key={tokenizer} value={tokenizer}>{tokenizer}</option>)}
        </select>
      </div>
      <div style={{ padding: '20px 0 0 0' }}>
        <h1>Top 10 Next Token Probabilities:</h1>
        {topTokens.length > 0 && <BarChart data={{ top_tokens: topTokens, top_probabilities: topProbabilities }} />}
      </div>
    </div>
  );
};

export default Home;
