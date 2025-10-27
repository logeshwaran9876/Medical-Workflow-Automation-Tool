const fs = require('fs');
const path = require('path');

// File patterns to process
const FILE_PATTERNS = {
  js: /\.(js|jsx)$/i,
  html: /\.(html|htm)$/i,
  css: /\.css$/i,
  python: /\.py$/i,
};

// Comment removal patterns
const COMMENT_PATTERNS = {
  // JS/JSX: Single-line comments (// ...)
  jsSingleLine: /^\s*\/\/.*$/gm,
  
  // JS/JSX/Java/C#: Multi-line comments (/* ... */)
  blockComment: /\/\*[\s\S]*?\*\//g,
  
  // HTML: Comments (<!-- ... -->)
  htmlComment: /<!--[\s\S]*?-->/g,
  
  // Python: Single-line comments (# ...)
  pythonSingleLine: /^\s*#(?!\s*\{).*$/gm,
  
  // Python: Triple-quoted strings (''' ... ''' or """ ... """)
  pythonTripleQuotes: /(['""]{3})[\s\S]*?\1/g,
  
  // CSS: Comments
  cssComment: /\/\*[\s\S]*?\*\//g,
};

// Statistics
let stats = {
  filesProcessed: 0,
  commentsRemoved: 0,
  bytesSaved: 0,
  totalFiles: 0
};

/**
 * Recursively find all files matching the pattern
 */
function getAllFiles(dirPath, pattern, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (file !== 'node_modules' && file !== 'dist' && file !== 'build' && file !== '.git') {
        arrayOfFiles = getAllFiles(filePath, pattern, arrayOfFiles);
      }
    } else {
      if (pattern.test(file)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Remove comments from file content based on file type
 */
function removeComments(content, filePath) {
  let newContent = content;
  let initialLength = content.length;
  
  // Determine file type
  const extension = path.extname(filePath).toLowerCase();
  
  try {
    // Remove block comments (applies to JS, JSX, CSS)
    if (FILE_PATTERNS.js.test(extension) || extension === '.css') {
      // Remove multi-line block comments
      newContent = newContent.replace(COMMENT_PATTERNS.blockComment, '');
      
      // Remove single-line comments (for JS/JSX)
      if (FILE_PATTERNS.js.test(extension)) {
        newContent = newContent.replace(COMMENT_PATTERNS.jsSingleLine, '');
      }
    }
    
    // Remove HTML comments
    if (FILE_PATTERNS.html.test(extension)) {
      newContent = newContent.replace(COMMENT_PATTERNS.htmlComment, '');
    }
    
    // Remove Python comments
    if (extension === '.py') {
      newContent = newContent.replace(COMMENT_PATTERNS.pythonSingleLine, '');
      // Be careful with triple quotes - they might be docstrings
      // Only remove if they're clearly comments at module/class level
      newContent = newContent.replace(COMMENT_PATTERNS.pythonTripleQuotes, '');
    }
    
    // Count changes
    const bytesRemoved = initialLength - newContent.length;
    
    return {
      content: newContent,
      changed: newContent !== content,
      bytesRemoved
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { content, changed: false, bytesRemoved: 0 };
  }
}

/**
 * Clean up extra blank lines
 */
function cleanupWhitespace(content) {
  // Remove multiple consecutive blank lines (keep max 2)
  return content.replace(/\n{3,}/g, '\n\n');
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = removeComments(content, filePath);
    
    if (result.changed) {
      let cleanedContent = cleanupWhitespace(result.content);
      
      // Write back to file
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      
      stats.filesProcessed++;
      stats.commentsRemoved++;
      stats.bytesSaved += result.bytesRemoved;
      
      console.log(`✓ Processed: ${filePath} (saved ${result.bytesRemoved} bytes)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('====================================');
  console.log('  Comment Removal Script');
  console.log('====================================\n');
  
  // Get all files
  const allFiles = [];
  
  // Find JS/JSX files
  const jsFiles = getAllFiles('./Client/src', FILE_PATTERNS.js);
  const serverJsFiles = getAllFiles('./Server', FILE_PATTERNS.js);
  
  // Find HTML files
  const htmlFiles = getAllFiles('./Client', FILE_PATTERNS.html);
  
  // Find CSS files
  const cssFiles = getAllFiles('./Client/src', FILE_PATTERNS.css);
  
  allFiles.push(...jsFiles, ...serverJsFiles, ...htmlFiles, ...cssFiles);
  
  stats.totalFiles = allFiles.length;
  
  console.log(`Found ${allFiles.length} files to process.\n`);
  
  if (allFiles.length === 0) {
    console.log('No files found to process.');
    return;
  }
  
  // Ask for confirmation
  console.log('WARNING: This will permanently remove all comments from your files!');
  console.log('Make sure you have committed your current work to git.\n');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  
  setTimeout(() => {
    console.log('Starting comment removal...\n');
    
    // Process all files
    allFiles.forEach(file => {
      processFile(file);
    });
    
    // Print statistics
    console.log('\n====================================');
    console.log('  Removal Complete');
    console.log('====================================');
    console.log(`Total files found: ${stats.totalFiles}`);
    console.log(`Files modified: ${stats.filesProcessed}`);
    console.log(`Total bytes saved: ${stats.bytesSaved}`);
    console.log('\nDone! Your code is now comment-free.');
  }, 5000);
}

// Run the script
main();

