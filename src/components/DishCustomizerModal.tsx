import React, { useState } from 'react';
import { X, Clock, Star, Flame, Utensils, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { Dish, CartItem } from '../types';
import { formatKwanza } from '../data/menuData';

interface DishCustomizerModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenImageEditor: (dish: Dish) => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  dish,
  onClose,
  onAddToCart,
  onOpenImageEditor,
}) => {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [portionSize, setPortionSize] = useState<'individual' | 'familiar'>('individual');
  const [selectedAccompaniment, setSelectedAccompaniment] = useState<string>(
    dish.availableAccompaniments[0] || 'Padrão da Casa'
  );
  const [spicyLevel, setSpicyLevel] = useState<string>(
    dish.spiceLevels[0] || 'Sem Picante'
  );
  const [notes, setNotes] = useState('');
  const [imgError, setImgError] = useState(false);

  // Price modifier for familiar portion (+70% price, serves 2-3 people)
  const basePrice = portionSize === 'familiar' ? Math.round(dish.price * 1.7) : dish.price;
  const totalPrice = basePrice * quantity;

  const handleConfirm = () => {
    const cartItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity,
      selectedAccompaniment: `${selectedAccompaniment} (${portionSize === 'familiar' ? 'Porção Familiar' : 'Individual'})`,
      spicyLevel,
      notes: notes.trim(),
      itemTotal: totalPrice,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FFFFFF] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#F5F5F4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full bg-[#F5F5F4] shrink-0 overflow-hidden">
          {!imgError ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF2EE]">
              <Utensils className="w-10 h-10 text-[#991B1B]/40 mb-2" />
              <span className="text-sm font-semibold text-[#59413E]">{dish.name}</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Change / Direct Image Link Shortcut */}
          <button
            onClick={() => onOpenImageEditor(dish)}
            className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-[#991B1B] text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Editar Link da Imagem</span>
          </button>

          {dish.badge && (
            <div className="absolute top-3 left-3 bg-[#FEF3C7] text-[#904D00] text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
              {dish.badge}
            </div>
          )}
        </div>

        {/* Scrollable details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#1C1917]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1 font-medium">
              <span>{dish.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#A8A29E]" />
                {dish.prepTime}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-[#D97706] font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {dish.rating.toFixed(1)} ({dish.reviewsCount} avaliações)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
              {dish.name}
            </h2>
            <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Tamanho da Porção */}
          <div className="border-t border-[#F5F5F4] pt-4">
            <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-2.5">
              Tamanho da Porção
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPortionSize('individual')}
                className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                  portionSize === 'individual'
                    ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                    : 'border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#292524]'
                }`}
              >
                <div className="font-bold">Individual</div>
                <div className="text-[11px] text-[#78716C] mt-0.5">Ideal para 1 pessoa</div>
                <div className="mt-1 font-bold tabular-nums text-[#1C1917]">
                  {formatKwanza(dish.price)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPortionSize('familiar')}
                className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                  portionSize === 'familiar'
                    ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                    : 'border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#292524]'
                }`}
              >
                <div className="font-bold">Porção Familiar (2-3 pess.)</div>
                <div className="text-[11px] text-[#78716C] mt-0.5">Dose reforçada + acompanhamentos</div>
                <div className="mt-1 font-bold tabular-nums text-[#1C1917]">
                  {formatKwanza(Math.round(dish.price * 1.7))}
                </div>
              </button>
            </div>
          </div>

          {/* Acompanhamentos */}
          {dish.availableAccompaniments.length > 0 && (
            <div className="border-t border-[#F5F5F4] pt-4">
              <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-2.5">
                Escolha o Acompanhamento Principal
              </label>
              <div className="space-y-1.5">
                {dish.availableAccompaniments.map((acc) => (
                  <label
                    key={acc}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm transition-colors ${
                      selectedAccompaniment === acc
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-medium'
                        : 'border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#292524]'
                    }`}
                  >
                    <span>{acc}</span>
                    <input
                      type="radio"
                      name="accompaniment"
                      value={acc}
                      checked={selectedAccompaniment === acc}
                      onChange={() => setSelectedAccompaniment(acc)}
                      className="accent-[#991B1B] w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Nível de Picante / Gindungo */}
          {dish.spiceLevels.length > 0 && (
            <div className="border-t border-[#F5F5F4] pt-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Flame className="w-4 h-4 text-[#991B1B]" />
                <label className="text-xs uppercase font-bold tracking-wider text-[#78716C]">
                  Toque de Gindungo / Picante
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {dish.spiceLevels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicyLevel(lvl)}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                      spicyLevel === lvl
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                        : 'border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#292524]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Observações para a Cozinha */}
          <div className="border-t border-[#F5F5F4] pt-4">
            <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1.5">
              Observações para o Chef (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: pouco sal, cebola bem cozinhada, sem quiabo..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/15 bg-white text-[#1C1917] placeholder:text-[#A8A29E]"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-[#FAFAF9] border-t border-[#E7E5E4] flex items-center justify-between gap-3 shrink-0">
          {/* Stepper */}
          <div className="flex items-center bg-[#FFFFFF] border border-[#E7E5E4] rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F5F5F4] disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center font-bold text-sm tabular-nums text-[#1C1917]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submit button with total */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#991B1B] hover:bg-[#760009] active:scale-98 text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-md transition-all cursor-pointer"
          >
            <span>Adicionar ao Pedido</span>
            <span className="tabular-nums font-bold">{formatKwanza(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
