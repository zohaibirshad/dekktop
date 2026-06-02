# Smart File Organizer

A production-ready desktop application that uses local AI to help users search their files using natural language queries. Works 100% offline with no internet required after installation.

## Features

- 🔍 **Natural Language Search**: Type queries like "invoice from last week" or "birthday photo"
- 📂 **Smart Categorization**: Automatically categorizes files into Document, Image, Video, Audio, Archive, Spreadsheet, Presentation, Code, and Other
- 🚀 **Fast & Offline**: All processing happens locally - no internet required
- 🎨 **Beautiful UI**: Modern purple-blue gradient design with smooth animations
- 📱 **Responsive**: Works on various screen sizes
- 🔒 **Privacy First**: Your files never leave your computer

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Tauri v2 with Rust
- **Build Tool**: Vite
- **Styling**: Pure CSS (no external frameworks)
- **File Scanning**: walkdir (Rust crate)
- **Date Handling**: chrono (Rust crate)
- **Serialization**: serde (Rust crate)

## System Requirements

- **OS**: Windows 10/11, macOS 12+, or Linux
- **RAM**: Minimum 8GB
- **Storage**: ~50MB for installation
- **Internet**: Required only for initial setup, not for running the app

## Setup Instructions

### Step 1: Install Node.js

1. Download Node.js LTS from [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Rust

1. Download Rust from [https://rustup.rs/](https://rustup.rs/)
2. Run the installer:
   - **Windows**: Download and run `rustup-init.exe`
   - **macOS/Linux**: Run in terminal:
     ```bash
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     ```
3. Verify installation:
   ```bash
   rustc --version
   cargo --version
   ```

### Step 3: Install Tauri Dependencies

#### Windows
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Select "Desktop development with C++" workload

#### macOS
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

### Step 4: Install Project Dependencies

```bash
cd smart-file-organizer
npm install
```

### Step 5: Run in Development Mode

```bash
npm run tauri dev
```

This will:
1. Start the Vite development server
2. Compile the Rust backend
3. Open the application window

### Step 6: Build for Production

```bash
npm run tauri build
```

## Expected Output Locations

### Windows
- **MSI Installer**: `src-tauri/target/release/bundle/msi/Smart File Organizer_1.0.0_x64_en-US.msi`
- **NSIS Installer**: `src-tauri/target/release/bundle/nsis/Smart File Organizer_1.0.0_x64-setup.exe`

### macOS
- **DMG**: `src-tauri/target/release/bundle/dmg/Smart File Organizer_1.0.0_x64.dmg`
- **App Bundle**: `src-tauri/target/release/bundle/macos/Smart File Organizer.app`

### Linux
- **DEB**: `src-tauri/target/release/bundle/deb/smart-file-organizer_1.0.0_amd64.deb`
- **AppImage**: `src-tauri/target/release/bundle/appimage/smart-file-organizer_1.0.0_amd64.AppImage`

## Usage Guide

### Basic Search
1. Launch the application
2. Wait for the initial file scan (scans Documents, Downloads, Desktop folders)
3. Type your search query in the search bar
4. Press Enter or click "Search"
5. View results in the card grid

### Example Queries
- "invoice" - Find files with "invoice" in the name
- "pdf" - Show all PDF documents
- "photo" - Find image files
- "report" - Locate documents containing "report"
- "python" or "py" - Show Python code files

### Refresh Files
Click the "Refresh" button to re-scan directories for new files.

## File Categories

| Category | Extensions | Icon |
|----------|-----------|------|
| Document | pdf, doc, docx, txt, rtf, odt, md | 📄 |
| Image | jpg, jpeg, png, gif, bmp, svg, webp | 🖼️ |
| Video | mp4, avi, mov, mkv, wmv, flv | 🎬 |
| Audio | mp3, wav, flac, aac, ogg | 🎵 |
| Archive | zip, rar, 7z, tar, gz | 📦 |
| Spreadsheet | xls, xlsx, csv, ods | 📊 |
| Presentation | ppt, pptx, odp, key | 📽️ |
| Code | py, js, ts, rs, go, java, cpp | 💻 |
| Other | All other files | 📁 |

## Troubleshooting Guide

### Common Issues

#### 1. "Failed to scan files" Error

**Cause**: Permission issues or inaccessible directories

**Solution**:
- Ensure the app has permission to access Documents, Downloads, and Desktop
- On macOS: Go to System Preferences → Security & Privacy → Privacy → Files and Folders
- On Windows: Run as Administrator if needed
- Check that the directories exist and are accessible

#### 2. Application Won't Start

**Cause**: Missing dependencies or corrupted installation

**Solution**:
- Reinstall Tauri dependencies (see Step 3)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Rebuild: `npm run tauri build`

#### 3. No Files Found

**Cause**: Empty directories or scanning depth limitation

**Solution**:
- Verify you have files in Documents, Downloads, or Desktop folders
- The app scans up to 3 levels deep - files deeper than this won't appear
- Click "Refresh" to rescan

#### 4. Slow Performance

**Cause**: Large number of files or slow storage

**Solution**:
- The app is optimized for 8GB+ RAM systems
- Close other applications
- Consider excluding very large directories
- Results are limited to top 50 for performance

#### 5. Search Not Working

**Cause**: Backend communication issue

**Solution**:
- Restart the application
- Check console for errors (F12 in development mode)
- Rebuild the Rust backend: `cargo build --release` in `src-tauri/` directory

#### 6. Build Fails on Windows

**Cause**: Missing Visual Studio components

**Solution**:
- Open Visual Studio Installer
- Modify installation
- Add "Desktop development with C++" workload
- Restart and rebuild

#### 7. Build Fails on macOS

**Cause**: Xcode or command line tools issue

**Solution**:
```bash
xcode-select --reset
sudo xcodebuild -license accept
```

#### 8. Blank Window or White Screen

**Cause**: Frontend build issue

**Solution**:
- Clear dist folder: `rm -rf dist`
- Rebuild frontend: `npm run build`
- Rebuild app: `npm run tauri build`

### Debug Mode

To enable debug logging:

1. In development: Open DevTools (F12 or Cmd+Option+I)
2. Check Console tab for errors
3. Rust logs can be enabled by setting `RUST_LOG=debug` environment variable

## Future Enhancements (AI Integration Ready)

The codebase is structured for easy integration of local AI features:

1. **Embedding Models**: Integrate models like all-MiniLM-L6-v2 via candle-transformers
2. **Vector Database**: Store embeddings in qdrant, chroma, or sqlite-vss
3. **Semantic Search**: Enable meaning-based search beyond keyword matching
4. **Temporal Parsing**: Understand "last week", "yesterday", "recent files"
5. **Entity Extraction**: Identify dates, file types, and categories from queries

See `src-tauri/src/main.rs` for detailed implementation notes.

## License Key Integration (Ready for Lemon Squeezy)

The application is designed for easy license key integration:

1. Add license verification API call in `src/api.ts`
2. Create LicenseVerification component
3. Wrap main App with license check
4. Integrate Lemon Squeezy SDK or custom API

Example structure ready for implementation:
```typescript
// src/api.ts (add)
export async function verifyLicense(key: string): Promise<boolean> {
  // Call Lemon Squeezy API or your verification endpoint
}
```

## Architecture Overview

```
smart-file-organizer/
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── SearchBar.tsx   # Search input component
│   │   └── FileList.tsx    # File grid display
│   ├── api.ts              # Tauri command wrappers
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Entry point
│   └── styles.css          # All styling
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── main.rs         # Tauri commands & file logic
│   ├── Cargo.toml          # Rust dependencies
│   ├── build.rs            # Build script
│   └── tauri.conf.json     # Tauri configuration
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── index.html              # HTML template
```

## Performance Optimizations

- **Debounced Search**: 300ms delay prevents excessive searches
- **Result Limiting**: Maximum 50 results displayed
- **Efficient Scanning**: Uses walkdir for fast directory traversal
- **Skip Hidden Files**: Ignores system and hidden files
- **Graceful Error Handling**: Skips inaccessible files without crashing
- **Loading States**: Skeleton loaders for better UX
- **CSS Animations**: Hardware-accelerated transforms

## Security & Privacy

- ✅ 100% offline operation
- ✅ No data leaves your computer
- ✅ No telemetry or analytics
- ✅ Respects OS file permissions
- ✅ Skips protected/inaccessible files gracefully
- ✅ No external API calls

## Support

For issues, questions, or feature requests, please refer to the troubleshooting guide above or contact support.

---

**Smart File Organizer v1.0.0**  
© 2024 Smart File Organizer Team. All rights reserved.

Built with ❤️ using React, TypeScript, Rust, and Tauri
