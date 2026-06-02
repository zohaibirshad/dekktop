fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![scan_files, search_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use walkdir::WalkDir;
use chrono::{DateTime, Utc};

/// File category types for organizing files
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum FileCategory {
    Document,
    Image,
    Video,
    Audio,
    Archive,
    Spreadsheet,
    Presentation,
    Code,
    Other,
}

impl FileCategory {
    /// Get the icon name for the category (used in frontend)
    pub fn icon(&self) -> &'static str {
        match self {
            FileCategory::Document => "📄",
            FileCategory::Image => "🖼️",
            FileCategory::Video => "🎬",
            FileCategory::Audio => "🎵",
            FileCategory::Archive => "📦",
            FileCategory::Spreadsheet => "📊",
            FileCategory::Presentation => "📽️",
            FileCategory::Code => "💻",
            FileCategory::Other => "📁",
        }
    }

    /// Get display name for the category
    pub fn display_name(&self) -> &'static str {
        match self {
            FileCategory::Document => "Document",
            FileCategory::Image => "Image",
            FileCategory::Video => "Video",
            FileCategory::Audio => "Audio",
            FileCategory::Archive => "Archive",
            FileCategory::Spreadsheet => "Spreadsheet",
            FileCategory::Presentation => "Presentation",
            FileCategory::Code => "Code",
            FileCategory::Other => "Other",
        }
    }
}

/// Represents a file item with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileItem {
    pub path: String,
    pub name: String,
    pub extension: String,
    pub category: FileCategory,
    pub last_modified: i64, // Unix timestamp in milliseconds
    pub size: u64,
}

impl FileItem {
    /// Determine the category of a file based on its extension
    pub fn categorize(extension: &str) -> FileCategory {
        let ext = extension.to_lowercase();
        match ext.as_str() {
            // Documents
            "pdf" | "doc" | "docx" | "txt" | "rtf" | "odt" | "md" => FileCategory::Document,
            // Images
            "jpg" | "jpeg" | "png" | "gif" | "bmp" | "svg" | "webp" | "ico" | "tiff" => FileCategory::Image,
            // Videos
            "mp4" | "avi" | "mov" | "mkv" | "wmv" | "flv" | "webm" | "m4v" => FileCategory::Video,
            // Audio
            "mp3" | "wav" | "flac" | "aac" | "ogg" | "wma" | "m4a" => FileCategory::Audio,
            // Archives
            "zip" | "rar" | "7z" | "tar" | "gz" | "bz2" | "xz" => FileCategory::Archive,
            // Spreadsheets
            "xls" | "xlsx" | "csv" | "ods" | "numbers" => FileCategory::Spreadsheet,
            // Presentations
            "ppt" | "pptx" | "odp" | "key" => FileCategory::Presentation,
            // Code files
            "py" | "js" | "ts" | "rs" | "go" | "java" | "cpp" | "c" | "h" | "hpp" | 
            "cs" | "php" | "rb" | "swift" | "kt" | "scala" | "html" | "css" | 
            "json" | "xml" | "yaml" | "yml" | "toml" | "sh" | "bash" => FileCategory::Code,
            // Everything else
            _ => FileCategory::Other,
        }
    }
}

