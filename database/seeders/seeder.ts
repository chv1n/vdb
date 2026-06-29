import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import mongoose from 'mongoose';
import { FestivalSchema } from '../../src/festival/schema/festival.entity';

type FestivalSeed = {
  title: string;
  category: string;
  description: string;
  location: string;
  price: number;
};

async function main() {
  const mongoUri =
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB ?? 'ai';
  const jsonPath = join(__dirname, 'json', 'mock-festival.json');
  const raw = await readFile(jsonPath, 'utf8');
  const festivals = JSON.parse(raw) as FestivalSeed[];

  await mongoose.connect(mongoUri, { dbName });

  const FestivalModel =
    mongoose.models.Festival ??
    mongoose.model('Festival', FestivalSchema, 'festivals');

  await FestivalModel.deleteMany({});
  const inserted = await FestivalModel.insertMany(festivals);

  console.log(`Seeded ${inserted.length} festival records into ${dbName}.`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Seeder failed:', error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
