import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIEmbeddings } from '@langchain/openai';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Model } from 'mongoose';
import { Festival } from './schema/festival.entity';
import { CreateFestivalDto } from './dto/create-festival.dto';

@Injectable()
export class FestivalService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Festival.name)
    private readonly festivalModel: Model<Festival>,
  ) { }

  private getEmbeddings() {
    const provider = this.configService.get<string>('EMBEDDING_PROVIDER');

    if (provider === 'openai') {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');

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

    const ollamaBaseUrl = this.configService.get<string>(
      'OLLAMA_BASE_URL',
      'http://127.0.0.1:11434',
    );
    const ollamaModel = this.configService.get<string>(
      'OLLAMA_EMBEDDING_MODEL',
      'nomic-embed-text',
    );

    return new OllamaEmbeddings({
      model: ollamaModel,
      baseUrl: ollamaBaseUrl,
    });
  }

  async createFestival(dto: CreateFestivalDto) {
    const embeddings = this.getEmbeddings();
    const vector = await embeddings.embedQuery(dto.description);

    return this.festivalModel.create({
      title: dto.title,
      category: dto.category,
      description: dto.description,
      location: dto.location,
      price: dto.price,
      vector,
    });
  }

  async searchFestivals(userQuery: string, limit = 5) {

    try {
      const embeddings = this.getEmbeddings();
      const queryVector = await embeddings.embedQuery(userQuery);

      const data = await this.festivalModel.aggregate([
        {
          $vectorSearch: {
            index: 'autoembed_index',     // ชื่อ Index ที่คุณตั้งไว้ใน MongoDB Atlas
            path: 'vector',            // ชื่อฟิลด์ที่เก็บ Vector ใน Document
            queryVector: queryVector,  // Vector คำค้นหาของผู้ใช้
            numCandidates: 100,        // จำนวนเอกสารสูงสุดที่จะนำมาคำนวณเบื้องต้น
            limit: limit,              // จำนวนผลลัพธ์สูงสุดที่ต้องการส่งกลับ
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            score: { $meta: 'searchScore' },
          },
        },
      ]);
      return data

    }
    catch (e) {
      console.error(e)
    }

  }


}
