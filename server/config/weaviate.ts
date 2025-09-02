import weaviate, { WeaviateClient } from 'weaviate-ts-client';

export interface WeaviateConfig {
  scheme: string;
  host: string;
  apiKey?: string;
}

export function createWeaviateClient(config?: WeaviateConfig): WeaviateClient {
  const defaultConfig: WeaviateConfig = {
    scheme: 'http',
    host: process.env.WEAVIATE_HOST || 'localhost:8080',
    apiKey: process.env.WEAVIATE_API_KEY
  };

  const finalConfig = { ...defaultConfig, ...config };

  const clientConfig: any = {
    scheme: finalConfig.scheme,
    host: finalConfig.host,
  };

  if (finalConfig.apiKey) {
    clientConfig.apiKey = new weaviate.ApiKey(finalConfig.apiKey);
  }

  return weaviate.client(clientConfig);
}

export async function checkWeaviateConnection(client: WeaviateClient): Promise<boolean> {
  try {
    const result = await client.misc.liveChecker().do();
    console.log('Weaviate connection status:', result);
    return true;
  } catch (error) {
    console.error('Weaviate connection failed:', error);
    return false;
  }
}

// Docker compose setup instructions for local development
export const WEAVIATE_DOCKER_SETUP = `
# Run this in your terminal to start Weaviate locally:
docker run -p 8080:8080 -e QUERY_DEFAULTS_LIMIT=25 -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true -e PERSISTENCE_DATA_PATH='/var/lib/weaviate' -e DEFAULT_VECTORIZER_MODULE='none' semitechnologies/weaviate:1.22.4

# Or use docker-compose (create docker-compose.yml):
version: '3.4'
services:
  weaviate:
    image: semitechnologies/weaviate:1.22.4
    ports:
      - 8080:8080
    restart: on-failure:0
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate'
      DEFAULT_VECTORIZER_MODULE: 'none'
      ENABLE_MODULES: ''
    volumes:
      - weaviate_data:/var/lib/weaviate
volumes:
  weaviate_data:
`;
