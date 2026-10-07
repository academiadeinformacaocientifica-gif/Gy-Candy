import React, { useState, useEffect } from 'react';
import { Bike, Phone, MessageSquare, Clock, MapPin, CheckCircle2, ChevronRight, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatKwanza } from '../data/menuData';

interface LiveTrackerProps {
  order: Order | null;
  onAdvanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onNewOrder: () => void;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  order,
  onAdvanceOrderStatus,
  onNewOrder,
}) => {
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FAF2EE] text-[#991B1B] mx-auto flex items-center justify-center mb-4">
          <Bike className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1C1917]">Nenhum pedido em andamento</h2>
        <p className="text-sm text-[#78716C] mt-2 max-w-md mx-auto">
          Faça um pedido no cardápio de Luanda para acompanhar a confeção pelo Chef e a rota do estafeta até sua porta.
        </p>
        <button
          onClick={onNewOrder}
          className="mt-6 px-6 py-3 rounded-xl bg-[#991B1B] hover:bg-[#760009] text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Explorar Cardápio Gy Candy
        </button>
      </div>
    );
  }

  // Simulated countdown timer in minutes
  const [minutesRemaining, setMinutesRemaining] = useState(
    order.status === 'entregue' ? 0 : order.status === 'em_transito' ? 12 : 28
  );

  useEffect(() => {
    if (order.status === 'entregue') {
      setMinutesRemaining(0);
      return;
    }
    const timer = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000); // changes every 15s for lively simulation
    return () => clearInterval(timer);
  }, [order.status]);

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'confirmado',
      label: 'Pedido Confirmado',
      desc: 'Transação recebida pela equipa do Maculusso',
    },
    {
      key: 'preparando',
      label: 'Em Preparação no Fogão',
      desc: 'Chef cozinhando com ingredientes frescos',
    },
    {
      key: 'em_transito',
      label: 'Estafeta a Caminho',
      desc: 'Em trânsito de moto pelas ruas de Luanda',
    },
    {
      key: 'entregue',
      label: 'Entregue com Sucesso',
      desc: 'Entregue quente no seu endereço',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  const handleNextStatus = () => {
    if (order.status === 'confirmado') onAdvanceOrderStatus(order.id, 'preparando');
    else if (order.status === 'preparando') onAdvanceOrderStatus(order.id, 'em_transito');
    else if (order.status === 'em_transito') onAdvanceOrderStatus(order.id, 'entregue');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <button
        onClick={onNewOrder}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#991B1B] hover:text-[#760009] cursor-pointer transition-colors"
      >
        <span>← Voltar ao Cardápio</span>
      </button>

      {/* Top Banner with Tracking Status */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-5 sm:p-6 shadow-[0_4px_16px_-2px_rgba(28,25,23,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F4] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#991B1B] uppercase tracking-wider">
                Rastreio em Tempo Real
              </span>
              <span className="text-xs text-[#78716C]">·</span>
              <span className="text-xs font-mono font-semibold text-[#1C1917] bg-[#F5F5F4] px-2 py-0.5 rounded">
                {order.orderNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] tracking-tight mt-1">
              {order.status === 'entregue'
                ? 'Bom apetite! O seu pedido foi entregue.'
                : 'O seu pedido do Restaurante Gy Candy está a caminho!'}
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1">
              Origem: Cozinha Gy Candy (Maculusso) · Destino: {order.bairro.name}, Luanda
            </p>
          </div>

          {/* Countdown Clock */}
          {order.status !== 'entregue' && (
            <div className="flex items-center gap-3 bg-[#FAF2EE] border border-[#E1BFBB]/50 rounded-xl p-3 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-[#991B1B] text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                  Tempo Estimado
                </span>
                <span className="text-lg font-bold text-[#1C1917] tabular-nums">
                  ~{minutesRemaining} minutos
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4-Stage Timeline Stepper */}
        <div className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'border-[#991B1B] bg-[#991B1B]/5 ring-1 ring-[#991B1B]/20'
                      : isPast
                      ? 'border-[#15803D]/30 bg-[#15803D]/5'
                      : 'border-[#F5F5F4] bg-[#FAFAF9] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-[#991B1B]' : isPast ? 'text-[#15803D]' : 'text-[#78716C]'
                      }`}
                    >
                      Etapa 0{idx + 1}
                    </span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-[#15803D]" />}
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-[#991B1B] animate-ping" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C1917] leading-tight">
                    {stage.label}
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-1 leading-snug line-clamp-2">
                    {stage.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Simulation Controls for User */}
          <div className="mt-4 pt-4 border-t border-[#F5F5F4] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#78716C] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Simulador de Teste: clique para simular avanço em tempo real</span>
            </span>

            {order.status !== 'entregue' ? (
              <button
                onClick={handleNextStatus}
                className="px-3.5 py-1.5 bg-[#991B1B] hover:bg-[#760009] text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Avançar para Próxima Etapa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onAdvanceOrderStatus(order.id, 'confirmado')}
                className="px-3 py-1.5 border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#1C1917] font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar Simulação</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Courier info & Visual Luanda Map Route */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Courier Info Card */}
        <div className="md:col-span-5 bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-5 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
            Estafeta Responsável
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={order.courier.photoUrl}
              alt={order.courier.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#991B1B]/20"
            />
            <div>
              <div className="text-base font-bold text-[#1C1917]">{order.courier.name}</div>
              <div className="text-xs text-[#78716C] mt-0.5">{order.courier.vehicle}</div>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#57534E]">
                <span className="bg-[#F5F5F4] px-1.5 py-0.5 rounded font-semibold">{order.courier.plate}</span>
                <span className="text-[#D97706] font-sans font-bold">★ {order.courier.rating} (180+ entregas)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={`tel:${order.courier.phone}`}
              className="py-2.5 px-3 rounded-xl border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#1C1917] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Telefonar</span>
            </a>
            <a
              href={`https://wa.me/244${order.courier.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#15803D] hover:bg-[#15803D]/90 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Delivery coordinates */}
          <div className="border-t border-[#F5F5F4] pt-3 text-xs space-y-1.5 text-[#57534E]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1C1917]">Endereço: </span>
                {order.streetAddress}, {order.bairro.name}
              </div>
            </div>
            {order.referencePoint && (
              <div className="pl-6 text-[11px] text-[#78716C]">
                Ref: {order.referencePoint}
              </div>
            )}
          </div>
        </div>

        {/* Visual Simulated Route Map Canvas of Luanda */}
        <div className="md:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Mapa do Percurso em Luanda
            </div>
            <span className="text-[11px] bg-[#FAF2EE] text-[#991B1B] font-semibold px-2 py-0.5 rounded">
              Tráfego Moderado
            </span>
          </div>

          {/* SVG Map of Luanda Coastline & Hubs */}
          <div className="relative h-56 w-full rounded-xl bg-gradient-to-br from-[#F5F5F4] to-[#E7E5E4] overflow-hidden border border-[#E7E5E4] flex items-center justify-center">
            {/* Ambient grid lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Stylized Coastal Curve of Luanda Bay */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
              {/* Baía de Luanda ocean area */}
              <path
                d="M 0,0 L 400,0 L 400,40 Q 240,70 120,30 Q 50,60 0,90 Z"
                fill="#E0E7FF"
                opacity="0.6"
              />
              <text x="240" y="24" fontSize="10" fill="#4B5563" fontWeight="bold">
                Baía de Luanda / Atlântico
              </text>

              {/* Road arteries */}
              <path
                d="M 60,160 Q 150,130 200,110 T 320,80"
                stroke="#D6D3D1"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M 120,180 L 190,110 L 250,150"
                stroke="#D6D3D1"
                strokeWidth="4"
                fill="none"
              />

              {/* Active Route in Burgundy */}
              <path
                d="M 190,110 Q 230,100 270,95 T 310,90"
                stroke="#991B1B"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                className="animate-pulse"
                fill="none"
              />
            </svg>

            {/* Hub: Cozinha Maculusso */}
            <div className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#991B1B] text-white flex items-center justify-center shadow-md ring-4 ring-[#991B1B]/20">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#1C1917] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                Gy Candy (Maculusso)
              </span>
            </div>

            {/* Moto Courier Moving Indicator */}
            {order.status === 'em_transito' && (
              <div className="absolute top-[46%] left-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <div className="w-7 h-7 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-md ring-4 ring-[#D97706]/30">
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-[#904D00] bg-white/95 px-1 rounded shadow-2xs mt-0.5">
                  Mateus (Moto)
                </span>
              </div>
            )}

            {/* Destination Hub */}
            <div className="absolute top-[42%] left-[78%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shadow-md ring-4 ring-[#15803D]/20">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#1C1917] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                {order.bairro.name}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Partida: Maculusso (Hub Central)</span>
            <span>Distância estimada: ~3.8 km</span>
          </div>
        </div>
      </div>

      {/* Order Itemized Summary Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#1C1917]">Resumo do Pedido ({order.items.length} itens)</h3>
        <div className="divide-y divide-[#F5F5F4] text-xs">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-[#F5F5F4] font-bold text-center flex items-center justify-center text-[#1C1917]">
                  {item.quantity}x
                </span>
                <div>
                  <div className="font-semibold text-[#1C1917]">{item.dish.name}</div>
                  <div className="text-[11px] text-[#78716C]">{item.selectedAccompaniment}</div>
                </div>
              </div>
              <span className="font-bold tabular-nums text-[#1C1917]">
                {formatKwanza(item.itemTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#F5F5F4] flex justify-between items-center text-sm font-bold text-[#1C1917]">
          <span>Total Pago ({order.paymentMethod.toUpperCase()})</span>
          <span className="text-base text-[#991B1B] tabular-nums">{formatKwanza(order.total)}</span>
        </div>
      </div>
    </div>
  );
};
