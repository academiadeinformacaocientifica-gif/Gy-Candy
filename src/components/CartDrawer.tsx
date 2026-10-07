import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MapPin, CreditCard, ShieldCheck, ArrowRight, Utensils, Phone, User } from 'lucide-react';
import { CartItem, BairroLuanda, PaymentMethodId, Order } from '../types';
import { BAIRROS_LUANDA, formatKwanza } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  selectedBairro: BairroLuanda;
  onSelectBairro: (bairro: BairroLuanda) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  selectedBairro,
  onSelectBairro,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('923 000 000');
  const [streetAddress, setStreetAddress] = useState('Rua Frederico Welwitsch, nº 14');
  const [referencePoint, setReferencePoint] = useState('Próximo ao Largo do Kinaxixi');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('mcx');
  const [changeForCash, setChangeForCash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const packagingFee = items.length > 0 ? 500 : 0; // Taxa de Embalagem Gastronómica
  const deliveryFee = selectedBairro.deliveryFee;
  const total = subtotal + packagingFee + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#GC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      deliveryFee,
      packagingFee,
      total,
      bairro: selectedBairro,
      streetAddress: streetAddress.trim(),
      referencePoint: referencePoint.trim(),
      customerName: customerName.trim() || 'Cliente Gy Candy',
      customerPhone: customerPhone.trim() || '+244 923 000 000',
      paymentMethod,
      status: 'preparando',
      statusUpdatedAt: 'Agora mesmo',
      estimatedArrivalMinutes: parseInt(selectedBairro.estimatedTimeMin, 10) || 30,
      courier: {
        name: 'Mateus Kiala',
        phone: '+244 924 112 345',
        vehicle: 'Moto Honda 150cc Vermelha',
        plate: 'LD-44-89-GK',
        rating: 4.9,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-lg bg-[#FFFFFF] h-full flex flex-col shadow-2xl relative border-l border-[#F5F5F4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F5F5F4] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#1C1917]">
              {step === 'cart' ? 'Carrinho de Pedidos' : 'Confirmar Entrega em Luanda'}
            </h2>
            <span className="text-xs text-[#78716C] font-semibold tabular-nums">
              ({items.length} {items.length === 1 ? 'item' : 'itens'})
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#E7E5E4] hover:bg-[#F5F5F4] flex items-center justify-center text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#78716C]">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mb-3 text-[#A8A29E]">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">O seu carrinho está vazio</h3>
              <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                Explore o cardápio do Restaurante Gy Candy e adicione pratos gastronómicos selecionados.
              </p>
            </div>
          ) : step === 'cart' ? (
            /* Items list */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-xl border border-[#F5F5F4] bg-[#FFFFFF] hover:border-[#E7E5E4] transition-colors flex gap-3 shadow-2xs"
                >
                  <img
                    src={item.dish.imageUrl}
                    alt={item.dish.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-lg object-cover shrink-0 bg-[#E7E5E4]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] truncate">
                          {item.dish.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-[#A8A29E] hover:text-[#B91C1C] transition-colors p-1 cursor-pointer"
                          aria-label={`Remover ${item.dish.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#78716C] mt-0.5 space-y-0.5">
                        <div className="truncate">{item.selectedAccompaniment}</div>
                        {item.spicyLevel && <div className="text-[#991B1B]">{item.spicyLevel}</div>}
                        {item.notes && <div className="italic text-[#8D706D] truncate">"{item.notes}"</div>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F5F5F4]">
                      <span className="text-xs sm:text-sm font-bold text-[#1C1917] tabular-nums">
                        {formatKwanza(item.itemTotal)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center bg-[#F5F5F4] rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-white transition-colors cursor-pointer"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-white transition-colors cursor-pointer"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bairro banner notice in cart */}
              <div className="p-3.5 rounded-xl bg-[#FAF2EE] border border-[#E1BFBB]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#991B1B]" />
                  <div>
                    <div className="font-semibold text-[#1C1917]">Entrega em {selectedBairro.name}</div>
                    <div className="text-[11px] text-[#78716C]">Estimativa: {selectedBairro.estimatedTimeMin}</div>
                  </div>
                </div>
                <span className="font-bold tabular-nums text-[#991B1B]">
                  {formatKwanza(selectedBairro.deliveryFee)}
                </span>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {/* Customer info */}
              <div className="space-y-3 p-3.5 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                <div className="font-bold text-[#1C1917] text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#991B1B]" />
                  <span>Seus Dados de Contacto</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#78716C] mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: João Baptista Silva"
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] text-xs bg-white text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#78716C] mb-1">
                    Telefone de Luanda (com WhatsApp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-semibold text-[#78716C] text-xs">+244</span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="923 000 000"
                      className="w-full pl-13 pr-3 py-2 rounded-lg border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] text-xs bg-white text-[#1C1917]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery address in Luanda */}
              <div className="space-y-3 p-3.5 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                <div className="font-bold text-[#1C1917] text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#991B1B]" />
                  <span>Endereço de Entrega em Luanda</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#78716C] mb-1">
                    Bairro de Luanda
                  </label>
                  <select
                    value={selectedBairro.id}
                    onChange={(e) => {
                      const found = BAIRROS_LUANDA.find((b) => b.id === e.target.value);
                      if (found) onSelectBairro(found);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] text-xs bg-white text-[#1C1917] font-semibold"
                  >
                    {BAIRROS_LUANDA.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.zone}) — Taxa: {formatKwanza(b.deliveryFee)} ({b.estimatedTimeMin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#78716C] mb-1">
                    Rua / Edifício / Apartamento
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Ex: Rua Rainha Ginga, Edifício Benguela, 3º Andar"
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] text-xs bg-white text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#78716C] mb-1">
                    Ponto de Referência Conhecido
                  </label>
                  <input
                    type="text"
                    required
                    value={referencePoint}
                    onChange={(e) => setReferencePoint(e.target.value)}
                    placeholder="Ex: Perto do Largo do Kinaxixi, em frente à Sonangol"
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] text-xs bg-white text-[#1C1917]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2.5 p-3.5 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                <div className="font-bold text-[#1C1917] text-sm flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#991B1B]" />
                  <span>Método de Pagamento em Angola</span>
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'mcx'
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                        : 'border-[#E7E5E4] text-[#292524]'
                    }`}
                  >
                    <div>
                      <div>Multicaixa Express (MCX)</div>
                      <div className="text-[10px] text-[#78716C] font-normal">Envio de solicitação direta para o seu telemóvel</div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mcx"
                      checked={paymentMethod === 'mcx'}
                      onChange={() => setPaymentMethod('mcx')}
                      className="accent-[#991B1B] w-4 h-4"
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'tpa'
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                        : 'border-[#E7E5E4] text-[#292524]'
                    }`}
                  >
                    <div>
                      <div>TPA na Entrega (Cartão Multicaixa)</div>
                      <div className="text-[10px] text-[#78716C] font-normal">O estafeta leva o terminal portátil</div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tpa"
                      checked={paymentMethod === 'tpa'}
                      onChange={() => setPaymentMethod('tpa')}
                      className="accent-[#991B1B] w-4 h-4"
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'dinheiro'
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                        : 'border-[#E7E5E4] text-[#292524]'
                    }`}
                  >
                    <div>
                      <div>Dinheiro Vivo (Kwanza em mão)</div>
                      <div className="text-[10px] text-[#78716C] font-normal">Pagamento físico ao receber o pedido</div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="dinheiro"
                      checked={paymentMethod === 'dinheiro'}
                      onChange={() => setPaymentMethod('dinheiro')}
                      className="accent-[#991B1B] w-4 h-4"
                    />
                  </label>

                  {paymentMethod === 'dinheiro' && (
                    <div className="pt-1.5 pl-2">
                      <label className="block text-[10px] uppercase font-bold text-[#78716C] mb-1">
                        Precisa de Troco para quanto?
                      </label>
                      <input
                        type="text"
                        value={changeForCash}
                        onChange={(e) => setChangeForCash(e.target.value)}
                        placeholder="Ex: Troco para 20.000 Kz"
                        className="w-full px-2.5 py-1.5 rounded border border-[#E7E5E4] text-xs bg-white"
                      />
                    </div>
                  )}

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'transferencia'
                        ? 'border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B] font-semibold'
                        : 'border-[#E7E5E4] text-[#292524]'
                    }`}
                  >
                    <div>
                      <div>Transferência Imediata (BAI Directo / BFA Net)</div>
                      <div className="text-[10px] text-[#78716C] font-normal">Envio de comprovativo para o WhatsApp do restaurante</div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === 'transferencia'}
                      onChange={() => setPaymentMethod('transferencia')}
                      className="accent-[#991B1B] w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer / Total and Submit */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAFAF9] border-t border-[#E7E5E4] shrink-0 space-y-3">
            {/* Bill breakdown */}
            <div className="space-y-1.5 text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Subtotal dos Pratos</span>
                <span className="font-medium text-[#1C1917] tabular-nums">{formatKwanza(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Embalagem Gastronómica</span>
                <span className="font-medium text-[#1C1917] tabular-nums">{formatKwanza(packagingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Entrega ({selectedBairro.name})</span>
                <span className="font-medium text-[#1C1917] tabular-nums">{formatKwanza(deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E7E5E4] text-sm font-bold text-[#1C1917]">
                <span>Total a Pagar</span>
                <span className="tabular-nums text-base text-[#991B1B]">{formatKwanza(total)}</span>
              </div>
            </div>

            {/* Step Action */}
            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-[#991B1B] hover:bg-[#760009] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Avançar para Entrega em Luanda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="py-3 px-4 rounded-xl border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#57534E] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#991B1B] hover:bg-[#760009] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Pedido Gourmet'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
