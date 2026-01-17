import { useState } from 'react';
import { X, ShoppingCart, Star, ArrowLeft, Plus, Minus, Trash2, CreditCard, QrCode, Check, Package, Crown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoSrAlex from 'figma:asset/88b8225577d5368dc8aeb374d8593fa61d9ab5ea.png';

interface LojaSrAlexProps {
  onClose: () => void;
}

interface Produto {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  precoOriginal: number;
  desconto: number;
  avaliacao: number;
  vendidos: number;
  categoria: string;
  img: string;
  destaque?: boolean;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export function LojaSrAlex({ onClose }: LojaSrAlexProps) {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [telaAtual, setTelaAtual] = useState<'produtos' | 'carrinho' | 'checkout' | 'confirmacao'>('produtos');
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | ''>('');

  const produtos: Produto[] = [
    // PRÓTESES CAPILARES
    {
      id: 1,
      nome: 'Prótese Capilar Premium Linha Executiva',
      marca: 'Sr. Alex',
      preco: 2499.90,
      precoOriginal: 3200.00,
      desconto: 22,
      avaliacao: 5.0,
      vendidos: 87,
      categoria: 'protese',
      img: 'https://images.unsplash.com/photo-1583449993408-9366b5a231fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBoYWlyc3R5bGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY1NDIxNzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      destaque: true,
    },
    {
      id: 2,
      nome: 'Prótese Capilar Natural Hair System',
      marca: 'Sr. Alex',
      preco: 1899.90,
      precoOriginal: 2400.00,
      desconto: 21,
      avaliacao: 4.9,
      vendidos: 124,
      categoria: 'protese',
      img: 'https://images.unsplash.com/photo-1666622833860-562f3a5caa59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3lzdGVtJTIwdG91cGVlfGVufDF8fHx8MTc2NTQyMTc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      nome: 'Prótese Capilar Invisível Ultra Thin',
      marca: 'Sr. Alex',
      preco: 3299.90,
      precoOriginal: 4100.00,
      desconto: 20,
      avaliacao: 5.0,
      vendidos: 56,
      categoria: 'protese',
      img: 'https://images.unsplash.com/photo-1759134248487-e8baaf31e33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwaGFpciUyMGNhcmV8ZW58MXx8fHwxNzY1NDIxNzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      destaque: true,
    },
    {
      id: 4,
      nome: 'Prótese Capilar Clássica Conforto Plus',
      marca: 'Sr. Alex',
      preco: 1599.90,
      precoOriginal: 1950.00,
      desconto: 18,
      avaliacao: 4.8,
      vendidos: 98,
      categoria: 'protese',
      img: 'https://images.unsplash.com/photo-1583449993408-9366b5a231fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBoYWlyc3R5bGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY1NDIxNzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // BLAZERS
    {
      id: 5,
      nome: 'Blazer Azul Marinho Alfaiataria',
      marca: 'Sr. Alex Collection',
      preco: 899.90,
      precoOriginal: 1200.00,
      desconto: 25,
      avaliacao: 5.0,
      vendidos: 145,
      categoria: 'blazer',
      img: 'https://images.unsplash.com/photo-1626454015258-3175c09b7769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBibGF6ZXIlMjBuYXZ5fGVufDF8fHx8MTc2NTQyMTc1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      destaque: true,
    },
    {
      id: 6,
      nome: 'Blazer Cinza Executivo Slim Fit',
      marca: 'Sr. Alex Collection',
      preco: 849.90,
      precoOriginal: 1150.00,
      desconto: 26,
      avaliacao: 4.9,
      vendidos: 132,
      categoria: 'blazer',
      img: 'https://images.unsplash.com/photo-1671775281678-a44894dc7d8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwYmxhemVyJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjU0MjE3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      nome: 'Blazer Preto Premium Luxo',
      marca: 'Sr. Alex Collection',
      preco: 1199.90,
      precoOriginal: 1600.00,
      desconto: 25,
      avaliacao: 5.0,
      vendidos: 89,
      categoria: 'blazer',
      img: 'https://images.unsplash.com/photo-1618953989832-f5323bc3c93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZvcm1hbCUyMHN1aXR8ZW58MXx8fHwxNzY1NDIxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      destaque: true,
    },
    {
      id: 8,
      nome: 'Blazer Marrom Casual Elegante',
      marca: 'Sr. Alex Collection',
      preco: 749.90,
      precoOriginal: 980.00,
      desconto: 23,
      avaliacao: 4.8,
      vendidos: 67,
      categoria: 'blazer',
      img: 'https://images.unsplash.com/photo-1738739907430-69c912cea31d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGJsYXplciUyMGNhc3VhbHxlbnwxfHx8fDE3NjU0MjE3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 9,
      nome: 'Blazer Risca de Giz Clássico',
      marca: 'Sr. Alex Collection',
      preco: 949.90,
      precoOriginal: 1280.00,
      desconto: 26,
      avaliacao: 4.9,
      vendidos: 78,
      categoria: 'blazer',
      img: 'https://images.unsplash.com/photo-1598915850252-fb07ad1e6768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwYmxhemVyJTIwc3VpdCUyMGphY2tldHxlbnwxfHx8fDE3NjU0MjE3NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const categorias = [
    { id: 'todos', nome: 'Todos os produtos', count: produtos.length },
    { id: 'protese', nome: 'Próteses Capilares', count: produtos.filter(p => p.categoria === 'protese').length },
    { id: 'blazer', nome: 'Blazers Exclusivos', count: produtos.filter(p => p.categoria === 'blazer').length },
  ];

  const produtosFiltrados = selectedCategory === 'todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === selectedCategory);

  const adicionarAoCarrinho = (produto: Produto) => {
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.produto.id === produto.id 
          ? { ...item, quantidade: item.quantidade + 1 } 
          : item
      ));
    } else {
      setCarrinho([...carrinho, { produto, quantidade: 1 }]);
    }
    setTelaAtual('carrinho');
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId: number, delta: number) => {
    setCarrinho(carrinho.map(item => {
      if (item.produto.id === produtoId) {
        const novaQuantidade = item.quantidade + delta;
        return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  const finalizarPagamento = () => {
    setTelaAtual('confirmacao');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-yellow-950 to-neutral-950 border-2 border-yellow-600 rounded-2xl w-full max-w-7xl shadow-2xl max-h-[95vh] flex flex-col">
        
        {/* HEADER - FIXO */}
        <div className="border-b border-yellow-900 p-4 bg-gradient-to-r from-yellow-900/40 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Botão Voltar */}
              {telaAtual !== 'produtos' && (
                <button
                  onClick={() => {
                    if (telaAtual === 'carrinho') setTelaAtual('produtos');
                    if (telaAtual === 'checkout') setTelaAtual('carrinho');
                    if (telaAtual === 'confirmacao') onClose();
                  }}
                  className="w-10 h-10 bg-yellow-800 hover:bg-yellow-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Logo Sr. Alex */}
              <div className="flex items-center gap-3">
                <img 
                  src={logoSrAlex} 
                  alt="Sr. Alex" 
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
                <div>
                  <h2 className="text-yellow-400 text-xl font-bold">Sr. Alex</h2>
                  <p className="text-yellow-300 text-xs">
                    {telaAtual === 'produtos' && 'Prótese Capilar & Blazers Exclusivos'}
                    {telaAtual === 'carrinho' && `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no carrinho`}
                    {telaAtual === 'checkout' && 'Finalizar Pedido'}
                    {telaAtual === 'confirmacao' && 'Pedido Confirmado com Sucesso!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Carrinho Badge + Fechar */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {telaAtual === 'produtos' && totalItens > 0 && (
                <button
                  onClick={() => setTelaAtual('carrinho')}
                  className="relative px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{totalItens}</span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                    {totalItens}
                  </span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* CONTEÚDO - COM SCROLL */}
        <div className="p-4 overflow-y-auto flex-1">
          
          {/* TELA: PRODUTOS */}
          {telaAtual === 'produtos' && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-4">
                <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Categorias</h3>
                <div className="space-y-1">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                        selectedCategory === cat.id
                          ? 'bg-yellow-600 text-white'
                          : 'text-yellow-300 hover:bg-yellow-900/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.nome}</span>
                        <span className="text-xs">{cat.count}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Banner Autoestima */}
                <div className="bg-gradient-to-br from-yellow-800 to-yellow-900 rounded-lg p-4 border border-yellow-600">
                  <div className="text-yellow-200 text-xs font-semibold mb-2">✨ NOSSA MISSÃO</div>
                  <div className="text-white text-sm italic leading-relaxed">
                    "Sua autoestima é nosso compromisso. Renove sua confiança com elegância."
                  </div>
                </div>

                {/* Selo Premium */}
                <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-lg p-4 border border-amber-600 text-center">
                  <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-amber-400 text-xs font-bold mb-1">ATENDIMENTO VIP</div>
                  <div className="text-amber-300 text-xs">Personalização exclusiva</div>
                </div>
              </div>

              {/* Grid Produtos */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-6">
                  {produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      className={`bg-neutral-800/50 border rounded-xl overflow-hidden hover:border-yellow-600 hover:shadow-xl hover:shadow-yellow-900/20 transition-all group ${
                        produto.destaque ? 'border-yellow-600' : 'border-neutral-700'
                      }`}
                    >
                      {/* Imagem */}
                      <div className="relative h-48 bg-neutral-900 overflow-hidden">
                        <ImageWithFallback
                          src={produto.img}
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {produto.desconto > 0 && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                            -{produto.desconto}%
                          </div>
                        )}
                        {produto.destaque && (
                          <div className="absolute top-3 left-3 bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            DESTAQUE
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-4">
                        <div className="text-yellow-500 text-xs mb-1">{produto.marca}</div>
                        <h4 className="text-white font-semibold mb-2 text-sm line-clamp-2 h-10">
                          {produto.nome}
                        </h4>

                        {/* Avaliação */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(produto.avaliacao)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-neutral-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-neutral-500 text-xs">({produto.vendidos})</span>
                        </div>

                        {/* Preço */}
                        <div className="mb-3">
                          {produto.precoOriginal > produto.preco && (
                            <div className="text-neutral-600 text-xs line-through">
                              R$ {produto.precoOriginal.toFixed(2)}
                            </div>
                          )}
                          <div className="text-yellow-500 text-xl font-bold">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                        </div>

                        {/* Botão */}
                        <button 
                          onClick={() => adicionarAoCarrinho(produto)}
                          className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELA: CARRINHO */}
          {telaAtual === 'carrinho' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {carrinho.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <div className="text-white text-xl font-semibold mb-2">Carrinho vazio</div>
                  <div className="text-yellow-300 mb-6">Adicione produtos para continuar</div>
                  <button
                    onClick={() => setTelaAtual('produtos')}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-all font-semibold"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                <>
                  {carrinho.map((item) => (
                    <div key={item.produto.id} className="bg-neutral-800/50 border border-yellow-700 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <ImageWithFallback
                          src={item.produto.img}
                          alt={item.produto.nome}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="text-yellow-500 text-xs mb-1">{item.produto.marca}</div>
                          <h4 className="text-white font-semibold mb-2">{item.produto.nome}</h4>
                          <div className="text-yellow-500 text-lg font-bold">
                            R$ {item.produto.preco.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                            className="w-8 h-8 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition-all flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="text-white font-semibold w-8 text-center">{item.quantidade}</div>
                          <button
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                            className="w-8 h-8 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition-all flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removerDoCarrinho(item.produto.id)}
                          className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="bg-neutral-800/50 border border-yellow-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-yellow-300">Subtotal</span>
                      <span className="text-white font-semibold">R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-yellow-300">Frete</span>
                      <span className="text-yellow-500 font-semibold">GRÁTIS</span>
                    </div>
                    <div className="border-t border-yellow-700 pt-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xl font-bold">Total</span>
                        <span className="text-yellow-500 text-2xl font-bold">
                          R$ {totalCarrinho.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setTelaAtual('checkout')}
                      className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-all font-bold text-lg"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TELA: CHECKOUT */}
          {telaAtual === 'checkout' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Resumo */}
              <div className="bg-neutral-800/50 border border-yellow-700 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-4">Resumo do Pedido</h3>
                <div className="space-y-2 mb-4">
                  {carrinho.map((item) => (
                    <div key={item.produto.id} className="flex justify-between text-sm">
                      <span className="text-yellow-300">{item.quantidade}x {item.produto.nome}</span>
                      <span className="text-white">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-yellow-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-500">R$ {totalCarrinho.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-neutral-800/50 border border-yellow-700 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-4">Escolha o método de pagamento</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setMetodoPagamento('pix')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPagamento === 'pix'
                        ? 'bg-yellow-700/20 border-yellow-600'
                        : 'bg-neutral-900 border-neutral-700 hover:border-yellow-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <QrCode className="w-8 h-8 text-yellow-500" />
                      <div className="text-left">
                        <div className="text-white font-semibold">PIX</div>
                        <div className="text-yellow-300 text-sm">Aprovação instantânea</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setMetodoPagamento('cartao')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPagamento === 'cartao'
                        ? 'bg-yellow-700/20 border-yellow-600'
                        : 'bg-neutral-900 border-neutral-700 hover:border-yellow-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-amber-500" />
                      <div className="text-left">
                        <div className="text-white font-semibold">Cartão de Crédito</div>
                        <div className="text-yellow-300 text-sm">Até 12x sem juros</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* PIX */}
              {metodoPagamento === 'pix' && (
                <div className="bg-neutral-800/50 border border-yellow-600 rounded-xl p-6 animate-[fadeIn_0.3s]">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-black" />
                    </div>
                    <div className="text-white font-semibold mb-2">Escaneie o QR Code</div>
                    <div className="text-yellow-300 text-sm mb-4">Ou copie o código PIX abaixo:</div>
                    <div className="bg-neutral-900 border border-yellow-700 rounded-lg p-3 mb-4">
                      <div className="text-yellow-500 text-xs font-mono break-all">
                        00020126580014BR.GOV.BCB.PIX0136SRALEX987654321012345678905204000053039865802BR5909SR ALEX6009SAO PAULO62070503***63042F8A
                      </div>
                    </div>
                    <button
                      onClick={finalizarPagamento}
                      className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-all font-semibold"
                    >
                      Já fiz o pagamento
                    </button>
                  </div>
                </div>
              )}

              {/* CARTÃO */}
              {metodoPagamento === 'cartao' && (
                <div className="bg-neutral-800/50 border border-amber-600 rounded-xl p-6 animate-[fadeIn_0.3s]">
                  <div className="space-y-4">
                    <div>
                      <label className="text-yellow-400 text-sm mb-2 block">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-neutral-900 border border-yellow-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-yellow-400 text-sm mb-2 block">Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full bg-neutral-900 border border-yellow-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>
                      <div>
                        <label className="text-yellow-400 text-sm mb-2 block">CVV</label>
                        <input
                          type="text"
                          placeholder="000"
                          className="w-full bg-neutral-900 border border-yellow-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-yellow-400 text-sm mb-2 block">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMPLETO"
                        className="w-full bg-neutral-900 border border-yellow-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <button
                      onClick={finalizarPagamento}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all font-semibold"
                    >
                      Finalizar Pagamento
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TELA: CONFIRMAÇÃO */}
          {telaAtual === 'confirmacao' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-600 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-yellow-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-yellow-400" />
                </div>
                <h2 className="text-white text-3xl font-bold mb-4">Pedido Confirmado!</h2>
                <p className="text-yellow-300 text-lg mb-2">
                  Seu pedido #ALEX{Math.floor(Math.random() * 10000)} foi realizado com sucesso
                </p>
                <p className="text-yellow-200 text-sm italic mb-8">
                  "Transforme sua imagem, eleve sua confiança!"
                </p>
                
                <div className="bg-black/30 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-yellow-400" />
                    <span className="text-white font-semibold">Resumo do Pedido</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-200">Total de itens:</span>
                      <span className="text-white font-semibold">{totalItens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-200">Valor total:</span>
                      <span className="text-yellow-400 font-semibold">R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-200">Pagamento:</span>
                      <span className="text-white font-semibold">
                        {metodoPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-yellow-300 text-sm mb-8">
                  Entraremos em contato para agendamento e personalização do seu pedido.
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-white hover:bg-yellow-50 text-yellow-900 rounded-lg transition-all font-bold text-lg"
                >
                  Voltar para Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}