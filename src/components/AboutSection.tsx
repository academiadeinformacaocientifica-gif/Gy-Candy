import React from 'react';
import { UtensilsCrossed, ShieldCheck, Clock, MapPin, Award, Sparkles, Phone, MessageSquare } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Editorial Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2EE] text-[#991B1B] text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tradição & Contemporaneidade em Luanda</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
          Restaurante Gy Candy
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
          Nascido no coração do Maculusso em Luanda, o Restaurante Gy Candy celebra os sabores autênticos da gastronomia angolana e internacional, o peixe nobre da nossa costa e a hospitalidade com entregas pontuais e embalagens térmicas de alta qualidade.
        </p>
      </div>

      {/* 3 Pillars Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF2EE] text-[#991B1B] flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1C1917] mb-2">Ingredientes Nobres & Frescos</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Garoupas e mariscos capturados diariamente na costa de Luanda e Benguela, óleos virgens de palma selecionados e verduras biológicas locais.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5F5F4] text-xs font-semibold text-[#991B1B]">
            Sem conservantes artificiais
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#904D00] flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1C1917] mb-2">Embalagem Gastronómica Térmica</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Desenvolvemos caixas com isolamento duplo para que o funge aveludado, a moamba e as carnes grelhadas cheguem à sua mesa fumegantes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5F5F4] text-xs font-semibold text-[#904D00]">
            Temperatura preservada por 45 min
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF2EE] text-[#15803D] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1C1917] mb-2">Estafetas Dedicados de Luanda</h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Equipa própria de entregadores treinados para navegar com segurança e rapidez pelas vias do Maculusso, Maianga, Ingombota e Talatona.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5F5F4] text-xs font-semibold text-[#15803D]">
            Rastreio ao vivo em tempo real
          </div>
        </div>
      </div>

      {/* Location & Contact Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
              Cozinha Central & Atendimento
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917]">
              Maculusso, Luanda — Angola
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-[#57534E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <span>Rua Comandante Gika, nº 42, Bairro Maculusso, Luanda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#991B1B] shrink-0" />
                <span>Terça a Domingo: 11h30 às 23h00 (Sexta e Sábado até às 00h00)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="tel:+244923123456"
                className="px-4 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#760009] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>+244 923 123 456</span>
              </a>
              <a
                href="https://wa.me/244923123456"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#15803D]/90 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Cozinha</span>
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E7E5E4] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
              alt="Cozinha Restaurante Gy Candy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
              <div className="text-white">
                <div className="text-xs font-bold">Chefs Angolanos de Excelência</div>
                <div className="text-[11px] text-white/80">Preparação minuciosa e respeito aos ingredientes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
