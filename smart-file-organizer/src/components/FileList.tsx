import React from 'react';
import type { FileItem } from '../types';
import { 
  CATEGORY_INFO, 
  formatRelativeDate, 
  formatFileSize, 
  truncateString 
} from '../types';

interface FileListProps {
  files: FileItem[];
  loading: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

/**
 * FileCard component displays a single file item
 */
const FileCard: React.FC<{ file: FileItem }> = ({ file }) => {
  const categoryInfo = CATEGORY_INFO[file.category];
  
  const handleOpenFile = () => {
    // In a real implementation, this would use Tauri shell plugin to open the file
    console.log('Opening file:', file.path);
  };

  return (
    <div className="file-card" onClick={handleOpenFile} role="button" tabIndex={0}>
      <div className="file-card-header">
        <span className="file-category-icon">{categoryInfo.icon}</span>
        <span 
          className="file-category-badge"
          style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
        >
          {categoryInfo.displayName}
        </span>
      </div>
      
      <div className="file-card-body">
        <h3 className="file-name" title={file.name}>
          {truncateString(file.name, 50)}
        </h3>
        <p className="file-path" title={file.path}>
          {truncateString(file.path, 80)}
        </p>
      </div>
      
      <div className="file-card-footer">
        <span className="file-date">{formatRelativeDate(file.lastModified)}</span>
        <span className="file-size">{formatFileSize(file.size)}</span>
      </div>
    </div>
  );
};

/**
 * Loading skeleton for file cards
 */
const LoadingSkeleton: React.FC = () => (
  <div className="file-card loading">
    <div className="file-card-header">
      <div className="skeleton-icon"></div>
      <div className="skeleton-badge"></div>
    </div>
    <div className="file-card-body">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-path"></div>
    </div>
    <div className="file-card-footer">
      <div className="skeleton-line skeleton-date"></div>
      <div className="skeleton-line skeleton-size"></div>
    </div>
  </div>
);

/**
 * Empty state component
 */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="empty-state">
    <div className="empty-state-icon">📂</div>
    <h3>No Files Found</h3>
    <p>{message}</p>
  </div>
);

/**
 * FileList component displays a grid of file cards
 */
export const FileList: React.FC<FileListProps> = ({ 
  files, 
  loading, 
  isEmpty = false,
  emptyMessage = 'No files match your search criteria' 
}) => {
  if (loading) {
    return (
      <div className="file-list">
        <div className="file-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0 || isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <span className="results-count">{files.length} file{files.length !== 1 ? 's' : ''} found</span>
      </div>
      <div className="file-grid">
        {files.map((file, index) => (
          <FileCard key={`${file.path}-${index}`} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList;
