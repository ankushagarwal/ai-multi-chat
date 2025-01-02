export const getNumModels = () => {
  if (typeof window === 'undefined') {
    return 3;
  }
  const numModels = localStorage.getItem('settings_numModels');
  return numModels ? Number.parseInt(numModels) : 3;
};

export const setNumModelsLocalStorage = (numModels: number) => {
  console.log('setNumModelsLocalStorage', numModels);
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('settings_numModels', numModels.toString());
  const modelNames = localStorage.getItem('settings_modelNames');
  const models = modelNames ? JSON.parse(modelNames) : [];

  while (models.length < numModels) {
    models.push('gpt-4o-mini');
  }

  localStorage.setItem('settings_modelNames', JSON.stringify(models));
};

export const setModelIndex = (index: number, model: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  console.log('setModelIndex', index, model);
  const modelNames = localStorage.getItem('settings_modelNames');
  const models = modelNames ? JSON.parse(modelNames) : [];

  while (models.length <= index) {
    models.push(model);
  }

  models[index] = model;
  localStorage.setItem('settings_modelNames', JSON.stringify(models));
};

export const getModels = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const modelNames = localStorage.getItem('settings_modelNames');
  if (!modelNames) {
    setModelIndex(0, 'gpt-4o-mini');
    setModelIndex(1, 'gpt-4o');
    setModelIndex(2, 'gemini-1.5-flash');
    setModelIndex(3, 'gemini-1.5-pro');
    setModelIndex(4, 'deepseek/deepseek-chat');
    setModelIndex(5, 'gpt-4o-mini');
    return [
      'gpt-4o-mini',
      'gpt-4o',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'deepseek/deepseek-chat',
      'gpt-4o-mini',
    ].slice(0, getNumModels());
  }
  const models = JSON.parse(modelNames);
  return models.slice(0, getNumModels());
};

//////////////////////////////////////////////////////////////////////////////////
// Conversation storage //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Define the structure of a Message
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Define the structure of a Chat
interface Chat {
  modelId: string;
  messages: Message[];
}

// Define the structure of a Conversation with a creation timestamp
interface Conversation {
  id: string;
  title: string;
  chats: Chat[];
  createdAt: number; // Unix timestamp in milliseconds
}

// Key used to store conversations in local storage
const CONVERSATIONS_KEY = 'conversations';

// Retrieve all conversations from local storage
const getAllConversations = (): { [id: string]: Conversation } => {
  if (typeof window === 'undefined') {
    return {};
  }
  const data = localStorage.getItem(CONVERSATIONS_KEY);
  return data ? JSON.parse(data) : {};
};

// Save all conversations to local storage
const saveAllConversations = (conversations: {
  [id: string]: Conversation;
}) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

// Generate a unique ID for a new conversation
const generateUniqueId = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Creates a new conversation with the given title.
 * @param title The title of the new conversation.
 * @returns The ID of the newly created conversation.
 */
export const createConversation = (title: string): string => {
  const id = generateUniqueId();
  const newConversation: Conversation = {
    id,
    title,
    chats: [],
    createdAt: Date.now(), // Set the creation timestamp
  };

  const conversations = getAllConversations();
  conversations[id] = newConversation;
  saveAllConversations(conversations);

  return id;
};

/**
 * Updates a conversation with the given ID.
 * @param id The ID of the conversation to update.
 * @param updatedFields The fields to update in the conversation.
 * @param chatIndex Optional index to update a specific chat in the chats array.
 * @returns A boolean indicating whether the update was successful.
 */
export const updateConversation = (
  id: string,
  updatedFields: Partial<Pick<Conversation, 'title' | 'chats'>>,
  chatIndex?: number,
): boolean => {
  console.log('updateConversation', id, updatedFields, chatIndex);

  const conversations = getAllConversations();
  const conversation = conversations[id];

  if (!conversation) {
    console.warn(`Conversation with id ${id} not found.`);
    return false;
  }

  // Update only the provided fields
  if (updatedFields.title !== undefined) {
    conversation.title = updatedFields.title;
  }

  if (updatedFields.chats !== undefined) {
    if (chatIndex !== undefined && Array.isArray(conversation.chats)) {
      // Update a specific chat at the given index
      if (conversation.chats.length <= chatIndex) {
        for (let i = conversation.chats.length; i <= chatIndex; i++) {
          conversation.chats[i] = {
            modelId: '',
            messages: [],
          };
        }
      }
      conversation.chats[chatIndex] = updatedFields.chats[0];
    } else {
      // Replace the entire chats array
      conversation.chats = updatedFields.chats;
    }
  }

  conversations[id] = conversation;
  saveAllConversations(conversations);

  return true;
};

/**
 * Retrieves all conversations sorted by their start time (ascending).
 * @returns An array of conversations sorted by creation time.
 */
export const getAllConversationsSorted = (): Conversation[] => {
  const conversations = getAllConversations();
  const conversationArray = Object.values(conversations);

  // Sort conversations by createdAt in descending order (latest first)
  conversationArray.sort((a, b) => b.createdAt - a.createdAt);

  return conversationArray;
};
