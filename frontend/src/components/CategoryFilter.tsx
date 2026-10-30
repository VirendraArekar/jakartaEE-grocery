'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { LayoutGrid } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
          selectedCategoryId === null
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>All Items</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{cat.name}</span>
            {cat.productCount > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isSelected
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat.productCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

