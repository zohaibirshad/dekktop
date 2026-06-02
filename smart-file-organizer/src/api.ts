import { invoke } from '@tauri-apps/api/core';
import type { FileItem } from './types';

/**
 * Scan files from user directories using Tauri command
 */
export async function scanFiles(): Promise<FileItem[]> {
  try {
    const files = await invoke<FileItem[]>('scan_files');
    return files;
  } catch (error) {
    console.error('Error scanning files:', error);
    throw new Error('Failed to scan files. Please check permissions and try again.');
  }
}

/**
 * Search files based on a query using Tauri command
 */
export async function searchFiles(query: string, files: FileItem[]): Promise<FileItem[]> {
  try {
    const results = await invoke<FileItem[]>('search_files', { query, files });
    return results;
  } catch (error) {
    console.error('Error searching files:', error);
    throw new Error('Failed to search files. Please try again.');
  }
}
