import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb+srv://gattushiva:gattushiva@cluster0.fjsmupv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db: Db;

export async function connectToDatabase(): Promise<Db> {
  try {
    await client.connect();
    db = client.db('swift');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}