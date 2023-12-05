import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleScrape = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.data.join('\n'));
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="App-title">ScrapeVulture</h1>
      <div className="App-content">
        <div className="input-box">
          <label>Enter URL:</label>
          <input type="text" value={url} onChange={handleUrlChange} />
          <button onClick={handleScrape}>Scrape</button>
        </div>
        <div className="output-box">
          <h2 className="label-output">List of URLs Scraped:</h2>
          <div className="url-box">
            <pre className="scrollable-box">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
