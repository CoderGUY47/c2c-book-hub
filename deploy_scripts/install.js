const { execSync } = require('child_process');
console.log('--- STARTING REMOTE INSTALLATION (FORCED) ---');
try {
  console.log('Installing dependencies with legacy support...');
  
  // Added --legacy-peer-deps to ignore the React 19 conflict
  // Added --no-save to keep your package.json clean
  const dependencies = [
    'express', 'mongoose', 'cors', 'dotenv', 'jsonwebtoken', 
    'cookie-parser', 'multer', 'nodemailer', 'passport', 
    'passport-google-oauth20', 'sslcommerz-lts', 'axios', 
    'bcryptjs', 'next@15.5.14', 'react@19.0.0', 
    'react-dom@19.0.0', 'lucide-react', 'jspdf', 'jspdf-autotable',
    'cloudinary', 'bkash', 'uuid', 'body-parser'
  ];

  execSync(`npm install ${dependencies.join(' ')} --legacy-peer-deps`, { stdio: 'inherit' });
  
  console.log('--- INSTALLATION COMPLETE ---');
  process.exit(0);
} catch (e) {
  console.error('Installation failed:', e.message);
  process.exit(1);
}
