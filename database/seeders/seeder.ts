import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OllamaEmbeddings } from '@langchain/ollama';
import { OpenAIEmbeddings } from '@langchain/openai';
import mongoose from 'mongoose';
import { FestivalSchema } from '../../src/festival/schema/festival.entity';

type FestivalSeed = {
  title: string;
  category: string;
  description: string;
  location: string;
  price: number;
};

function getEmbeddings() {
  const provider = process.env.EMBEDDING_PROVIDER;

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is missing. Set it before using the openai provider.',
      );
    }

    return new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey,
    });
  }

  return new OllamaEmbeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL ?? 'nomic-embed-text',
    baseUrl: process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434',
  });
}

function toEmbeddingText(festival: FestivalSeed) {
  return [
    festival.title,
    festival.category,
    festival.location,
    festival.description,
  ].join('\n');
}

async function main() {
  const mongoUri =
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB ?? 'ai';
  const jsonPath = join(__dirname, 'json', 'mock-festival.json');
  const raw = await readFile(jsonPath, 'utf8');
  const festivals = JSON.parse(raw) as FestivalSeed[];
  const embeddings = getEmbeddings();
  const vectors = await embeddings.embedDocuments(festivals.map(toEmbeddingText));
  const festivalDocuments = festivals.map((festival, index) => ({
    ...festival,
    vector: vectors[index],
  }));

  await mongoose.connect(mongoUri, { dbName });

  const FestivalModel =
    mongoose.models.Festival ??
    mongoose.model('Festival', FestivalSchema, 'festivals');

  await FestivalModel.deleteMany({});
  const inserted = await FestivalModel.insertMany(festivalDocuments);

  console.log(`Seeded ${inserted.length} festival records into ${dbName}.`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Seeder failed:', error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