/// Scan files in the user's Documents, Downloads, and Desktop folders
/// Scans up to 3 levels deep and returns metadata for each file
#[tauri::command]
pub fn scan_files() -> Result<Vec<FileItem>, String> {
    let mut files: Vec<FileItem> = Vec::new();
    
    // Get user directories
    let home_dir = match dirs::home_dir() {
        Some(dir) => dir,
        None => return Err("Could not determine home directory".to_string()),
    };

    // Directories to scan
    let directories_to_scan = vec![
        home_dir.join("Documents"),
        home_dir.join("Downloads"),
        home_dir.join("Desktop"),
    ];

    for dir_path in directories_to_scan {
        if !dir_path.exists() {
            continue;
        }

        // Walk directory up to 3 levels deep
        for entry in WalkDir::new(&dir_path)
            .max_depth(3)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let path = entry.path();
            
            // Skip directories, only process files
            if !path.is_file() {
                continue;
            }

            // Skip hidden files and system files
            if path
                .file_name()
                .and_then(|n| n.to_str())
                .map(|n| n.starts_with('.'))
                .unwrap_or(false)
            {
                continue;
            }

            // Try to get file metadata, skip if we can't access it
            let metadata = match std::fs::metadata(path) {
                Ok(meta) => meta,
                Err(_) => continue, // Skip files we can't access (permission issues)
            };

            // Extract file information
            let file_path = path.to_string_lossy().to_string();
            let file_name = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("Unknown")
                .to_string();
            
            let extension = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("")
                .to_string();

            // Get last modified time as Unix timestamp in milliseconds
            let last_modified = metadata
                .modified()
                .ok()
                .and_then(|time| {
                    DateTime::<Utc>::from(time)
                        .timestamp_millis()
                        .try_into()
                        .ok()
                })
                .unwrap_or(0);

            let file_size = metadata.len();

            let file_item = FileItem {
                path: file_path,
                name: file_name,
                extension: extension.clone(),
                category: FileItem::categorize(&extension),
                last_modified,
                size: file_size,
            };

            files.push(file_item);
        }
    }

    // Sort by last modified date (newest first)
    files.sort_by(|a, b| b.last_modified.cmp(&a.last_modified));

    Ok(files)
}

/// Search files based on natural language query
/// Currently uses keyword matching - designed to be extended with AI embeddings
#[tauri::command]
pub fn search_files(query: String, files: Vec<FileItem>) -> Result<Vec<FileItem>, String> {
    if query.trim().is_empty() {
        return Ok(files);
    }

    let query_lower = query.to_lowercase();
    
    // Extract potential keywords from the query
    // This is a simple implementation - can be enhanced with NLP/AI
    let keywords: Vec<&str> = query_lower
        .split_whitespace()
        .filter(|word| word.len() > 2) // Ignore very short words
        .collect();

    let mut results: Vec<FileItem> = files
        .into_iter()
        .filter(|file| {
            let name_lower = file.name.to_lowercase();
            let path_lower = file.path.to_lowercase();
            let category_lower = file.category.display_name().to_lowercase();
            let extension_lower = file.extension.to_lowercase();

            // Check if any keyword matches filename, path, category, or extension
            keywords.iter().any(|keyword| {
                name_lower.contains(*keyword)
                    || path_lower.contains(*keyword)
                    || category_lower.contains(*keyword)
                    || extension_lower.contains(*keyword)
            })
        })
        .collect();

    // Limit to top 50 results
    results.truncate(50);

    // Sort by relevance (simple: prioritize name matches over path matches)
    results.sort_by(|a, b| {
        let a_name_match = a.name.to_lowercase().contains(&query_lower);
        let b_name_match = b.name.to_lowercase().contains(&query_lower);
        
        if a_name_match && !b_name_match {
            std::cmp::Ordering::Less
        } else if !a_name_match && b_name_match {
            std::cmp::Ordering::Greater
        } else {
            // Secondary sort by last modified (newer first)
            b.last_modified.cmp(&a.last_modified)
        }
    });

    Ok(results)
}

// Future enhancement: Local AI integration points
// 
// 1. Embedding Model Integration:
//    - Use models like all-MiniLM-L6-v2 via candle-transformers
//    - Generate embeddings for file names and paths
//    - Store in a vector database (qdrant, chroma, or sqlite-vss)
//
// 2. Natural Language Processing:
//    - Parse temporal expressions ("last week", "yesterday")
//    - Extract entities (dates, file types, categories)
//    - Use crate: time-parser or custom regex patterns
//
// 3. Semantic Search:
//    - Convert query to embedding
//    - Perform similarity search in vector database
//    - Combine with keyword matching for hybrid search
//
// Example future implementation:
// 
// #[tauri::command]
// pub fn search_files_ai(query: String, files: Vec<FileItem>) -> Result<Vec<FileItem>, String> {
//     // Load pre-computed embeddings from vector store
//     // Generate embedding for query
//     // Perform cosine similarity search
//     // Return top 50 most similar files
//     todo!("Implement with local AI model")
// }
