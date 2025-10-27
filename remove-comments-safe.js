const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File patterns to process
const FILE_PATTERNS = {
  js: /\.(js|jsx)$/i,
  html: /\.(html|htm)$/i,
  css: /\.css$/i,
};

// Comment removal patterns
const COMMENT_PATTERNS = {
  // JS/JSX: Single-line comments (// ...)
  jsSingleLine: /^\s*\/\/.*$/gm,
  
  // JS/JSX/CSS: Multi-line comments (/* ... */)
  blockComment: /\/\*[\s\S]*?\*\//g,
  
  // HTML: Comments (<!-- ... -->)
  htmlComment: /<!--[\s\S]*?-->/g,
};

// Statistics
const stats = {
  filesProcessed: 0,
  commentsRemoved: 0,
  bytesSaved: 0,
  totalFiles: 0
};

/**
 * Recursively find all files matching the pattern
 */
function getAllFiles(dirPath, pattern, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
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
      
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      
      stats.filesProcessed++;
      stats.commentsRemoved++;
      stats.bytesSaved += result.bytesRemoved;
      
      console.log(`✓ ${filePath} (${result.bytesRemoved} bytes saved)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`✗ Error: ${filePath} - ${error.message}`);
    return false;
  }
}

/**
 * Get user confirmation
 */
function getConfirmation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Do you want to proceed? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('====================================');
  console.log('  Comment Removal Script');
  console.log('====================================\n');
  
  // Get all files
  const allFiles = [];
  
  // Find files in Client and Server directories
  const clientSrcFiles = getAllFiles('./Client/src', FILE_PATTERNS.js);
  const clientHtmlFiles = getAllFiles('./Client', FILE_PATTERNS.html);
  const clientCssFiles = getAllFiles('./Client/src', FILE_PATTERNS.css);
  
  const serverJsFiles = getAllFiles('./Server', FILE_PATTERNS.js);
  
  allFiles.push(...clientSrcFiles, ...clientHtmlFiles, ...clientCssFiles, ...serverJsFiles);
  
  stats.totalFiles = allFiles.length;
  
  if (allFiles.length === 0) {
    console.log('No files found to process.');
    return;
  }
  
  console.log(`Found ${allFiles.length} files to process.\n`);
  console.log('WARNING: This will permanently remove all comments from your files!');
  console.log('Files that will be modified:');
  console.log('- JavaScript/JSX files (.js, .jsx)');
  console.log('- HTML files (.html)');
  console.log('- CSS files (.css)\n');
  
  const proceed = await getConfirmation();
  
  if (!proceed) {
    console.log('\nOperation cancelled.');
    return;
  }
  
  console.log('\nStarting comment removal...\n');
  
  // Process all files
  allFiles.forEach(file => {
    processFile(file);
  });
  
  // Print statistics
  console.log('\n====================================');
  console.log('  Removal Complete');
  console.log('====================================');
  console.log(`Total files scanned: ${stats.totalFiles}`);
  console.log(`Files modified: ${stats.filesProcessed}`);
  console.log(`Total bytes saved: ${(stats.bytesSaved / 1024).toFixed(2)} KB`);
  console.log('\n✓ Done! Your code is now comment-free.');
}

// Run the script
main().catch(console.error);

