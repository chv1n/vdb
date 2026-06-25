import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { OpenAIEmbeddings } from '@langchain/openai';
import { OllamaEmbeddings } from '@langchain/ollama';

@Injectable()
export class FestivalService {
  constructor(private readonly configService: ConfigService) {}

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

  create(createFestivalDto: CreateFestivalDto) {
    return 'This action adds a new festival';
  }

  async findAll() {
    const text = 'travel chiang mai';
    const embeddings = this.getEmbeddings();
    const vector = await embeddings.embedQuery(text);
    console.log('VECTOR', vector);
    return vector;
  }


}
