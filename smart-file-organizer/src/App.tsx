import { useState, useEffect, useCallback } from 'react';
import { scanFiles, searchFiles } from './api';
import SearchBar from './components/SearchBar';
import FileList from './components/FileList';
import type { FileItem } from './types';
import './styles.css';

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Main App component
 * Manages file scanning, searching, and display state
 */
function App() {
  // State management using useState
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Debounce search query to prevent excessive searches
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  /**
   * Initial file scan on component mount
   */
  useEffect(() => {
    const performInitialScan = async () => {
      try {
        setIsScanning(true);
        setError(null);
        const scannedFiles = await scanFiles();
        setFiles(scannedFiles);
        setSearchResults(scannedFiles.slice(0, 50)); // Show first 50 files initially
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setIsScanning(false);
      }
    };

    performInitialScan();
  }, []);

  /**
   * Handle search when debounced query changes
   */
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        // If query is empty, show all files (first 50)
        setSearchResults(files.slice(0, 50));
        return;
      }

      try {
        setLoading(true);
        const results = await searchFiles(debouncedSearchQuery, files);
        setSearchResults(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (files.length > 0) {
      performSearch();
    }
  }, [debouncedSearchQuery, files]);

  /**
   * Handle search query change
   */
  const handleSearchQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
    setError(null);
  }, []);

  /**
   * Handle explicit search trigger
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setError(null);
  }, []);

  /**
   * Handle refresh/scan again
   */
  const handleRefresh = useCallback(async () => {
    try {
      setIsScanning(true);
      setError(null);
      const scannedFiles = await scanFiles();
      setFiles(scannedFiles);
      setSearchResults(scannedFiles.slice(0, 50));
      setSearchQuery('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh files';
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  }, []);

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">🗂️</span>
            <h1 className="app-title">Smart File Organizer</h1>
          </div>
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={isScanning}
            aria-label="Refresh files"
          >
            <span className={`refresh-icon ${isScanning ? 'spinning' : ''}`}>↻</span>
            Refresh
          </button>
        </div>
        <p className="app-subtitle">
          Search your files using natural language queries • Works 100% offline
        </p>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Search Bar Section */}
        <section className="search-section">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchQueryChange}
            onSearch={handleSearch}
            disabled={isScanning || loading}
          />
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-dismiss" 
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scanning Indicator */}
        {isScanning && (
          <div className="scanning-indicator">
            <div className="spinner"></div>
            <span>Scanning your files...</span>
          </div>
        )}

        {/* File List Section */}
        <section className="files-section">
          <FileList
            files={searchResults}
            loading={loading && !isScanning}
            isEmpty={!loading && !isScanning && searchResults.length === 0}
            emptyMessage={
              searchQuery 
                ? `No files found matching "${searchQuery}". Try different keywords.`
                : 'No files found in Documents, Downloads, or Desktop folders.'
            }
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Smart File Organizer v1.0.0 • 
          Scanned: Documents, Downloads, Desktop (3 levels deep) • 
          Total Files: {files.length}
        </p>
      </footer>
    </div>
  );
}

export default App;
