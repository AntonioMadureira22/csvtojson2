import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone
import { FaCheckCircle } from 'react-icons/fa'; // Import check mark icon

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false); // State to track if file is uploaded
  const [progress, setProgress] = useState(0); // State to track progress of file reading

  // Handle CSV file upload
  const handleFileChange = (file) => {
    const uploadedFile = file[0];
    setError(""); // Reset error state on new file selection

    // Check if file is empty
    if (!uploadedFile) {
      setError("No file selected. Please upload a CSV file.");
      setIsFileUploaded(false); // Reset file upload state
      return;
    }

    // Check if the file is a valid CSV file
    if (uploadedFile.type !== 'text/csv') {
      setError("Invalid file type. Please upload a valid CSV file.");
      setIsFileUploaded(false); // Reset file upload state
      return;
    }

    // Check if the file size is not too large (example: limit to 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError("File size is too large. Please upload a file smaller than 10MB.");
      setIsFileUploaded(false); // Reset file upload state
      return;
    }

    // File is valid, set it as the CSV data and update file uploaded status
    setCsvData(uploadedFile);
    setJsonData(null);  // Reset json data when a new file is selected
    setDownloadReady(false); // Reset download ready message
    setIsFileUploaded(true); // Set file upload success state
  };

  // Convert CSV to JSON with progress tracking
  const convertCsvToJson = () => {
    if (!csvData) return;

    setIsLoading(true);  // Start loading state
    const reader = new FileReader();

    // Track file reading progress
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent); // Update progress state
        console.log(`Progress: ${percent}%`); // Add console log to track progress
      }
    };

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

  // React-dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    onDrop: handleFileChange,
    multiple: false, // Ensure only one file can be uploaded at a time
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6">
      {/* Banner with moving text */}
      <div className="bg-blue-700 text-white p-3 fixed top-0 left-0 w-full overflow-hidden z-10">
        <div className="animate-marquee whitespace-nowrap">
          Welcome, thank you for visiting! Updates will be made.
        </div>
      </div>

      <div className="text-center max-w-lg w-full mx-auto flex-grow mt-20">
        <h1 className="text-4xl font-bold mb-6">CSV to JSON Converter</h1>
        <p className="mb-6 text-lg">Convert your CSV data into JSON format easily</p>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full">
          
          {/* Drag and Drop area */}
          <div {...getRootProps()} className="border-4 border-dashed border-blue-500 p-6 rounded-lg mb-4 text-center">
            <input {...getInputProps()} />
            <p className="text-lg">Drag & Drop your CSV file here</p>
            <p className="text-sm text-gray-400">or click to select a file</p>

            {/* Display green check when file is uploaded */}
            {isFileUploaded && (
              <div className="mt-4 text-green-500">
                <FaCheckCircle className="inline-block mr-2" /> File uploaded successfully
              </div>
            )}
          </div>

          {/* Error message display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={convertCsvToJson}
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-lg font-semibold disabled:opacity-50"
            disabled={isLoading || !csvData}
          >
            {isLoading ? 'Converting...' : 'Convert to JSON'}
          </button>

          {/* Progress Bar */}
          {isLoading && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold inline-block py-1 uppercase">Progress</span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-full bg-gray-200 rounded-full">
                    <div
                      className="bg-blue-600 text-xs font-semibold text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            href="https://antoniomadureirasportfolio.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-blue-400 hover:underline"
          >
            {' '} Antonio Madureira
          </a>
          {' '}| Follow me on 
          <a 
            href="X.com/tonemadureira" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-blue-400 hover:underline"
          >
            {' '} X.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
