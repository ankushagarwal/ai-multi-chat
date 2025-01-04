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

// database.ts
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  modelId: string;
  messages: Message[];
}

export interface Conversation {
  id: string;
  title: string;
  chats: Chat[];
  createdAt: number;
}

const DB_NAME = 'ChatApp';
const STORE_NAME = 'conversations';
const DB_VERSION = 1;

// Initialize database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
  });
};

// Generate a unique ID
const generateUniqueId = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Create a new conversation
export const createConversation = async (title: string): Promise<string> => {
  const db = await initDB();
  const id = generateUniqueId();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const newConversation: Conversation = {
      id,
      title,
      chats: [],
      createdAt: Date.now(),
    };

    const request = store.add(newConversation);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

// Update a conversation
export const updateConversation = async (
  id: string,
  updatedFields: Partial<Pick<Conversation, 'title' | 'chats'>>,
  chatIndex?: number,
): Promise<boolean> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const conversation = getRequest.result;
      if (!conversation) {
        resolve(false);
        return;
      }

      if (updatedFields.title !== undefined) {
        conversation.title = updatedFields.title;
      }

      if (updatedFields.chats !== undefined) {
        if (chatIndex !== undefined && Array.isArray(conversation.chats)) {
          if (conversation.chats.length <= chatIndex) {
            for (let i = conversation.chats.length; i <= chatIndex; i++) {
              conversation.chats[i] = { modelId: '', messages: [] };
            }
          }
          conversation.chats[chatIndex] = updatedFields.chats[0];
        } else {
          conversation.chats = updatedFields.chats;
        }
      }

      const updateRequest = store.put(conversation);
      updateRequest.onsuccess = () => resolve(true);
      updateRequest.onerror = () => reject(updateRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

// Get all conversations sorted by creation time
export const getAllConversationsSorted = async (): Promise<Conversation[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('createdAt');

    const request = index.getAll();

    request.onsuccess = () => {
      const conversations = request.result;
      conversations.sort((a, b) => b.createdAt - a.createdAt);
      resolve(conversations);
    };

    request.onerror = () => reject(request.error);
  });
};

// Get a single conversation
export const getConversation = async (
  id: string,
): Promise<Conversation | null> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};
