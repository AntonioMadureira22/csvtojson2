import React, { useState } from 'react';

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false); // New state for download ready message
  const [error, setError] = useState(""); // New state to hold error messages

  // Handle CSV file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(""); // Reset error state on new file selection

    // Check if file is empty
    if (!file) {
      setError("No file selected. Please upload a CSV file.");
      return;
    }

    // Check if the file is a valid CSV file
    if (file.type !== 'text/csv') {
      setError("Invalid file type. Please upload a valid CSV file.");
      return;
    }

    // Check if the file size is not too large (example: limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size is too large. Please upload a file smaller than 10MB.");
      return;
    }

    // File is valid, set it as the CSV data
    setCsvData(file);
    setJsonData(null);  // Reset json data when a new file is selected
    setDownloadReady(false); // Reset download ready message
  };

  // Convert CSV to JSON
  const convertCsvToJson = () => {
    if (!csvData) return;

    setIsLoading(true);  // Start loading state
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const rows = text.split('\n').map(row => row.split(','));

      // Check for valid CSV format (at least one row and column)
      if (rows.length < 2 || rows[0].length < 1) {
        setError("Invalid CSV format. Please make sure your file has data.");
        setIsLoading(false);
        return;
      }

      const keys = rows[0];
      const json = rows.slice(1).map(row => {
        return keys.reduce((acc, key, index) => {
          acc[key] = row[index];
          return acc;
        }, {});
      });

      setJsonData(json);
      setIsLoading(false);  // End loading state
      setDownloadReady(true); // Set download ready message
    };

    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsText(csvData);
  };

  // Download JSON file
  const downloadJson = () => {
    if (!jsonData) return;

    const jsonStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted-data.json';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6">
      
      {/* Banner with moving text */}
      <div className="bg-blue-700 text-white p-3 fixed top-0 left-0 w-full overflow-hidden z-10">
        <div className="animate-marquee whitespace-nowrap">
          Welcome, thank you for visiting! Updates will be made.
        </div>
      </div>

      <div className="text-center max-w-lg w-full mx-auto flex-grow mt-20"> {/* Added margin-top */}
        <h1 className="text-4xl font-bold mb-6">CSV to JSON Converter</h1>
        <p className="mb-6 text-lg">Convert your CSV data into JSON format easily</p>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-4 p-2 bg-gray-700 text-white rounded-lg w-full"
          />
          
          {/* Error message display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={convertCsvToJson}
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-lg font-semibold disabled:opacity-50"
            disabled={isLoading || !csvData}
          >
            {isLoading ? 'Converting...' : 'Convert to JSON'}
          </button>

          {/* Show message when conversion is complete */}
          {downloadReady && !isLoading && (
            <p className="mt-4 text-green-500 font-semibold">Ready to be downloaded!</p>
          )}

          {/* Show download button when JSON is ready */}
          {jsonData && !isLoading && downloadReady && (
            <button
              onClick={downloadJson}
              className="mt-6 w-full py-2 bg-green-500 rounded-lg hover:bg-green-600 text-lg font-semibold"
            >
              Download JSON
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-white">
        <p>
          Created by 
          <a 
            href="https://your-portfolio-website.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-blue-400 hover:underline"
          >
            Antonio Madureira
          </a>
          {' '}| Follow me on 
          <a 
            href="https://twitter.com/your-twitter-handle" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-blue-400 hover:underline"
          >
            Twitter
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
