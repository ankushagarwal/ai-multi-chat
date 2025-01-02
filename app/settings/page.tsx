'use client';
import LeftSidebar from '@/components/leftsidebar';
import { Label } from '@/components/ui/label';
import { setNumModelsLocalStorage } from '@/lib/localStorage';
import { useState, useEffect } from 'react';

const DefaultNumModelSelector = () => {
  // Initialize state with default value '1'
  const [numModels, setNumModels] = useState('3');

  // On component mount, check localStorage for a stored value
  useEffect(() => {
    const storedNum = localStorage.getItem('settings_numModels');
    if (storedNum) {
      setNumModels(storedNum);
      setNumModelsLocalStorage(Number.parseInt(storedNum));
    } else {
      setNumModels('3');
      setNumModelsLocalStorage(3);
    }
  }, []);

  // Handle selection changes
  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    setNumModels(selectedValue);
    setNumModelsLocalStorage(Number.parseInt(selectedValue));
  };

  return (
    <div className="flex items-center mt-4">
      <Label htmlFor="defaultModels" className="mr-2">
        Default Number of Models:
      </Label>
      <select
        id="defaultModels"
        className="p-1 border border-gray-500 rounded-md w-auto"
        value={numModels}
        onChange={handleChange}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>
  );
};

export default function Settings() {
  return (
    <div className="flex flex-row w-full">
      <div className="w-full">
        <div className="flex flex-col p-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <DefaultNumModelSelector />
        </div>
      </div>
    </div>
  );
}
