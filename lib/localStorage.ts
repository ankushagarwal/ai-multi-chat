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
