import React from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { BairroLuanda } from '../types';
import { BAIRROS_LUANDA, formatKwanza } from '../data/menuData';

interface BairroSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBairro: BairroLuanda;
  onSelectBairro: (bairro: BairroLuanda) => void;
}

export const BairroSelectorModal: React.FC<BairroSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedBairro,
  onSelectBairro,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className="relative bg-[#FFFFFF] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#F5F5F4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#F5F5F4] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#991B1B]/10 text-[#991B1B] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917]">Selecione o Bairro em Luanda</h3>
              <p className="text-[11px] text-[#78716C]">
                Calculamos o tempo do estafeta e a taxa justa de entrega
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] flex items-center justify-center text-[#57534E] cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2">
          {BAIRROS_LUANDA.map((bairro) => {
            const isSelected = bairro.id === selectedBairro.id;
            return (
              <button
                key={bairro.id}
                onClick={() => {
                  onSelectBairro(bairro);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#991B1B] bg-[#991B1B]/5 ring-1 ring-[#991B1B]/20 shadow-2xs'
                    : 'border-[#F5F5F4] hover:border-[#E7E5E4] hover:bg-[#FAFAF9]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1C1917]">{bairro.name}</span>
                    <span className="text-[10px] bg-[#F5F5F4] text-[#78716C] px-1.5 py-0.5 rounded font-medium">
                      Zona {bairro.zone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#78716C] mt-1">
                    <Clock className="w-3 h-3 text-[#A8A29E]" />
                    <span>Tempo de entrega: {bairro.estimatedTimeMin}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase text-[#78716C] block text-[10px]">Taxa</span>
                  <span className="text-sm font-bold text-[#1C1917] tabular-nums">
                    {formatKwanza(bairro.deliveryFee)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
