import { get, del } from './client';
import type {
  ConversationSummary,
  ConversationListResponse,
  ChatMessageItem,
  ConversationMessagesResponse,
} from '@thesis-ai/api-types';

export type {
  ConversationSummary,
  ConversationListResponse,
  ChatMessageItem,
  ConversationMessagesResponse,
};

export function getConversations(): Promise<ConversationListResponse> {
  return get<ConversationListResponse>('/v1/ai/conversations');
}

export function getConversationMessages(id: string): Promise<ConversationMessagesResponse> {
  return get<ConversationMessagesResponse>(`/v1/ai/conversations/${id}`);
}

export function deleteConversation(id: string): Promise<void> {
  return del<void>(`/v1/ai/conversations/${id}`);
}
