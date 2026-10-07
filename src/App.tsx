import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, MapPin, SlidersHorizontal, Image as ImageIcon, Bike, UtensilsCrossed } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DishCard } from './components/DishCard';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { LiveTracker } from './components/LiveTracker';
import { ImageManagerModal } from './components/ImageManagerModal';
import { BairroSelectorModal } from './components/BairroSelectorModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Dish, CartItem, BairroLuanda, Order, OrderStatus } from './types';
import { INITIAL_DISHES, BAIRROS_LUANDA, CATEGORIES, formatKwanza } from './data/menuData';

const LOCAL_STORAGE_DISHES_KEY = 'gy_candy_dishes_v3';
const LOCAL_STORAGE_ORDER_KEY = 'gy_candy_active_order_v3';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'menu' | 'tracker' | 'images' | 'about'>('menu');

  // Dishes state (persisted so custom direct image URLs remain across reloads)
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DISHES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_DISHES;
  });

  // Save dishes when modified
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DISHES_KEY, JSON.stringify(dishes));
    } catch {
      // silent
    }
  }, [dishes]);

  // Active delivery order state
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // silent
    }
    return null;
  });

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem(LOCAL_STORAGE_ORDER_KEY, JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_ORDER_KEY);
      }
    } catch {
      // silent
    }
  }, [activeOrder]);

  // Selected delivery bairro in Luanda (default: Maculusso)
  const [selectedBairro, setSelectedBairro] = useState<BairroLuanda>(BAIRROS_LUANDA[0]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [isBairroModalOpen, setIsBairroModalOpen] = useState(false);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [imageModalTargetDishId, setImageModalTargetDishId] = useState<string | null>(null);
  const [selectedDishForCustomizer, setSelectedDishForCustomizer] = useState<Dish | null>(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart calculations
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'todos' || dish.category === selectedCategory;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  // Featured Hero dish (Mufete or Moamba)
  const heroDish = useMemo(() => {
    return dishes.find((d) => d.id === 'tipico-mufete-chopa') || dishes[0];
  }, [dishes]);

  // Cart actions
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.dish.id === item.dish.id &&
          i.selectedAccompaniment === item.selectedAccompaniment &&
          i.spicyLevel === item.spicyLevel
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const exist = updated[existingIndex];
        exist.quantity += item.quantity;
        exist.itemTotal = (exist.dish.price) * exist.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleQuickAdd = (dish: Dish) => {
    const quickItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity: 1,
      selectedAccompaniment: dish.availableAccompaniments[0] || 'Dose Padrão',
      spicyLevel: dish.spiceLevels[0] || 'Sem Picante',
      notes: '',
      itemTotal: dish.price,
    };
    handleAddToCart(quickItem);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const singleItemPrice = Math.round(item.itemTotal / item.quantity);
          return {
            ...item,
            quantity: newQty,
            itemTotal: singleItemPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Direct image updater
  const handleUpdateDishImage = (dishId: string, newImageUrl: string) => {
    setDishes((prev) =>
      prev.map((dish) => (dish.id === dishId ? { ...dish, imageUrl: newImageUrl } : dish))
    );
  };

  const handleAddNewDish = (newDish: Dish) => {
    setDishes((prev) => [newDish, ...prev]);
  };

  const handleResetDefaultImages = () => {
    setDishes(INITIAL_DISHES);
    try {
      localStorage.removeItem(LOCAL_STORAGE_DISHES_KEY);
    } catch {
      // silent
    }
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]);
    setActiveTab('tracker');
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    if (!activeOrder || activeOrder.id !== orderId) return;
    setActiveOrder({
      ...activeOrder,
      status: nextStatus,
      statusUpdatedAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#1C1917]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBairro={selectedBairro}
        onOpenBairroSelector={() => setIsBairroModalOpen(true)}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        hasActiveOrder={activeOrder !== null && activeOrder.status !== 'entregue'}
      />

      {/* Main Content Areas based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'tracker' ? (
          <LiveTracker
            order={activeOrder}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onNewOrder={() => setActiveTab('menu')}
          />
        ) : activeTab === 'images' ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#991B1B]/10 text-[#991B1B] mx-auto flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
                Links Diretos para Imagens do HTML
              </h1>
              <p className="text-sm text-[#57534E] mt-2">
                Sim! Você pode adicionar ou alterar qualquer link direto de imagem em HTML nos pratos abaixo ou criar novos pratos.
              </p>
              <button
                onClick={() => {
                  setImageModalTargetDishId(null);
                  setIsImagesModalOpen(true);
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#760009] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Abrir Painel Completo de Links & Código HTML
              </button>
            </div>

            {/* Quick Dish Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-4 shadow-xs space-y-3"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#F5F5F4]">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded truncate max-w-[90%]">
                      {dish.imageUrl}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#78716C] font-semibold">{dish.categoryLabel}</div>
                    <div className="text-sm font-bold text-[#1C1917] truncate">{dish.name}</div>
                    <div className="text-xs text-[#991B1B] font-bold mt-1 tabular-nums">
                      {formatKwanza(dish.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setImageModalTargetDishId(dish.id);
                      setIsImagesModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-[#E7E5E4] hover:bg-[#FAF2EE] hover:border-[#991B1B]/40 text-xs font-semibold text-[#1C1917] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Editar Link Direto desta Imagem</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'about' ? (
          <AboutSection />
        ) : (
          /* Cardápio Principal / Vitrine Gastronómica */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
            {/* Storefront Hero: Single bold campaign focal point */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#1C1917] to-[#292524] text-white overflow-hidden shadow-lg border border-black/10">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[360px]">
                {/* Hero Copy */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 z-10">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#FEF3C7] block mb-1">
                      Restaurante
                    </span>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-balance text-white">
                      Gy Candy
                    </h1>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                    Sabores autênticos de Luanda preparados com paixão gastronómica. Do Mufete especial na brasa à Moamba aveludada, entregamos refeições quentes com rapidez em todos os bairros.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSelectDish(heroDish)}
                      className="px-5 py-3 rounded-xl bg-[#991B1B] hover:bg-[#760009] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Pedir {heroDish.name}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('about')}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-white/15 flex items-center gap-2"
                    >
                      <span>Sobre a Cozinha</span>
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#991B1B]" />
                      Entrega rápida em {selectedBairro.name} ({selectedBairro.estimatedTimeMin})
                    </span>
                    <span>·</span>
                    <span className="tabular-nums font-semibold text-stone-300">
                      Taxa: {formatKwanza(selectedBairro.deliveryFee)}
                    </span>
                  </div>
                </div>

                {/* Hero Image Showcase */}
                <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
                  <img
                    src={heroDish.imageUrl}
                    alt={heroDish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover lg:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1C1917] via-[#1C1917]/40 to-transparent" />
                  <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-right border border-white/10">
                    <span className="text-[10px] text-stone-300 block uppercase font-bold tracking-wider">
                      Prato Assinatura
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatKwanza(heroDish.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar prato, ingrediente (ex: funge, garoupa, moamba)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/15 bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-[#A8A29E] hover:text-[#1C1917] cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

              </div>

              {/* Category Segmented Filter Controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#991B1B] text-white font-semibold shadow-xs'
                          : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917] border border-[#E7E5E4] hover:bg-[#F5F5F4]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dishes Catalog Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold">
                <span>
                  Mostrando {filteredDishes.length} {filteredDishes.length === 1 ? 'prato' : 'pratos'}
                  {selectedCategory !== 'todos' && ` em ${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
                </span>
                <span className="flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-[#A8A29E]" />
                  <span>Cardápio Atualizado</span>
                </span>
              </div>

              {filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onSelectDish={handleSelectDish}
                      onQuickAdd={handleQuickAdd}
                      onEditImage={(d) => {
                        setImageModalTargetDishId(d.id);
                        setIsImagesModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#F5F5F4] p-12 text-center text-[#78716C]">
                  <UtensilsCrossed className="w-10 h-10 text-[#A8A29E] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#1C1917]">Nenhum prato encontrado</h3>
                  <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
                    Não encontramos resultados para "{searchQuery}". Tente pesquisar por ingredientes como "funge", "moamba" ou limpe o filtro.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('todos');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#F5F5F4] hover:bg-[#E7E5E4] text-xs font-semibold text-[#1C1917] transition-colors cursor-pointer"
                  >
                    Ver Todo o Cardápio
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Mobile Cart Bar when cart has items and not open */}
      {cartCount > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-[#991B1B] text-white shadow-xl flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#991B1B] text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-xs font-bold">Ver Carrinho de Compras</span>
            </div>
            <span className="text-sm font-bold tabular-nums">
              {formatKwanza(cartTotal)}
            </span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenImagesModal={() => setIsImagesModalOpen(true)} />

      {/* Modals & Drawers */}
      <DishCustomizerModal
        dish={selectedDishForCustomizer}
        onClose={() => setSelectedDishForCustomizer(null)}
        onAddToCart={handleAddToCart}
        onOpenImageEditor={(d) => {
          setSelectedDishForCustomizer(null);
          setImageModalTargetDishId(d.id);
          setIsImagesModalOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        selectedBairro={selectedBairro}
        onSelectBairro={setSelectedBairro}
        onOrderPlaced={handleOrderPlaced}
      />

      <BairroSelectorModal
        isOpen={isBairroModalOpen}
        onClose={() => setIsBairroModalOpen(false)}
        selectedBairro={selectedBairro}
        onSelectBairro={setSelectedBairro}
      />

      <ImageManagerModal
        isOpen={isImagesModalOpen}
        onClose={() => setIsImagesModalOpen(false)}
        dishes={dishes}
        onUpdateDishImage={handleUpdateDishImage}
        onAddNewDish={handleAddNewDish}
        onResetDefaultImages={handleResetDefaultImages}
        initialTargetDishId={imageModalTargetDishId}
      />
    </div>
  );

  function handleSelectDish(dish: Dish) {
    setSelectedDishForCustomizer(dish);
  }
}
