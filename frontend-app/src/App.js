import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleScrape = async (option) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, option }),
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

  const handleDownload = () => {
    // Create a Blob with the content and trigger a download
    const blob = new Blob([output], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scraped_urls.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1 className="App-title">ScrapeVulture</h1>
      <div className="App-content">
        <p align="center">
          Welcome to ScrapeVulture! 🦅
        </p>
        <p align="center">
          You can input any webpage's URL into the below input box, and get a list of all the links and image links within that webpage.
        </p>
        <p align="center">
          Kindly do not use this tool for malicious purposes.
        </p>
        <div className="input-box">
          <label>Enter URL:</label>
          <input type="text" value={url} onChange={handleUrlChange} />
          <button onClick={() => handleScrape('links')}>Scrape Links</button>
          <button onClick={() => handleScrape('images')}>Scrape Images</button>
        </div>
        <div className="output-box">
          <h2 className="label-output">Scraped Content:</h2>
          <div className="url-box">
            <pre className="scrollable-box">{output}</pre>
          </div>
          {output && (
            <div className="download-box">
              <button onClick={handleDownload}>Download scraped links as text file</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;