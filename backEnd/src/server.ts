import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './infrastructure/database/MongoConnection.js';

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) throw new Error('MONGO_URI is required');

await connectDatabase(mongoUri);

const app = createApp();
app.listen(port, () => {
  console.log(`PDF backend running on http://localhost:${port}`);
});
