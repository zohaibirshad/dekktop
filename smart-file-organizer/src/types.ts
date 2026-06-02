/// File item interface representing a file with metadata
export interface FileItem {
  path: string;
  name: string;
  extension: string;
  category: FileCategory;
  lastModified: number;
  size: number;
}

/// File category types
export type FileCategory = 
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'spreadsheet'
  | 'presentation'
  | 'code'
  | 'other';

/// Category display information
export interface CategoryInfo {
  icon: string;
  displayName: string;
  color: string;
}

/// Search state interface
export interface SearchState {
  files: FileItem[];
  searchResults: FileItem[];
  loading: boolean;
  isScanning: boolean;
  error: string | null;
  searchQuery: string;
}

/// Category mapping for display
export const CATEGORY_INFO: Record<FileCategory, CategoryInfo> = {
  document: { icon: '📄', displayName: 'Document', color: '#3b82f6' },
  image: { icon: '🖼️', displayName: 'Image', color: '#10b981' },
  video: { icon: '🎬', displayName: 'Video', color: '#ef4444' },
  audio: { icon: '🎵', displayName: 'Audio', color: '#f59e0b' },
  archive: { icon: '📦', displayName: 'Archive', color: '#8b5cf6' },
  spreadsheet: { icon: '📊', displayName: 'Spreadsheet', color: '#06b6d4' },
  presentation: { icon: '📽️', displayName: 'Presentation', color: '#ec4899' },
  code: { icon: '💻', displayName: 'Code', color: '#6366f1' },
  other: { icon: '📁', displayName: 'Other', color: '#6b7280' },
};

/**
 * Format a timestamp to a relative date string
 */
export function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Truncate a string to a maximum length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Get the file name without extension
 */
export function getFileNameWithoutExtension(name: string): string {
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex === -1) return name;
  return name.slice(0, lastDotIndex);
}
