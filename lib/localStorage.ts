export const getNumModels = () => {
  if (typeof window === 'undefined') {
    return 3;
  }
  const numModels = localStorage.getItem('settings_numModels');
  return numModels ? Number.parseInt(numModels) : 3;
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
    setModelIndex(2, 'gpt-4o-mini');
    setModelIndex(3, 'gpt-4o');
    setModelIndex(4, 'gpt-4o-mini');
    setModelIndex(5, 'gpt-4o');
    return [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4o',
    ].slice(0, getNumModels());
  }
  const models = JSON.parse(modelNames);
  return models.slice(0, getNumModels());
};