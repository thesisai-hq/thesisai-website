import { post } from './client';
import { getToken, getStoredEmail } from '../token';
import type {
  AiMessage,
  AiCitation,
  AiChatRequest,
  AiChatResponse,
  AgentResult,
  AgentBundle,
  AiContextResponse,
  AiThesisCard,
  AiThesisCardsResponse,
  StreamChunk,
} from '@thesis-ai/api-types';
import { MOCK_AI_CONTEXT, MOCK_THESIS_CARDS } from '../mock-data';

export type {
  AiMessage,
  AiCitation,
  AiChatRequest,
  AiChatResponse,
  AgentResult,
  AgentBundle,
  AiContextResponse,
  AiThesisCard,
  AiThesisCardsResponse,
  StreamChunk,
};

export function sendChat(request: AiChatRequest): Promise<AiChatResponse> {
  return post<AiChatResponse>('/v1/ai/chat', request);
}

export async function getAiContext(
  symbols: string[],
  prompt = 'Analyze my watchlist and provide a market brief.',
): Promise<AiContextResponse> {
  try {
    return await post<AiContextResponse>('/v1/ai/context', {
      messages: [{ role: 'user', content: prompt }],
      symbols,
    });
  } catch {
    return {
      ...MOCK_AI_CONTEXT,
      agents: MOCK_AI_CONTEXT.agents
        ? { ...MOCK_AI_CONTEXT.agents, symbols }
        : null,
    };
  }
}

export async function getAiThesisCards(symbols: string[]): Promise<AiThesisCardsResponse> {
  try {
    return await post<AiThesisCardsResponse>('/v1/ai/thesis-cards', {
      messages: [{ role: 'user', content: 'Generate thesis cards for my watchlist symbols.' }],
      symbols,
    });
  } catch {
    const cards = MOCK_THESIS_CARDS.cards.filter((c) =>
      symbols.length === 0 || symbols.map((s) => s.toUpperCase()).includes(c.symbol)
    );
    return { ...MOCK_THESIS_CARDS, cards };
  }
}

export async function* streamChat(
  request: AiChatRequest,
): AsyncGenerator<StreamChunk, void, unknown> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  const email = getStoredEmail();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (email) headers['X-User-Email'] = email;

  const response = await fetch(`${BASE_URL}/v1/ai/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let pendingEventType: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        pendingEventType = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed: unknown = JSON.parse(data);
          if (pendingEventType === 'conversation_id') {
            yield { conversation_id: parsed as string };
          } else if (pendingEventType === null || pendingEventType === '') {
            yield parsed as StreamChunk;
          }
        } catch { /* non-JSON lines skipped */ }
        pendingEventType = null;
      } else if (line === '') {
        pendingEventType = null;
      }
    }
  }
}
