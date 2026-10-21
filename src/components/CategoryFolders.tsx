import React from 'react';
import { Category } from '../types/music';
import { Folder, ChevronRight, Flame, Plus, FolderPlus } from 'lucide-react';

interface CategoryFoldersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onOpenCreateCategory?: () => void;
}

export const CategoryFolders: React.FC<CategoryFoldersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenCreateCategory,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-emerald-700" />
          <span>Category Music Folders ({categories.length})</span>
        </h2>
        {onOpenCreateCategory && (
          <button
            type="button"
            onClick={onOpenCreateCategory}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 cursor-pointer transition shadow-2xs"
            title="Create new category in Admin Panel"
          >
            <FolderPlus className="w-3 h-3 text-emerald-700" />
            <span>+ Create Category (Option ON)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.name)}
              className={`cursor-pointer rounded-lg p-3 transition border text-left shadow-xs flex items-start justify-between select-none ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              <div className="overflow-hidden pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`} />
                  <h3 className="text-xs font-bold text-gray-800 hover:text-emerald-700 leading-snug">
                    {cat.name}
                  </h3>
                  {cat.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 ${
                        cat.badge === 'NEW'
                          ? 'bg-red-500 text-white'
                          : cat.badge === 'HOT'
                          ? 'bg-orange-500 text-white'
                          : cat.badge === 'BHAKTI'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 leading-normal">
                  {cat.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center text-[11px] text-gray-400 font-bold ml-1">
                <span>[{cat.count} Files</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                <span>]</span>
              </div>
            </div>
          );
        })}

        {/* Quick Create Category Card */}
        {onOpenCreateCategory && (
          <div
            onClick={onOpenCreateCategory}
            className="cursor-pointer rounded-lg p-3 transition border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-600 text-left shadow-2xs flex items-center justify-between select-none group"
            title="Create new music category folder"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-emerald-950 group-hover:underline">
                  + Create Category
                </h3>
                <p className="text-[10px] text-emerald-700">Admin create option ON</p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded uppercase shrink-0">
              ON
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
