'use client';
import LeftSidebar from '@/components/leftsidebar';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

const DefaultNumModelSelector = () => {
  // Initialize state with default value '1'
  const [numModels, setNumModels] = useState('3');

  // On component mount, check localStorage for a stored value
  useEffect(() => {
    const storedNum = localStorage.getItem('settings_numModels');
    if (storedNum) {
      setNumModels(storedNum);
    } else {
      setNumModels('3');
      localStorage.setItem('settings_numModels', '3');
    }
  }, []);

  // Handle selection changes
  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    setNumModels(selectedValue);
    localStorage.setItem('settings_numModels', selectedValue);
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
      </select>
    </div>
  );
};

export default function Settings() {
  return (
    <div className="flex flex-row w-full">
      <LeftSidebar />
      <div className="w-[calc(100dvw-56px)]">
        <div className="flex flex-col p-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <DefaultNumModelSelector />
        </div>
      </div>
    </div>
  );
}
