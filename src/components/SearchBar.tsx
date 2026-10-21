import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../types/music';

interface SearchBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className="bg-white p-2.5 sm:p-3 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-2">
        {/* Category selector */}
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="text-xs border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:border-emerald-600 font-medium text-gray-700 sm:w-60"
        >
          <option value="all">All Categories & Folders</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>

        {/* Search query input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Searching song title, singer, dj/remixer (e.g. Kali Mai, Kamariya, Pawan Singh)..."
            className="w-full text-xs border border-gray-300 rounded pl-3 pr-8 py-2 focus:outline-none focus:border-emerald-600 text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs px-6 py-2 rounded transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};
