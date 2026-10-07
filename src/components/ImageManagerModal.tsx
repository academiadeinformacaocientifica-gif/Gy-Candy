import React, { useState } from 'react';
import { X, Image as ImageIcon, Link, Copy, Check, ExternalLink, RefreshCw, Plus, Sparkles } from 'lucide-react';
import { Dish, CategoryId } from '../types';
import { INITIAL_DISHES } from '../data/menuData';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  onUpdateDishImage: (dishId: string, newImageUrl: string) => void;
  onAddNewDish: (dish: Dish) => void;
  onResetDefaultImages: () => void;
  initialTargetDishId?: string | null;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onUpdateDishImage,
  onAddNewDish,
  onResetDefaultImages,
  initialTargetDishId,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'manager' | 'html-guide' | 'add-dish'>('manager');
  const [selectedDishId, setSelectedDishId] = useState<string>(
    initialTargetDishId || dishes[0]?.id || ''
  );
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [previewTestUrl, setPreviewTestUrl] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  // Form for adding a new dish with custom image direct link
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<CategoryId>('tipicos');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('5000');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80');

  const currentDish = dishes.find((d) => d.id === selectedDishId) || dishes[0];

  // Curated quick direct links for instant replacement
  const PRESET_CULINARY_IMAGES = [
    {
      title: 'Mufete de Peixe na Brasa',
      url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Moamba / Frango Estufado',
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Peixe Nobre Grelhado com Legumes',
      url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Arroz Caldoso de Frutos do Mar',
      url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Picanha & Cortes Grelhados',
      url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Chamuças & Salgados Finos',
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Sobremesa de Frutas & Coco',
      url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Copo Gelado / Bebida Refrescante',
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const handleApplyUrl = (urlToApply: string) => {
    if (!currentDish || !urlToApply.trim()) return;
    onUpdateDishImage(currentDish.id, urlToApply.trim());
    setCustomUrlInput('');
    setSaveSuccessNotice(`Link direto atualizado para "${currentDish.name}" com sucesso!`);
    setTimeout(() => setSaveSuccessNotice(''), 3500);
  };

  const handleCopyCodeSnippet = (htmlString: string) => {
    navigator.clipboard.writeText(htmlString);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newDish: Dish = {
      id: `dish-custom-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory,
      categoryLabel:
        newDishCategory === 'tipicos'
          ? 'Comidas Típicas Nacionais'
          : newDishCategory === 'internacionais'
          ? 'Pratos Internacionais'
          : newDishCategory === 'arroz_massas'
          ? 'Arroz & Massas'
          : newDishCategory === 'entradas'
          ? 'Entradas'
          : newDishCategory === 'sopas'
          ? 'Sopas'
          : newDishCategory === 'guarnicoes'
          ? 'Guarnições'
          : newDishCategory === 'bebidas'
          ? 'Bebidas & Cervejas'
          : 'Vinhos & Sobremesas',
      description: newDishDesc.trim() || 'Prato especial preparado pelos chefs do Maculusso com ingredientes selecionados.',
      price: parseInt(newDishPrice, 10) || 12000,
      prepTime: '25-35 min',
      badge: 'Novidade',
      imageUrl: newDishImage.trim(),
      rating: 5.0,
      reviewsCount: 1,
      availableAccompaniments: ['Funge de Mandioca', 'Arroz Branco', 'Farofa Dourada'],
      spiceLevels: ['Sem Picante', 'Gindungo Suave', 'Gindungo Tradicional']
    };

    onAddNewDish(newDish);
    setSelectedDishId(newDish.id);
    setActiveTab('manager');
    setSaveSuccessNotice(`Novo prato "${newDish.name}" adicionado com a foto direta!`);
    setTimeout(() => setSaveSuccessNotice(''), 3500);
  };

  const sampleHtmlCode = currentDish
    ? `<img \n  src="${currentDish.imageUrl}" \n  alt="${currentDish.name} - Gy Candy" \n  class="w-full h-auto rounded-2xl object-cover" \n  loading="lazy" \n  referrerpolicy="no-referrer" \n/>`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div
        className="relative bg-[#FFFFFF] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-[#F5F5F4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#F5F5F4] flex items-center justify-between gap-4 bg-[#FAFAF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#991B1B]/10 text-[#991B1B] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] tracking-tight">
                Gestor de Imagens & Links Diretos HTML
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Altere, teste e insira links diretos de imagens para qualquer prato do aplicativo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#E7E5E4] hover:bg-[#F5F5F4] flex items-center justify-center text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Fechar gestor de imagens"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#F5F5F4] px-4 sm:px-6 bg-[#FFFFFF] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('manager')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'manager'
                ? 'border-[#991B1B] text-[#991B1B]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Editor de Imagens dos Pratos ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('html-guide')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'html-guide'
                ? 'border-[#991B1B] text-[#991B1B]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <CodeIcon />
            <span>Guia: Como Usar no HTML</span>
          </button>
          <button
            onClick={() => setActiveTab('add-dish')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'add-dish'
                ? 'border-[#991B1B] text-[#991B1B]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Prato com Link Direto</span>
          </button>
        </div>

        {/* Success toast notification inside modal */}
        {saveSuccessNotice && (
          <div className="bg-[#15803D]/10 border-b border-[#15803D]/20 px-6 py-2.5 text-xs font-medium text-[#15803D] flex items-center justify-between animate-in fade-in">
            <span>{saveSuccessNotice}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'manager' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Dish Selector */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C]">
                  Selecione o Prato para Alterar Imagem
                </label>
                <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 border border-[#F5F5F4] rounded-xl p-2 bg-[#FAFAF9]">
                  {dishes.map((dish) => {
                    const isSelected = dish.id === selectedDishId;
                    return (
                      <button
                        key={dish.id}
                        onClick={() => {
                          setSelectedDishId(dish.id);
                          setCustomUrlInput('');
                        }}
                        className={`w-full p-2.5 rounded-lg flex items-center gap-3 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFFFFF] border border-[#991B1B]/40 shadow-xs ring-1 ring-[#991B1B]/15'
                            : 'hover:bg-[#FFFFFF]/70 border border-transparent'
                        }`}
                      >
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-10 object-cover rounded-md shrink-0 bg-[#E7E5E4]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#1C1917] truncate">{dish.name}</div>
                          <div className="text-[11px] text-[#78716C] truncate">{dish.categoryLabel}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={onResetDefaultImages}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#57534E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar Fotos Originais de Luanda</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Active Dish Preview & URL Editor */}
              {currentDish && (
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-[#FAF2EE]/50 border border-[#E1BFBB]/60 rounded-xl p-4">
                    <div className="text-xs font-bold text-[#991B1B] uppercase tracking-wider mb-1">
                      Prato em Edição
                    </div>
                    <div className="text-base font-bold text-[#1C1917]">{currentDish.name}</div>
                    <div className="text-xs text-[#57534E] mt-0.5 line-clamp-1">{currentDish.description}</div>
                  </div>

                  {/* Image Preview Box */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4] shadow-xs">
                    <img
                      src={previewTestUrl || currentDish.imageUrl}
                      alt={currentDish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded-md max-w-[90%] truncate">
                      {previewTestUrl ? `Pré-visualização: ${previewTestUrl}` : currentDish.imageUrl}
                    </div>
                  </div>

                  {/* Input to change URL */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C]">
                      Colar Link Direto da Imagem (URL Web / HTTPS)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                        <input
                          type="url"
                          value={customUrlInput}
                          onChange={(e) => {
                            setCustomUrlInput(e.target.value);
                            setPreviewTestUrl(e.target.value);
                          }}
                          placeholder="https://exemplo.com/sua-foto-gastronomica.jpg"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/15 bg-white text-[#1C1917]"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyUrl(customUrlInput)}
                        disabled={!customUrlInput.trim()}
                        className="px-4 py-2 bg-[#991B1B] hover:bg-[#760009] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        Salvar Foto
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Gallery */}
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Fotos Prontas de Alta Qualidade (Clique para Aplicar)</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_CULINARY_IMAGES.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleApplyUrl(preset.url)}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-[#E7E5E4] hover:border-[#991B1B] transition-all cursor-pointer"
                          title={preset.title}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-semibold text-center p-1 transition-opacity">
                            Usar
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: HTML Guide & Code Generator */}
          {activeTab === 'html-guide' && (
            <div className="space-y-6">
              <div className="bg-[#FAF2EE] border border-[#E1BFBB] rounded-xl p-5">
                <h3 className="text-base font-bold text-[#760009] mb-1">
                  Sim, é 100% possível adicionar links diretos para as imagens do HTML!
                </h3>
                <p className="text-xs sm:text-sm text-[#59413E] leading-relaxed">
                  No HTML padrão, qualquer imagem é incorporada através da tag <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#991B1B]">&lt;img /&gt;</code> passando o link direto no atributo <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#991B1B]">src="..."</code>. Abaixo mostramos exatamente como funciona na prática.
                </p>
              </div>

              {/* Sample Code Snippet */}
              <div className="border border-[#E7E5E4] rounded-xl p-4 bg-[#1C1917] text-white">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="text-xs font-mono text-[#A8A29E]">Exemplo de Tag HTML com Link Direto</span>
                  <button
                    onClick={() => handleCopyCodeSnippet(sampleHtmlCode)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-sans transition-colors cursor-pointer text-white"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copiado!' : 'Copiar Snippet HTML'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs sm:text-sm overflow-x-auto text-[#FEF3C7] leading-relaxed">
                  {sampleHtmlCode}
                </pre>
              </div>

              {/* Guidelines for Direct Image Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                  <div className="font-bold text-[#1C1917] mb-1">1. O Que É um Link Direto?</div>
                  <p className="text-[#57534E] leading-relaxed">
                    É um endereço web (URL) que aponta diretamente para o arquivo de imagem (ex: terminando em .jpg, .png, .webp ou servido por CDN como Unsplash, Cloudinary, AWS S3).
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                  <div className="font-bold text-[#1C1917] mb-1">2. Boas Práticas de HTML</div>
                  <p className="text-[#57534E] leading-relaxed">
                    Sempre inclua <code className="font-mono text-[#991B1B]">alt="..."</code> com a descrição do prato para acessibilidade e <code className="font-mono text-[#991B1B]">loading="lazy"</code> para carregamento ultrarrápido.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#FFFFFF]">
                  <div className="font-bold text-[#1C1917] mb-1">3. Resiliência a Falhas</div>
                  <p className="text-[#57534E] leading-relaxed">
                    Nosso aplicativo possui fallback automático contra links quebrados (<code className="font-mono text-[#991B1B]">onError</code>), garantindo que a tela nunca mostre uma imagem quebrada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Add new dish with direct link */}
          {activeTab === 'add-dish' && (
            <form onSubmit={handleCreateNewDish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1">
                    Nome do Prato Gourmet
                  </label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Ex: Garoupa Grelhada com Banana Pão"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] bg-white text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as CategoryId)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] bg-white text-[#1C1917]"
                  >
                    <option value="tipicos">Comidas Típicas Nacionais</option>
                    <option value="internacionais">Pratos Internacionais</option>
                    <option value="arroz_massas">Arroz & Massas</option>
                    <option value="entradas">Entradas</option>
                    <option value="sopas">Sopas</option>
                    <option value="guarnicoes">Guarnições</option>
                    <option value="bebidas">Bebidas & Cervejas</option>
                    <option value="sobremesas_vinhos">Vinhos & Sobremesas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1">
                    Preço em Kwanza (Kz)
                  </label>
                  <input
                    type="number"
                    required
                    min="500"
                    step="500"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] bg-white text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1">
                    Link Direto da Imagem (URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={newDishImage}
                    onChange={(e) => setNewDishImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] bg-white text-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#78716C] mb-1">
                  Descrição Gastronómica
                </label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Descreva os ingredientes frescos, confeção e aromas..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E5E4] focus:outline-none focus:border-[#991B1B] bg-white text-[#1C1917]"
                />
              </div>

              {/* Live preview of new dish image */}
              {newDishImage && (
                <div className="p-3 border border-[#E7E5E4] rounded-xl flex items-center gap-3 bg-[#FAFAF9]">
                  <img
                    src={newDishImage}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 object-cover rounded-lg bg-[#E7E5E4]"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-[#1C1917]">Pré-visualização do Link Direto</div>
                    <div className="text-[#78716C] font-mono text-[11px] truncate max-w-md">{newDishImage}</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#991B1B] hover:bg-[#760009] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cadastrar Prato com Link Direto de Imagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

function CodeIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
