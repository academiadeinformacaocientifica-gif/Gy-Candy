import React from 'react';
import { ShoppingBag, MapPin, Image as ImageIcon, Bike, UtensilsCrossed } from 'lucide-react';
import { BairroLuanda } from '../types';
import { formatKwanza } from '../data/menuData';

interface NavbarProps {
  activeTab: 'menu' | 'tracker' | 'images' | 'about';
  setActiveTab: (tab: 'menu' | 'tracker' | 'images' | 'about') => void;
  selectedBairro: BairroLuanda;
  onOpenBairroSelector: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  hasActiveOrder: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedBairro,
  onOpenBairroSelector,
  cartCount,
  cartTotal,
  onOpenCart,
  hasActiveOrder,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#F5F5F4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark (single element, clean display) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#991B1B] text-white flex items-center justify-center shadow-sm group-hover:bg-[#760009] transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1C1917] block leading-none">
                Gy Candy
              </span>
              <span className="text-[11px] font-medium text-[#78716C] tracking-wide block mt-1">
                Restaurante & Delivery · Luanda
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Only Cardápio and Sobre a Cozinha) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => setActiveTab('menu')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'menu'
                ? 'text-[#991B1B] font-semibold border-b-2 border-[#991B1B]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Cardápio
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'about'
                ? 'text-[#991B1B] font-semibold border-b-2 border-[#991B1B]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Sobre a Cozinha
          </button>
        </nav>

        {/* Zone 3: Actions (Bairro Location & Cart Trigger) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Luanda Bairro Selector Button */}
          <button
            onClick={onOpenBairroSelector}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#FFFFFF] border border-[#E7E5E4] rounded-xl hover:border-[#991B1B]/40 hover:bg-[#F5F5F4] transition-colors cursor-pointer text-[#292524] shadow-xs"
            title="Alterar Bairro de Entrega em Luanda"
          >
            <MapPin className="w-3.5 h-3.5 text-[#991B1B]" />
            <span className="max-w-[90px] sm:max-w-[130px] truncate">{selectedBairro.name}</span>
            <span className="hidden sm:inline text-[#78716C] text-[11px]">({selectedBairro.estimatedTimeMin})</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#991B1B] text-white hover:bg-[#760009] active:scale-98 transition-all shadow-sm cursor-pointer"
            aria-label="Abrir Carrinho"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold tabular-nums">
              {cartCount > 0 ? formatKwanza(cartTotal) : 'Carrinho'}
            </span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#FEF3C7] text-[#991B1B] text-xs font-bold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar: Only Cardápio and Sobre a Cozinha */}
      <div className="md:hidden flex items-center justify-center gap-6 border-t border-[#F5F5F4] bg-[#FFFFFF] px-4 py-2.5 text-xs font-medium text-[#78716C]">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-1.5 rounded-lg cursor-pointer ${
            activeTab === 'menu' ? 'bg-[#991B1B]/10 text-[#991B1B] font-semibold' : ''
          }`}
        >
          Cardápio
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-1.5 rounded-lg cursor-pointer ${
            activeTab === 'about' ? 'bg-[#991B1B]/10 text-[#991B1B] font-semibold' : ''
          }`}
        >
          Sobre a Cozinha
        </button>
      </div>
    </header>
  );
};
