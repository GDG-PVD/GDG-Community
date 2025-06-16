/**
 * Script to verify and update Firebase configuration
 * 
 * This script checks your existing Firebase configuration in .env.local
 * and helps update it with new values if needed.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the .env.local file
const envFilePath = path.resolve(__dirname, '../src/ui/.env.local');

// Function to read the current configuration
function readCurrentConfig() {
  try {
    if (fs.existsSync(envFilePath)) {
      const envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Parse the environment variables
      const config = {};
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            config[key.trim()] = value.trim();
          }
        }
      }
      
      return config;
    }
  } catch (error) {
    console.error('Error reading .env.local file:', error);
  }
  
  return {};
}

// Function to update the configuration
function updateConfig(config) {
  try {
    let envContent = '';
    
    // Add Firebase configuration
    envContent += '# Firebase Configuration\n';
    envContent += `REACT_APP_FIREBASE_API_KEY=${config.REACT_APP_FIREBASE_API_KEY || ''}\n`;
    envContent += `REACT_APP_FIREBASE_AUTH_DOMAIN=${config.REACT_APP_FIREBASE_AUTH_DOMAIN || ''}\n`;
    envContent += `REACT_APP_FIREBASE_PROJECT_ID=${config.REACT_APP_FIREBASE_PROJECT_ID || ''}\n`;
    envContent += `REACT_APP_FIREBASE_STORAGE_BUCKET=${config.REACT_APP_FIREBASE_STORAGE_BUCKET || ''}\n`;
    envContent += `REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || ''}\n`;
    envContent += `REACT_APP_FIREBASE_APP_ID=${config.REACT_APP_FIREBASE_APP_ID || ''}\n`;
    
    if (config.REACT_APP_FIREBASE_MEASUREMENT_ID) {
      envContent += `REACT_APP_FIREBASE_MEASUREMENT_ID=${config.REACT_APP_FIREBASE_MEASUREMENT_ID}\n`;
    }
    
    // Add API configuration
    envContent += '\n# API Configuration\n';
    envContent += `REACT_APP_API_BASE_URL=${config.REACT_APP_API_BASE_URL || 'https://api.gdgcompanion.dev'}\n`;
    
    // Add feature flags
    envContent += '\n# Feature Flags\n';
    envContent += `REACT_APP_MOCK_AUTH_ENABLED=${config.REACT_APP_MOCK_AUTH_ENABLED || 'false'}\n`;
    envContent += `REACT_APP_USE_EMULATORS=${config.REACT_APP_USE_EMULATORS || 'false'}\n`;
    
    // Write the updated configuration
    fs.writeFileSync(envFilePath, envContent);
    console.log(`\nConfiguration updated successfully: ${envFilePath}`);
  } catch (error) {
    console.error('Error updating configuration:', error);
  }
}

// Function to prompt for a new value
function promptForValue(key, currentValue) {
  return new Promise((resolve) => {
    rl.question(`${key} [${currentValue || 'not set'}]: `, (answer) => {
      resolve(answer.trim() || currentValue || '');
    });
  });
}

// Main function
async function main() {
  console.log('Firebase Configuration Verifier\n');
  
  // Read the current configuration
  const currentConfig = readCurrentConfig();
  
  console.log('Current Firebase Configuration:');
  console.log('------------------------------');
  
  if (currentConfig.REACT_APP_FIREBASE_API_KEY) {
    console.log(`API Key: ${currentConfig.REACT_APP_FIREBASE_API_KEY.substring(0, 5)}...`);
  } else {
    console.log('API Key: not set');
  }
  
  console.log(`Auth Domain: ${currentConfig.REACT_APP_FIREBASE_AUTH_DOMAIN || 'not set'}`);
  console.log(`Project ID: ${currentConfig.REACT_APP_FIREBASE_PROJECT_ID || 'not set'}`);
  console.log(`Storage Bucket: ${currentConfig.REACT_APP_FIREBASE_STORAGE_BUCKET || 'not set'}`);
  console.log(`Messaging Sender ID: ${currentConfig.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'not set'}`);
  console.log(`App ID: ${currentConfig.REACT_APP_FIREBASE_APP_ID || 'not set'}`);
  console.log(`Mock Auth Enabled: ${currentConfig.REACT_APP_MOCK_AUTH_ENABLED || 'false'}`);
  console.log(`Use Emulators: ${currentConfig.REACT_APP_USE_EMULATORS || 'false'}`);
  
  console.log('\nWould you like to update the configuration? (y/n)');
  
  rl.question('> ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const updatedConfig = { ...currentConfig };
      
      console.log('\nEnter new values (press Enter to keep current value):');
      
      // Prompt for each value
      updatedConfig.REACT_APP_FIREBASE_API_KEY = await promptForValue('API Key', currentConfig.REACT_APP_FIREBASE_API_KEY);
      updatedConfig.REACT_APP_FIREBASE_AUTH_DOMAIN = await promptForValue('Auth Domain', currentConfig.REACT_APP_FIREBASE_AUTH_DOMAIN);
      updatedConfig.REACT_APP_FIREBASE_PROJECT_ID = await promptForValue('Project ID', currentConfig.REACT_APP_FIREBASE_PROJECT_ID);
      updatedConfig.REACT_APP_FIREBASE_STORAGE_BUCKET = await promptForValue('Storage Bucket', currentConfig.REACT_APP_FIREBASE_STORAGE_BUCKET);
      updatedConfig.REACT_APP_FIREBASE_MESSAGING_SENDER_ID = await promptForValue('Messaging Sender ID', currentConfig.REACT_APP_FIREBASE_MESSAGING_SENDER_ID);
      updatedConfig.REACT_APP_FIREBASE_APP_ID = await promptForValue('App ID', currentConfig.REACT_APP_FIREBASE_APP_ID);
      updatedConfig.REACT_APP_FIREBASE_MEASUREMENT_ID = await promptForValue('Measurement ID (optional)', currentConfig.REACT_APP_FIREBASE_MEASUREMENT_ID);
      
      // Feature flags
      updatedConfig.REACT_APP_MOCK_AUTH_ENABLED = await promptForValue('Mock Auth Enabled (true/false)', currentConfig.REACT_APP_MOCK_AUTH_ENABLED || 'false');
      updatedConfig.REACT_APP_USE_EMULATORS = await promptForValue('Use Emulators (true/false)', currentConfig.REACT_APP_USE_EMULATORS || 'false');
      
      // Update the configuration
      updateConfig(updatedConfig);
    } else {
      console.log('Configuration not updated.');
    }
    
    rl.close();
  });
}

// Run the main function
main();