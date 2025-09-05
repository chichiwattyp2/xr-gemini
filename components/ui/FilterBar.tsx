import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: { searchTerm: string; tags: string[], devices: string[] }) => void;
  onSortChange: (sortBy: string) => void;
}

const TAG_FILTERS = ['6DoF', 'MR-Ready', '120fps', '240fps'];
const DEVICE_FILTERS = {
    'Quest': 'quest',
    'Android XR': 'android_xr',
    'PCVR': 'pcvr'
};

const FilterChip: React.FC<{ label: string, isSelected: boolean, onClick: () => void }> = ({ label, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors focus-ring ${
            isSelected 
            ? 'bg-accent-blue text-black font-semibold' 
            : 'bg-gray-700/50 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({ 
        searchTerm, 
        tags: selectedTags.map(t => t.toLowerCase().replace('-', '')), 
        devices: selectedDevices
    });
  }, [searchTerm, selectedTags, selectedDevices, onFilterChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  
  const toggleDevice = (device: string) => {
    setSelectedDevices(prev => prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device]);
  };

  return (
    <div className="sticky top-[65px] z-40 p-4 glass rounded-2xl space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search experiences..."
            className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border border-white/10 rounded-lg py-2 px-4 bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="trending">Trending</option>
        </select>
      </div>
       <div className="flex flex-wrap gap-2 items-center">
         <span className="text-sm font-semibold mr-2">Tags:</span>
         {TAG_FILTERS.map(tag => (
            <FilterChip key={tag} label={tag} isSelected={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}/>
         ))}
         <span className="text-sm font-semibold mr-2 ml-4">Devices:</span>
         {Object.entries(DEVICE_FILTERS).map(([label, value]) => (
            <FilterChip key={value} label={label} isSelected={selectedDevices.includes(value)} onClick={() => toggleDevice(value)}/>
         ))}
       </div>
    </div>
  );
};

export default FilterBar;
