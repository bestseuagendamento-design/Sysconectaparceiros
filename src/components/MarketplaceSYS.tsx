import { useState } from 'react';
import { X, ShoppingCart, MapPin, Clock, DollarSign, Star, Truck, Crown, ChevronRight, Search, Filter, Heart } from 'lucide-react';
import logoSrAlex from 'figma:asset/88b8225577d5368dc8aeb374d8593fa61d9ab5ea.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LojaSrAlex } from './LojaSrAlex';

interface MarketplaceSYSProps {
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
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export function MarketplaceSYS({ onClose }: MarketplaceSYSProps) {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [telaAtual, setTelaAtual] = useState<'produtos' | 'carrinho' | 'endereco' | 'checkout' | 'confirmacao'>('produtos');
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | ''>('');
  const [showLojaSrAlex, setShowLojaSrAlex] = useState(false);
  
  const [enderecoEntrega, setEnderecoEntrega] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '',
  });

  const produtos: Produto[] = [
    // PARAFUSOS E FIXAÇÃO
    {
      id: 1,
      nome: 'Caixa Parafusos Autoatarraxante 1000un',
      marca: 'Fischer',
      preco: 89.90,
      precoOriginal: 120.00,
      desconto: 25,
      avaliacao: 4.9,
      vendidos: 567,
      categoria: 'parafusos',
      img: 'https://images.unsplash.com/photo-1625773084965-5ccf71e1df51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3Jld3MlMjBoYXJkd2FyZSUyMGJveHxlbnwxfHx8fDE3NjU0MjM2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      nome: 'Kit Parafusos para Vidro Temperado',
      marca: 'Vonder',
      preco: 45.90,
      precoOriginal: 65.00,
      desconto: 29,
      avaliacao: 4.7,
      vendidos: 432,
      categoria: 'parafusos',
      img: 'https://images.unsplash.com/photo-1625773084965-5ccf71e1df51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3Jld3MlMjBoYXJkd2FyZSUyMGJveHxlbnwxfHx8fDE3NjU0MjM2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      nome: 'Parafuso Francês Inox 50un',
      marca: 'Stam',
      preco: 34.90,
      precoOriginal: 48.00,
      desconto: 27,
      avaliacao: 4.8,
      vendidos: 289,
      categoria: 'parafusos',
      img: 'https://images.unsplash.com/photo-1625773084965-5ccf71e1df51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3Jld3MlMjBoYXJkd2FyZSUyMGJveHxlbnwxfHx8fDE3NjU0MjM2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // SILICONES E VEDAÇÃO
    {
      id: 4,
      nome: 'Silicone Acético Transparente 280ml',
      marca: 'Dow Corning',
      preco: 18.90,
      precoOriginal: 25.00,
      desconto: 24,
      avaliacao: 5.0,
      vendidos: 892,
      categoria: 'silicone',
      img: 'https://images.unsplash.com/photo-1669307260367-8d5e7d61b9b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxpY29uZSUyMHNlYWxhbnQlMjB0dWJlfGVufDF8fHx8MTc2NTQyMzY0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      nome: 'Silicone Neutro para Vidros 300ml',
      marca: 'Soudal',
      preco: 22.90,
      precoOriginal: 32.00,
      desconto: 28,
      avaliacao: 4.9,
      vendidos: 743,
      categoria: 'silicone',
      img: 'https://images.unsplash.com/photo-1669307260367-8d5e7d61b9b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxpY29uZSUyMHNlYWxhbnQlMjB0dWJlfGVufDF8fHx8MTc2NTQyMzY0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      nome: 'Kit 12 Silicones Acético Branco',
      marca: 'Tekbond',
      preco: 189.90,
      precoOriginal: 260.00,
      desconto: 27,
      avaliacao: 4.8,
      vendidos: 234,
      categoria: 'silicone',
      img: 'https://images.unsplash.com/photo-1669307260367-8d5e7d61b9b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxpY29uZSUyMHNlYWxhbnQlMjB0dWJlfGVufDF8fHx8MTc2NTQyMzY0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      nome: 'Silicone Estrutural Preto 290ml',
      marca: 'Dow Corning',
      preco: 34.90,
      precoOriginal: 48.00,
      desconto: 27,
      avaliacao: 5.0,
      vendidos: 456,
      categoria: 'silicone',
      img: 'https://images.unsplash.com/photo-1669307260367-8d5e7d61b9b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxpY29uZSUyMHNlYWxhbnQlMjB0dWJlfGVufDF8fHx8MTc2NTQyMzY0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // FERRAMENTAS PARA VIDRACEIROS
    {
      id: 8,
      nome: 'Cortador de Vidro Profissional',
      marca: 'Riscadeira Toyo',
      preco: 78.90,
      precoOriginal: 110.00,
      desconto: 28,
      avaliacao: 4.9,
      vendidos: 345,
      categoria: 'ferramentas-vidro',
      img: 'https://images.unsplash.com/photo-1624981015149-e01395f1d774?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGN1dHRlciUyMHRvb2x8ZW58MXx8fHwxNzY1NDIzNjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 9,
      nome: 'Ventosa Dupla para Vidro 60kg',
      marca: 'Starfer',
      preco: 124.90,
      precoOriginal: 165.00,
      desconto: 24,
      avaliacao: 4.8,
      vendidos: 189,
      categoria: 'ferramentas-vidro',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 10,
      nome: 'Esquadro Magnético para Vidro',
      marca: 'Vonder',
      preco: 67.90,
      precoOriginal: 89.00,
      desconto: 24,
      avaliacao: 4.7,
      vendidos: 276,
      categoria: 'ferramentas-vidro',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 11,
      nome: 'Trena Laser 40m Profissional',
      marca: 'Bosch',
      preco: 234.90,
      precoOriginal: 320.00,
      desconto: 27,
      avaliacao: 5.0,
      vendidos: 412,
      categoria: 'ferramentas-vidro',
      img: 'https://images.unsplash.com/photo-1593307315564-c96172dc89dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFzdXJpbmclMjB0YXBlJTIwdG9vbHxlbnwxfHx8fDE3NjU0MjM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // FERRAMENTAS PARA SERRALHEIROS
    {
      id: 12,
      nome: 'Serra Mármore 1400W Profissional',
      marca: 'Makita',
      preco: 456.90,
      precoOriginal: 599.00,
      desconto: 24,
      avaliacao: 4.9,
      vendidos: 198,
      categoria: 'ferramentas-serralheiro',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 13,
      nome: 'Máquina de Solda Inversora 200A',
      marca: 'V8 Brasil',
      preco: 678.90,
      precoOriginal: 890.00,
      desconto: 24,
      avaliacao: 4.8,
      vendidos: 156,
      categoria: 'ferramentas-serralheiro',
      img: 'https://images.unsplash.com/photo-1645258044234-f4ba2655baf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxkaW5nJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2NTQyMzY0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 14,
      nome: 'Esmerilhadeira Angular 850W',
      marca: 'Bosch',
      preco: 289.90,
      precoOriginal: 380.00,
      desconto: 24,
      avaliacao: 5.0,
      vendidos: 534,
      categoria: 'ferramentas-serralheiro',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 15,
      nome: 'Furadeira de Bancada 16mm',
      marca: 'Ferrari',
      preco: 1234.90,
      precoOriginal: 1650.00,
      desconto: 25,
      avaliacao: 4.9,
      vendidos: 87,
      categoria: 'ferramentas-serralheiro',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // EPIs E SEGURANÇA
    {
      id: 16,
      nome: 'Luva de Segurança Anticorte CA',
      marca: 'Proteplus',
      preco: 23.90,
      precoOriginal: 35.00,
      desconto: 32,
      avaliacao: 4.8,
      vendidos: 823,
      categoria: 'epi',
      img: 'https://images.unsplash.com/photo-1625562888409-14b30c2b17b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZldHklMjBnbG92ZXMlMjB3b3JrfGVufDF8fHx8MTc2NTQyMzY0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 17,
      nome: 'Óculos de Proteção Antirrisco',
      marca: '3M',
      preco: 34.90,
      precoOriginal: 48.00,
      desconto: 27,
      avaliacao: 5.0,
      vendidos: 645,
      categoria: 'epi',
      img: 'https://images.unsplash.com/photo-1625562888409-14b30c2b17b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZldHklMjBnbG92ZXMlMjB3b3JrfGVufDF8fHx8MTc2NTQyMzY0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 18,
      nome: 'Capacete de Segurança Branco',
      marca: 'Vonder',
      preco: 28.90,
      precoOriginal: 42.00,
      desconto: 31,
      avaliacao: 4.7,
      vendidos: 512,
      categoria: 'epi',
      img: 'https://images.unsplash.com/photo-1625562888409-14b30c2b17b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZldHklMjBnbG92ZXMlMjB3b3JrfGVufDF8fHx8MTc2NTQyMzY0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // BROCAS E BITS
    {
      id: 19,
      nome: 'Jogo de Brocas Widea 13 Peças',
      marca: 'Bosch',
      preco: 89.90,
      precoOriginal: 125.00,
      desconto: 28,
      avaliacao: 4.9,
      vendidos: 467,
      categoria: 'brocas',
      img: 'https://images.unsplash.com/photo-1581166418878-11f0dde922c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlsbCUyMGJpdHMlMjBzZXR8ZW58MXx8fHwxNzY1NDEwMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 20,
      nome: 'Broca Diamantada para Vidro 6mm',
      marca: 'Starfer',
      preco: 45.90,
      precoOriginal: 62.00,
      desconto: 26,
      avaliacao: 4.8,
      vendidos: 321,
      categoria: 'brocas',
      img: 'https://images.unsplash.com/photo-1581166418878-11f0dde922c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlsbCUyMGJpdHMlMjBzZXR8ZW58MXx8fHwxNzY1NDEwMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 21,
      nome: 'Kit 100 Bits Magnéticos Profissional',
      marca: 'Dewalt',
      preco: 134.90,
      precoOriginal: 185.00,
      desconto: 27,
      avaliacao: 5.0,
      vendidos: 289,
      categoria: 'brocas',
      img: 'https://images.unsplash.com/photo-1581166418878-11f0dde922c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlsbCUyMGJpdHMlMjBzZXR8ZW58MXx8fHwxNzY1NDEwMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // ADESIVOS E FITAS
    {
      id: 22,
      nome: 'Fita Dupla Face 3M VHB 19mm',
      marca: '3M',
      preco: 67.90,
      precoOriginal: 92.00,
      desconto: 26,
      avaliacao: 5.0,
      vendidos: 445,
      categoria: 'adesivos',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 23,
      nome: 'Fita Silver Tape 48mm x 30m',
      marca: 'Adere',
      preco: 28.90,
      precoOriginal: 38.00,
      desconto: 24,
      avaliacao: 4.7,
      vendidos: 678,
      categoria: 'adesivos',
      img: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjU0MjM2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },

    // NÍVEIS E MEDIÇÃO
    {
      id: 24,
      nome: 'Nível a Laser Automático 360°',
      marca: 'Stanley',
      preco: 389.90,
      precoOriginal: 520.00,
      desconto: 25,
      avaliacao: 4.9,
      vendidos: 234,
      categoria: 'medicao',
      img: 'https://images.unsplash.com/photo-1593307315564-c96172dc89dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFzdXJpbmclMjB0YXBlJTIwdG9vbHxlbnwxfHx8fDE3NjU0MjM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 25,
      nome: 'Trena Metálica 8m Profissional',
      marca: 'Vonder',
      preco: 34.90,
      precoOriginal: 48.00,
      desconto: 27,
      avaliacao: 4.8,
      vendidos: 789,
      categoria: 'medicao',
      img: 'https://images.unsplash.com/photo-1593307315564-c96172dc89dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFzdXJpbmclMjB0YXBlJTIwdG9vbHxlbnwxfHx8fDE3NjU0MjM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const categorias = [
    { id: 'todos', nome: 'Todos os produtos', count: produtos.length },
    { id: 'parafusos', nome: 'Parafusos e Fixação', count: produtos.filter(p => p.categoria === 'parafusos').length },
    { id: 'silicone', nome: 'Silicones e Vedação', count: produtos.filter(p => p.categoria === 'silicone').length },
    { id: 'ferramentas-vidro', nome: 'Ferramentas Vidraceiro', count: produtos.filter(p => p.categoria === 'ferramentas-vidro').length },
    { id: 'ferramentas-serralheiro', nome: 'Ferramentas Serralheiro', count: produtos.filter(p => p.categoria === 'ferramentas-serralheiro').length },
    { id: 'epi', nome: 'EPIs e Segurança', count: produtos.filter(p => p.categoria === 'epi').length },
    { id: 'brocas', nome: 'Brocas e Bits', count: produtos.filter(p => p.categoria === 'brocas').length },
    { id: 'adesivos', nome: 'Adesivos e Fitas', count: produtos.filter(p => p.categoria === 'adesivos').length },
    { id: 'medicao', nome: 'Medição e Nível', count: produtos.filter(p => p.categoria === 'medicao').length },
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-cyan-700 rounded-2xl w-full max-w-7xl shadow-2xl my-6">
        
        {/* HEADER */}
        <div className="border-b border-cyan-900 p-6 bg-gradient-to-r from-cyan-900/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {telaAtual !== 'produtos' && (
                <button
                  onClick={() => {
                    if (telaAtual === 'carrinho') setTelaAtual('produtos');
                    if (telaAtual === 'endereco') setTelaAtual('carrinho');
                    if (telaAtual === 'checkout') setTelaAtual('endereco');
                    if (telaAtual === 'confirmacao') onClose();
                  }}
                  className="w-10 h-10 bg-cyan-800 hover:bg-cyan-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}

              <div>
                <h2 className="text-cyan-400 text-2xl font-bold">Marketplace SYS</h2>
                <p className="text-cyan-300 text-sm">
                  {telaAtual === 'produtos' && 'Produtos para vidraceiros e serralheiros'}
                  {telaAtual === 'carrinho' && `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no carrinho`}
                  {telaAtual === 'endereco' && 'Confirmar endereço de entrega'}
                  {telaAtual === 'checkout' && 'Finalizar Pedido'}
                  {telaAtual === 'confirmacao' && 'Pedido Confirmado!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {telaAtual === 'produtos' && totalItens > 0 && (
                <button
                  onClick={() => setTelaAtual('carrinho')}
                  className="relative px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">{totalItens}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                    {totalItens}
                  </span>
                </button>
              )}
              <button onClick={onClose} className="text-cyan-400 hover:text-white transition-colors text-3xl">
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="p-6">
          
          {/* TELA: PRODUTOS */}
          {telaAtual === 'produtos' && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-4">
                <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Categorias</h3>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-600 text-white'
                          : 'text-cyan-300 hover:bg-cyan-900/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.nome}</span>
                        <span className="text-xs">{cat.count}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Banner Sr. Alex */}
                <div 
                  onClick={() => setShowLojaSrAlex(true)}
                  className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-xl p-4 border border-yellow-600 cursor-pointer hover:scale-105 transition-all"
                >
                  <img 
                    src={logoSrAlex} 
                    alt="Sr. Alex" 
                    className="w-24 h-24 object-contain mx-auto mb-2"
                  />
                  <div className="text-yellow-400 font-bold text-sm text-center mb-1">Sr. Alex</div>
                  <div className="text-yellow-300 text-xs text-center mb-3">Prótese Capilar</div>
                  <button className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-semibold transition-all">
                    Conhecer Serviços
                  </button>
                </div>
              </div>

              {/* Grid Produtos */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-2">
                  {produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden hover:border-cyan-600 hover:shadow-xl hover:shadow-cyan-900/20 transition-all group"
                    >
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
                      </div>

                      <div className="p-4">
                        <div className="text-cyan-500 text-xs mb-1">{produto.marca}</div>
                        <h4 className="text-white font-semibold mb-2 text-sm line-clamp-2 h-10">
                          {produto.nome}
                        </h4>

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

                        <div className="mb-3">
                          {produto.precoOriginal > produto.preco && (
                            <div className="text-neutral-600 text-xs line-through">
                              R$ {produto.precoOriginal.toFixed(2)}
                            </div>
                          )}
                          <div className="text-cyan-500 text-xl font-bold">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                        </div>

                        <button 
                          onClick={() => adicionarAoCarrinho(produto)}
                          className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
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
                  <ShoppingCart className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
                  <div className="text-white text-xl font-semibold mb-2">Carrinho vazio</div>
                  <div className="text-cyan-300 mb-6">Adicione produtos para continuar</div>
                  <button
                    onClick={() => setTelaAtual('produtos')}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-semibold"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                <>
                  {carrinho.map((item) => (
                    <div key={item.produto.id} className="bg-neutral-800/50 border border-cyan-700 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <ImageWithFallback
                          src={item.produto.img}
                          alt={item.produto.nome}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="text-cyan-500 text-xs mb-1">{item.produto.marca}</div>
                          <h4 className="text-white font-semibold mb-2">{item.produto.nome}</h4>
                          <div className="text-cyan-500 text-lg font-bold">
                            R$ {item.produto.preco.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                            className="w-8 h-8 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="text-white font-semibold w-8 text-center">{item.quantidade}</div>
                          <button
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                            className="w-8 h-8 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all flex items-center justify-center"
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

                  <div className="bg-neutral-800/50 border border-cyan-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-cyan-300">Subtotal</span>
                      <span className="text-white font-semibold">R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-cyan-300">Frete</span>
                      <span className="text-cyan-500 font-semibold">GRÁTIS</span>
                    </div>
                    <div className="border-t border-cyan-700 pt-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xl font-bold">Total</span>
                        <span className="text-cyan-500 text-2xl font-bold">
                          R$ {totalCarrinho.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setTelaAtual('endereco')}
                      className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-bold text-lg"
                    >
                      Continuar para Endereço de Entrega
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TELA: CONFIRMAR ENDEREÇO */}
          {telaAtual === 'endereco' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-cyan-900/20 border border-cyan-700 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-white font-bold text-xl">Confirmar Endereço de Entrega</h3>
                </div>
                <p className="text-neutral-400 text-sm">Preencha o endereço onde deseja receber seus produtos</p>
              </div>

              <div className="bg-neutral-800/50 border border-cyan-700 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-cyan-400 text-sm mb-2 block">Rua/Avenida *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.rua}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, rua: e.target.value })}
                      placeholder="Digite o nome da rua"
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-sm mb-2 block">Número *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.numero}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, numero: e.target.value })}
                      placeholder="Nº"
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-cyan-400 text-sm mb-2 block">Complemento</label>
                  <input
                    type="text"
                    value={enderecoEntrega.complemento}
                    onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, complemento: e.target.value })}
                    placeholder="Apartamento, bloco, etc"
                    className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cyan-400 text-sm mb-2 block">Bairro *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.bairro}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, bairro: e.target.value })}
                      placeholder="Digite o bairro"
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-sm mb-2 block">CEP *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.cep}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, cep: e.target.value })}
                      placeholder="00000-000"
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cyan-400 text-sm mb-2 block">Cidade *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.cidade}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, cidade: e.target.value })}
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-sm mb-2 block">Estado *</label>
                    <input
                      type="text"
                      value={enderecoEntrega.estado}
                      onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, estado: e.target.value })}
                      maxLength={2}
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTelaAtual('checkout')}
                disabled={!enderecoEntrega.rua || !enderecoEntrega.numero || !enderecoEntrega.bairro || !enderecoEntrega.cep}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar para Pagamento →
              </button>
            </div>
          )}

          {/* TELA: CHECKOUT */}
          {telaAtual === 'checkout' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Resumo */}
              <div className="bg-neutral-800/50 border border-cyan-700 rounded-xl p-6">
                <h3 className="text-cyan-400 font-bold mb-4">Resumo do Pedido</h3>
                <div className="space-y-2 mb-4">
                  {carrinho.map((item) => (
                    <div key={item.produto.id} className="flex justify-between text-sm">
                      <span className="text-cyan-300">{item.quantidade}x {item.produto.nome}</span>
                      <span className="text-white">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-cyan-700 pt-4 mb-4">
                  <div className="text-neutral-400 text-sm mb-2">Entregar em:</div>
                  <div className="text-white text-sm">
                    {enderecoEntrega.rua}, {enderecoEntrega.numero} {enderecoEntrega.complemento && `- ${enderecoEntrega.complemento}`}<br />
                    {enderecoEntrega.bairro} - {enderecoEntrega.cidade}/{enderecoEntrega.estado}<br />
                    CEP: {enderecoEntrega.cep}
                  </div>
                </div>
                <div className="border-t border-cyan-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-cyan-500">R$ {totalCarrinho.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-neutral-800/50 border border-cyan-700 rounded-xl p-6">
                <h3 className="text-cyan-400 font-bold mb-4">Escolha o método de pagamento</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setMetodoPagamento('pix')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPagamento === 'pix'
                        ? 'bg-cyan-700/20 border-cyan-600'
                        : 'bg-neutral-900 border-neutral-700 hover:border-cyan-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <QrCode className="w-8 h-8 text-cyan-500" />
                      <div className="text-left">
                        <div className="text-white font-semibold">PIX</div>
                        <div className="text-cyan-300 text-sm">Aprovação instantânea</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setMetodoPagamento('cartao')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPagamento === 'cartao'
                        ? 'bg-cyan-700/20 border-cyan-600'
                        : 'bg-neutral-900 border-neutral-700 hover:border-cyan-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-cyan-500" />
                      <div className="text-left">
                        <div className="text-white font-semibold">Cartão de Crédito</div>
                        <div className="text-cyan-300 text-sm">Até 12x sem juros</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* PIX */}
              {metodoPagamento === 'pix' && (
                <div className="bg-neutral-800/50 border border-cyan-600 rounded-xl p-6 animate-[fadeIn_0.3s]">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-black" />
                    </div>
                    <div className="text-white font-semibold mb-2">Escaneie o QR Code</div>
                    <div className="text-cyan-300 text-sm mb-4">Ou copie o código PIX abaixo:</div>
                    <div className="bg-neutral-900 border border-cyan-700 rounded-lg p-3 mb-4">
                      <div className="text-cyan-500 text-xs font-mono break-all">
                        00020126580014BR.GOV.BCB.PIX0136SYSCONECTA987654321012345678905204000053039865802BR5909SYSCONECTA6009SAO PAULO62070503***63042F8A
                      </div>
                    </div>
                    <button
                      onClick={finalizarPagamento}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-semibold"
                    >
                      Já fiz o pagamento
                    </button>
                  </div>
                </div>
              )}

              {/* CARTÃO */}
              {metodoPagamento === 'cartao' && (
                <div className="bg-neutral-800/50 border border-cyan-600 rounded-xl p-6 animate-[fadeIn_0.3s]">
                  <div className="space-y-4">
                    <div>
                      <label className="text-cyan-400 text-sm mb-2 block">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-neutral-900 border border-cyan-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-cyan-400 text-sm mb-2 block">Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full bg-neutral-900 border border-cyan-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        />
                      </div>
                      <div>
                        <label className="text-cyan-400 text-sm mb-2 block">CVV</label>
                        <input
                          type="text"
                          placeholder="000"
                          className="w-full bg-neutral-900 border border-cyan-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-cyan-400 text-sm mb-2 block">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMPLETO"
                        className="w-full bg-neutral-900 border border-cyan-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      />
                    </div>
                    <button
                      onClick={finalizarPagamento}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-semibold"
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
              <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 border-2 border-cyan-600 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-cyan-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-cyan-400" />
                </div>
                <h2 className="text-white text-3xl font-bold mb-4">Pedido Confirmado!</h2>
                <p className="text-cyan-300 text-lg mb-2">
                  Seu pedido #SYS{Math.floor(Math.random() * 10000)} foi realizado com sucesso
                </p>
                <p className="text-cyan-200 text-sm mb-8">
                  Entrega em até 5 dias úteis
                </p>
                
                <div className="bg-black/30 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-cyan-400" />
                    <span className="text-white font-semibold">Resumo do Pedido</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cyan-200">Total de itens:</span>
                      <span className="text-white font-semibold">{totalItens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200">Valor total:</span>
                      <span className="text-cyan-400 font-semibold">R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200">Pagamento:</span>
                      <span className="text-white font-semibold">
                        {metodoPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                      </span>
                    </div>
                    <div className="border-t border-cyan-700 pt-2 mt-2">
                      <div className="text-cyan-200 text-xs mb-1">Entregar em:</div>
                      <div className="text-white text-xs">
                        {enderecoEntrega.rua}, {enderecoEntrega.numero}<br />
                        {enderecoEntrega.bairro} - {enderecoEntrega.cidade}/{enderecoEntrega.estado}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-white hover:bg-cyan-50 text-cyan-900 rounded-lg transition-all font-bold text-lg"
                >
                  Voltar para Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Loja Sr. Alex */}
      {showLojaSrAlex && (
        <LojaSrAlex onClose={() => setShowLojaSrAlex(false)} />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}