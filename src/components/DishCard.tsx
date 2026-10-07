import React, { useState } from 'react';
import { Plus, Clock, Star, Edit3, Utensils } from 'lucide-react';
import { Dish } from '../types';
import { formatKwanza } from '../data/menuData';

interface DishCardProps {
  dish: Dish;
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onEditImage: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onSelectDish,
  onQuickAdd,
  onEditImage,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] overflow-hidden shadow-[0_4px_16px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_10px_24px_-4px_rgba(153,27,27,0.06),0_2px_6px_-1px_rgba(28,25,23,0.04)] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
      <div>
        {/* Edge-to-edge 16:10 photograph container */}
        <div className="relative aspect-[16/10] w-full bg-[#F5F5F4] overflow-hidden cursor-pointer" onClick={() => onSelectDish(dish)}>
          {!imageError ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF2EE] to-[#E9E1DD] p-4 text-center">
              <Utensils className="w-8 h-8 text-[#991B1B]/40 mb-2" />
              <span className="text-xs font-semibold text-[#59413E]">{dish.name}</span>
              <span className="text-[10px] text-[#8D706D] mt-0.5">Imagem gastronómica</span>
            </div>
          )}

          {/* Single clean curated tag on top left if present */}
          {dish.badge && (
            <div className="absolute top-3 left-3 bg-[#FEF3C7]/95 backdrop-blur-xs text-[#904D00] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
              {dish.badge}
            </div>
          )}

          {/* Image direct link quick editor trigger on top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditImage(dish);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 hover:bg-[#991B1B] text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-sm cursor-pointer opacity-90 hover:opacity-100"
            title="Editar ou ver link direto da imagem HTML deste prato"
            aria-label="Editar link direto da imagem"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-5 pb-3">
          {/* Metadata: category & prep time & rating */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1.5 font-medium">
            <span>{dish.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A8A29E]" />
              {dish.prepTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-[#D97706] font-semibold">
              <Star className="w-3 h-3 fill-current" />
              {dish.rating.toFixed(1)}
            </span>
          </div>

          {/* Dish Title */}
          <h3
            onClick={() => onSelectDish(dish)}
            className="text-base sm:text-lg font-bold text-[#1C1917] tracking-tight hover:text-[#991B1B] transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {dish.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs sm:text-sm text-[#57534E] leading-relaxed line-clamp-2">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Tabular Price in Kz and Add to Cart Trigger */}
      <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between border-t border-[#F5F5F4]/60">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#78716C] block font-semibold">
            Preço
          </span>
          <span className="text-base sm:text-lg font-bold text-[#1C1917] tabular-nums tracking-tight">
            {formatKwanza(dish.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDish(dish)}
            className="px-3 py-2 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-xl transition-colors cursor-pointer"
          >
            Personalizar
          </button>
          <button
            onClick={() => onQuickAdd(dish)}
            className="w-10 h-10 rounded-xl bg-[#991B1B] hover:bg-[#760009] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
            title="Adicionar rapidamente ao carrinho"
            aria-label={`Adicionar ${dish.name} ao carrinho`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </article>
  );
};
