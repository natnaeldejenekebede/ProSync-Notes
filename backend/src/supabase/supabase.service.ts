import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') || '';
    const serviceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY') || '';
    this.client = createClient(url, serviceKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
