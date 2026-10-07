import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenImagesModal: () => void }> = ({ onOpenImagesModal }) => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#F5F5F4] mt-16 text-[#57534E] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#991B1B] text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#1C1917] tracking-tight">
                Gy Candy
              </span>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Restaurante & Delivery de excelência em Luanda, Angola. Cozinha autêntica angolana e internacional com entregas pontuais e embalagens térmicas.
            </p>
          </div>

          {/* Localização & Bairros */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">
              Zonas de Entrega
            </h4>
            <ul className="space-y-1 text-[#78716C]">
              <li>Maculusso (Sede) & Maianga</li>
              <li>Ingombota, Mutamba & Alvalade</li>
              <li>Miramar & Ilha de Luanda</li>
              <li>Talatona, Morro Bento & Kilamba</li>
            </ul>
          </div>

          {/* Métodos de Pagamento Angola */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">
              Pagamentos Aceites
            </h4>
            <div className="space-y-1 text-[#78716C]">
              <div>Multicaixa Express (MCX)</div>
              <div>TPA Portátil na Entrega</div>
              <div>Dinheiro Vivo (Kwanza em mão)</div>
              <div>Transferência Imediata (BAI / BFA)</div>
            </div>
          </div>

          {/* Links e Imagens */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">
              Recursos do Sistema
            </h4>
            <div className="space-y-1 text-[#78716C]">
              <button
                onClick={onOpenImagesModal}
                className="hover:text-[#991B1B] transition-colors cursor-pointer text-left font-medium block"
              >
                Gerir Links Diretos de Imagens HTML
              </button>
              <div className="text-[11px] text-[#A8A29E] mt-2">
                Atendimento: +244 923 123 456
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#F5F5F4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#A8A29E] text-[11px]">
          <div>
            © {new Date().getFullYear()} Restaurante Gy Candy · Maculusso, Luanda, Angola. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com carinho para a gastronomia angolana</span>
            <Heart className="w-3 h-3 text-[#991B1B] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
