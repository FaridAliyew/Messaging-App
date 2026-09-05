import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
  console.log(`[server]: Health check accessible at http://localhost:${PORT}/api/health`);
});
