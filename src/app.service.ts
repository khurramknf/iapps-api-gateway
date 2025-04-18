// services/api-gateway/backend/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  async proxyRequest(service: string, endpoint: string, data?: any) {
    const serviceUrl = this.configService.get(`${service.toUpperCase()}_SERVICE_URL`);
    if (!serviceUrl) {
      throw new Error(`${service} service URL not configured`);
    }

    try {
      const url = `${serviceUrl}/${endpoint}`;
      const response = await axios({
        method: data ? 'post' : 'get',
        url,
        data
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error(`${service} service is unavailable`);
    }
  }
}
