import React, { useState, useEffect } from 'react';
import { 
  X, Ruler, Package, Eye, AlertCircle, CheckCircle,
  Calculator, Scissors, Weight, Settings, ChevronDown, ChevronRight
} from 'lucide-react';
import { DesenhoJanelaLimpo } from './DesenhoJanelaLimpo';

// ════════════════════════════════════════════════════════════════════
// 🎨 TIPOS
// ════════════════════════════════════════════════════════════════════

interface PerfilFormula {
  codigo: string;
  nome: string;
  formula: string;
  pesoKgMetro: number;
  tamanhoBarraDisponivel: number;
  kerfDisco: number;
  usinagens?: string;
  observacoes?: string;
}

interface VidroFormula {
  nome: string;
  larguraFormula: string;
  alturaFormula: string;
  espessuras: string[];
  cores: string[];
  observacoes: string;
}

interface AcessorioFormula {
  codigo: string;
  nome: string;
  tipo: 'FIXO' | 'FORMULA';
  quantidadeFixa?: number;
  formula?: string;
  unidade: 'UNIDADE' | 'METRO' | 'KG';
  observacoes?: string;
}

interface Tipologia {
  id: string;
  codigo: string;
  nome: string;
  linha: string;
  categoria: string;
  descricao: string;
  imagemUrl: string;
  perfis: PerfilFormula[];
  vidros: VidroFormula[];
  acessorios: AcessorioFormula[];
  opcionais: any[];
  acabamentosAluminio: string[];
  permiteReaproveitamento: boolean;
  normaTecnica: string;
  status: string;
}

interface PreviewTipologiaProps {
  tipologia: Tipologia;
  onClose: () => void;
  onAprovar: () => void;
}

interface MaterialCalculado {
  codigo: string;
  nome: string;
  comprimentoMM: number;
  quantidade: number;
  pesoTotal: number;
  barrasNecessarias: number;
  pecasPorBarra: number;
  sobra: number;
}

// ════════════════════════════════════════════════════════════════════
// 🎨 COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════

export function PreviewTipologia({ tipologia, onClose, onAprovar }: PreviewTipologiaProps) {
  // INPUTS DO USUÁRIO
  const [largura, setLargura] = useState(1200); // mm
  const [altura, setAltura] = useState(1200); // mm
  const [quantidade, setQuantidade] = useState(1);
  const [acabamento, setAcabamento] = useState(tipologia.acabamentosAluminio[0] || 'Branco');
  const [corVidro, setCorVidro] = useState(tipologia.vidros[0]?.cores[0] || 'Clear (Incolor)');
  const [espessuraVidro, setEspessuraVidro] = useState(tipologia.vidros[0]?.espessuras[0] || '8mm');
  
  // RESULTADOS CALCULADOS
  const [perfisCalculados, setPerfisCalculados] = useState<MaterialCalculado[]>([]);
  const [vidrosCalculados, setVidrosCalculados] = useState<any[]>([]);
  const [acessoriosCalculados, setAcessoriosCalculados] = useState<any[]>([]);
  const [pesoTotal, setPesoTotal] = useState(0);
  const [pesoVidro, setPesoVidro] = useState(0);
  
  // UI
  const [secaoExpandida, setSecaoExpandida] = useState<string>('simulador');

  // ════════════════════════════════════════════════════════════════════
  // 🧮 CÁLCULOS EM TEMPO REAL
  // ════════════════════════════════════════════════════════════════════

  useEffect(() => {
    calcularMateriais();
    // EXPANDIR TODAS AS SEÇÕES POR PADRÃO
    setSecaoExpandida('TUDO');
  }, [largura, altura, quantidade, espessuraVidro, corVidro]);

  const calcularMateriais = () => {
    const L = largura;
    const H = altura;
    const Qtd = quantidade;

    // ══════════════════════════════════════════════════════════════
    // 1️⃣ CALCULAR PERFIS DE ALUMÍNIO
    // ═══════════════════════════════════════════════════════════════
    const perfisCalc: MaterialCalculado[] = tipologia.perfis.map(perfil => {
      // Calcular comprimento individual usando a fórmula
      const comprimentoIndividual = avaliarFormula(perfil.formula, L, H);
      
      // IMPORTANTE: Se a fórmula já tem multiplicação (ex: H*2), 
      // significa que cada JANELA precisa dessa quantidade total
      // Não multiplica novamente por Qtd aqui!
      
      const tamanhoUtil = perfil.tamanhoBarraDisponivel;
      const kerfTotal = perfil.kerfDisco;
      
      // Calcular quantas peças INDIVIDUAIS cabem em uma barra
      // Por exemplo: se comprimentoIndividual = 2400 (que é H*2 = 1200*2)
      // Na verdade são 2 peças de 1200mm cada
      
      // Detectar se a fórmula tem multiplicação
      const temMultiplicacao = perfil.formula.includes('*');
      let comprimentoPorPeca = comprimentoIndividual;
      let pecasPorJanela = 1;
      
      if (temMultiplicacao) {
        // Extrair o multiplicador
        const match = perfil.formula.match(/\*\s*(\d+)/);
        if (match) {
          const multiplicador = parseInt(match[1]);
          comprimentoPorPeca = comprimentoIndividual / multiplicador;
          pecasPorJanela = multiplicador;
        }
      }
      
      // Quantas peças dessa medida cabem em uma barra
      const pecasPorBarra = Math.floor(tamanhoUtil / (comprimentoPorPeca + kerfTotal));
      
      // Total de peças necessárias
      const totalPecasNecessarias = pecasPorJanela * Qtd;
      
      // Calcular quantas barras são necessárias
      const barrasNecessarias = Math.ceil(totalPecasNecessarias / (pecasPorBarra || 1));
      
      // Calcular sobra POR BARRA
      const totalUtilizadoPorBarra = (comprimentoPorPeca * Math.min(pecasPorBarra, totalPecasNecessarias)) + (kerfTotal * Math.min(pecasPorBarra - 1, totalPecasNecessarias - 1));
      const sobra = tamanhoUtil - totalUtilizadoPorBarra;
      
      // Calcular peso
      const comprimentoTotalMetros = (comprimentoIndividual * Qtd) / 1000;
      const pesoTotal = comprimentoTotalMetros * perfil.pesoKgMetro;

      return {
        codigo: perfil.codigo,
        nome: perfil.nome,
        comprimentoMM: comprimentoPorPeca,
        quantidade: totalPecasNecessarias,
        pesoTotal,
        barrasNecessarias,
        pecasPorBarra: pecasPorBarra || 0,
        sobra
      };
    });

    setPerfisCalculados(perfisCalc);

    // ═══════════════════════════════════════════════════════════════
    // 2️⃣ CALCULAR VIDROS
    // ═══════════════════════════════════════════════════════════════
    const vidrosCalc = tipologia.vidros.map(vidro => {
      const larguraVidro = avaliarFormula(vidro.larguraFormula, L, H);
      const alturaVidro = avaliarFormula(vidro.alturaFormula, L, H);
      
      // Área em m²
      const areaM2 = (larguraVidro / 1000) * (alturaVidro / 1000);
      
      // Peso do vidro (kg/m²)
      let pesoPorM2 = 10; // padrão 4mm
      if (espessuraVidro === '6mm') pesoPorM2 = 15;
      if (espessuraVidro === '8mm') pesoPorM2 = 20;
      
      const pesoVidro = areaM2 * pesoPorM2 * Qtd;

      return {
        nome: vidro.nome,
        larguraMM: larguraVidro,
        alturaMM: alturaVidro,
        areaM2,
        espessura: espessuraVidro,
        cor: corVidro,
        pesoKg: pesoVidro,
        quantidade: Qtd
      };
    });

    setVidrosCalculados(vidrosCalc);

    // Peso total dos vidros
    const pesoTotalVidros = vidrosCalc.reduce((sum, v) => sum + v.pesoKg, 0);
    setPesoVidro(pesoTotalVidros);

    // ═══════════════════════════════════════════════════════════════
    // 3️⃣ CALCULAR ACESSÓRIOS
    // ═══════════════════════════════════════════════════════════════
    const acessoriosCalc = tipologia.acessorios.map(acessorio => {
      let quantidadeFinal = 0;

      if (acessorio.tipo === 'FIXO') {
        quantidadeFinal = (acessorio.quantidadeFixa || 0) * Qtd;
      } else {
        // FORMULA
        quantidadeFinal = avaliarFormula(acessorio.formula || '0', L, H) * Qtd;
      }

      // Regra especial: ROLDANAS mudam conforme espessura do vidro
      let codigoFinal = acessorio.codigo;
      let nomeFinal = acessorio.nome;
      
      if (acessorio.codigo === 'RO-42' || acessorio.codigo === 'RO-44') {
        if (espessuraVidro === '4mm' || espessuraVidro === '6mm') {
          codigoFinal = 'RO-42';
          nomeFinal = 'Roldana 4 Rodas (4mm/6mm)';
          // Se for RO-44, zerar a quantidade
          if (acessorio.codigo === 'RO-44') quantidadeFinal = 0;
        } else if (espessuraVidro === '8mm') {
          codigoFinal = 'RO-44';
          nomeFinal = 'Roldana 4 Rodas (8mm)';
          // Se for RO-42, zerar a quantidade
          if (acessorio.codigo === 'RO-42') quantidadeFinal = 0;
        }
      }

      return {
        codigo: codigoFinal,
        nome: nomeFinal,
        quantidade: quantidadeFinal,
        unidade: acessorio.unidade,
        observacoes: acessorio.observacoes
      };
    }).filter(a => a.quantidade > 0); // Remove itens com quantidade zero

    setAcessoriosCalculados(acessoriosCalc);

    // ═══════════════════════════════════════════════════════════════
    // 4️⃣ CALCULAR PESO TOTAL
    // ═══════════════════════════════════════════════════════════════
    const pesoAluminio = perfisCalc.reduce((sum, p) => sum + p.pesoTotal, 0);
    const pesoTotalFinal = pesoAluminio + pesoTotalVidros;
    setPesoTotal(pesoTotalFinal);
  };

  // ════════════════════════════════════════════════════════════════════
  // 🧮 AVALIADOR DE FÓRMULAS
  // ════════════════════════════════════════════════════════════════════

  const avaliarFormula = (formula: string, L: number, H: number): number => {
    try {
      // Substituir L e H pelos valores
      let expressao = formula.replace(/L/g, L.toString()).replace(/H/g, H.toString());
      
      // Função segura para avaliar sem usar eval
      // Suporta operações básicas: +, -, *, /, (, )
      const resultado = new Function('return ' + expressao)();
      
      return Math.round(resultado * 100) / 100; // Arredondar para 2 casas decimais
    } catch (error) {
      console.error('Erro ao avaliar fórmula:', formula, error);
      return 0;
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // 🎨 DESENHO TÉCNICO 2D
  // ════════════════════════════════════════════════════════════════════

  const renderDesenhoTecnico = () => {
    // Se for L001 (Janela Suprema 2 Folhas), usar o desenho específico melhorado
    if (tipologia.codigo === 'L001') {
      return (
        <DesenhoJanelaLimpo
          largura={largura}
          altura={altura}
          corVidro={corVidro}
          espessuraVidro={espessuraVidro}
          vidrosCalculados={vidrosCalculados}
        />
      );
    }
    
    // Desenho genérico para outras tipologias
    const escala = 0.2;
    const larguraPx = largura * escala;
    const alturaPx = altura * escala;
    
    const maxWidth = 600;
    const maxHeight = 500;
    
    let escalaFinal = escala;
    if (larguraPx > maxWidth) escalaFinal = maxWidth / largura;
    if (alturaPx > maxHeight) escalaFinal = Math.min(escalaFinal, maxHeight / altura);
    
    const w = largura * escalaFinal;
    const h = altura * escalaFinal;
    const espessuraPerfil = 8; // Espessura visual dos perfis

    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 flex items-center justify-center min-h-[600px]">
        <div className="relative">
          <svg width={w + 120} height={h + 120} className="rounded-lg shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Grid de fundo para referência */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
              </pattern>
              
              {/* Gradientes para profundidade */}
              <linearGradient id="aluminioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              
              <linearGradient id="vidroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getCorVidro(corVidro)} stopOpacity="0.7" />
                <stop offset="100%" stopColor={getCorVidro(corVidro)} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Grid de fundo */}
            <rect x="0" y="0" width={w + 120} height={h + 120} fill="url(#grid)" />
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* TRILHO INFERIOR (SU-002) - Base */}
            {/* ═══════════════════════════════════════════════════ */}
            <rect
              x={50}
              y={50 + h - espessuraPerfil}
              width={w}
              height={espessuraPerfil * 2}
              fill="url(#aluminioGradient)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x={50 + w/2} y={50 + h + 35} textAnchor="middle" className="text-[10px]" fill="#1E40AF" fontWeight="bold">
              SU-002 Trilho Inferior (L={largura}mm)
            </text>
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* TRILHO SUPERIOR (SU-001) - Topo */}
            {/* ═══════════════════════════════════════════════════ */}
            <rect
              x={50}
              y={50}
              width={w}
              height={espessuraPerfil * 2}
              fill="url(#aluminioGradient)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x={50 + w/2} y={40} textAnchor="middle" className="text-[10px]" fill="#1E40AF" fontWeight="bold">
              SU-001 Trilho Superior (L={largura}mm)
            </text>
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* MARCO LATERAL ESQUERDO (SU-003) */}
            {/* ═══════════════════════════════════════════════════ */}
            <rect
              x={50 - espessuraPerfil}
              y={50}
              width={espessuraPerfil * 2}
              height={h}
              fill="url(#aluminioGradient)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* MARCO LATERAL DIREITO (SU-003) */}
            {/* ═══════════════════════════════════════════════════ */}
            <rect
              x={50 + w - espessuraPerfil}
              y={50}
              width={espessuraPerfil * 2}
              height={h}
              fill="url(#aluminioGradient)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            
            {/* Dimensão altura */}
            <line x1={35} y1={50} x2={35} y2={50 + h} stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowgreen)" markerStart="url(#arrowgreen)" />
            <text x={20} y={50 + h/2} textAnchor="middle" className="text-[11px]" fill="#10B981" fontWeight="bold" transform={`rotate(-90, 20, ${50 + h/2})`}>
              H = {altura}mm
            </text>
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* FOLHA ESQUERDA (MÓVEL) */}
            {/* ═══════════════════════════════════════════════════ */}
            <g>
              {/* Montante Lateral Esquerdo (SU-041) */}
              <rect
                x={50 + espessuraPerfil + 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={espessuraPerfil}
                height={h - (espessuraPerfil * 4) - 10}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* Montante Central Macho (SU-039) */}
              <rect
                x={50 + w/2 - espessuraPerfil - 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={espessuraPerfil}
                height={h - (espessuraPerfil * 4) - 10}
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              
              {/* Travessa Superior Folha (SU-042) */}
              <rect
                x={50 + espessuraPerfil + 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={(w/2) - espessuraPerfil - 4}
                height={espessuraPerfil}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* Travessa Inferior Folha (SU-042) */}
              <rect
                x={50 + espessuraPerfil + 2}
                y={50 + h - espessuraPerfil * 3 - 5}
                width={(w/2) - espessuraPerfil - 4}
                height={espessuraPerfil}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* VIDRO ESQUERDO */}
              {vidrosCalculados[0] && (
                <>
                  <rect
                    x={50 + espessuraPerfil * 2 + 4}
                    y={50 + espessuraPerfil * 3 + 7}
                    width={(w/2) - (espessuraPerfil * 3) - 8}
                    height={h - (espessuraPerfil * 6) - 14}
                    fill="url(#vidroGradient)"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    rx="2"
                  />
                  {/* Reflexo do vidro */}
                  <rect
                    x={50 + espessuraPerfil * 2 + 6}
                    y={50 + espessuraPerfil * 3 + 9}
                    width={(w/2) - (espessuraPerfil * 3) - 20}
                    height={(h - (espessuraPerfil * 6) - 14) / 3}
                    fill="white"
                    opacity="0.3"
                    rx="1"
                  />
                </>
              )}
            </g>
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* FOLHA DIREITA (MÓVEL) */}
            {/* ═══════════════════════════════════════════════════ */}
            <g>
              {/* Montante Central Fêmea (SU-040) */}
              <rect
                x={50 + w/2 + 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={espessuraPerfil}
                height={h - (espessuraPerfil * 4) - 10}
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              
              {/* Montante Lateral Direito (SU-041) */}
              <rect
                x={50 + w - espessuraPerfil * 2 - 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={espessuraPerfil}
                height={h - (espessuraPerfil * 4) - 10}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* Travessa Superior Folha (SU-042) */}
              <rect
                x={50 + w/2 + 2}
                y={50 + espessuraPerfil * 2 + 5}
                width={(w/2) - espessuraPerfil - 4}
                height={espessuraPerfil}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* Travessa Inferior Folha (SU-042) */}
              <rect
                x={50 + w/2 + 2}
                y={50 + h - espessuraPerfil * 3 - 5}
                width={(w/2) - espessuraPerfil - 4}
                height={espessuraPerfil}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* VIDRO DIREITO */}
              {vidrosCalculados[1] && (
                <>
                  <rect
                    x={50 + w/2 + espessuraPerfil + 4}
                    y={50 + espessuraPerfil * 3 + 7}
                    width={(w/2) - (espessuraPerfil * 3) - 8}
                    height={h - (espessuraPerfil * 6) - 14}
                    fill="url(#vidroGradient)"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    rx="2"
                  />
                  {/* Reflexo do vidro */}
                  <rect
                    x={50 + w/2 + espessuraPerfil + 6}
                    y={50 + espessuraPerfil * 3 + 9}
                    width={(w/2) - (espessuraPerfil * 3) - 20}
                    height={(h - (espessuraPerfil * 6) - 14) / 3}
                    fill="white"
                    opacity="0.3"
                    rx="1"
                  />
                </>
              )}
            </g>
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* ROLDANAS (indicativo) */}
            {/* ═══════════════════════════════════════════════════ */}
            {/* Roldanas folha esquerda */}
            <circle cx={50 + w/4 - 15} cy={50 + h - espessuraPerfil} r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <circle cx={50 + w/4 + 15} cy={50 + h - espessuraPerfil} r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            
            {/* Roldanas folha direita */}
            <circle cx={50 + (3*w/4) - 15} cy={50 + h - espessuraPerfil} r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <circle cx={50 + (3*w/4) + 15} cy={50 + h - espessuraPerfil} r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            
            {/* Dimensão largura */}
            <line x1={50} y1={h + 70} x2={50 + w} y2={h + 70} stroke="#3B82F6" strokeWidth="2" />
            <line x1={50} y1={h + 65} x2={50} y2={h + 75} stroke="#3B82F6" strokeWidth="2" />
            <line x1={50 + w} y1={h + 65} x2={50 + w} y2={h + 75} stroke="#3B82F6" strokeWidth="2" />
            <text x={50 + w/2} y={h + 85} textAnchor="middle" className="text-[12px]" fill="#3B82F6" fontWeight="bold">
              L = {largura}mm
            </text>
            
            {/* Setas indicando movimento */}
            <text x={50 + w/4} y={50 + h/2} textAnchor="middle" className="text-2xl" opacity="0.5">←</text>
            <text x={50 + (3*w/4)} y={50 + h/2} textAnchor="middle" className="text-2xl" opacity="0.5">→</text>
          </svg>

          {/* Legenda Profissional */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-gradient-to-r from-slate-400 to-slate-300 border border-slate-600 rounded"></div>
              <span className="text-gray-700">Perfis Estruturais (Trilhos/Marcos)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-slate-500 border border-slate-700 rounded"></div>
              <span className="text-gray-700">Perfis Folhas Móveis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-orange-500 border border-orange-700 rounded"></div>
              <span className="text-gray-700">Montantes Centrais (Macho/Fêmea)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-3 border-2 border-blue-600 border-dashed rounded`} style={{backgroundColor: getCorVidro(corVidro), opacity: 0.6}}></div>
              <span className="text-gray-700">Vidro {espessuraVidro} {corVidro}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 border border-red-900 rounded-full"></div>
              <span className="text-gray-700">Roldanas (RO-42 ou RO-44)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl opacity-50">← →</span>
              <span className="text-gray-700">Direção de abertura</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCorVidro = (cor: string): string => {
    const cores: any = {
      'Clear (Incolor)': '#E0F2FE',
      'French Green': '#86EFAC',
      'Euro Grey': '#9CA3AF',
      'Royal Silver': '#C0C0C0',
      'Sky Blue': '#7DD3FC',
      'Neutral': '#D1D5DB'
    };
    return cores[cor] || '#E0F2FE';
  };

  // ═══════════════════════════════════════════════════════════════════
  // 🎨 PLANO DE CORTE (BARRAS DE 6M)
  // ════════════════════════════════════════════════════════════════════

  const renderPlanoCorte = (material: MaterialCalculado) => {
    const barraTotal = 6000; // mm
    const escala = 0.08; // px por mm
    const barraWidth = barraTotal * escala;
    
    // ══════════════════════���════════════════════════════════════════
    // CÁLCULO CORRETO: Mostrar apenas as peças QUE VÃO SER CORTADAS
    // e a SOBRA restante
    // ═══════════════════════════════════════════════════════════════
    
    const cortes = [];
    const kerfWidth = 5 * escala; // Largura do disco de corte
    
    let posicao = 0;
    let totalUtilizado = 0;
    
    // Quantas peças REALMENTE serão cortadas desta barra
    const pecasNestaBarra = Math.min(material.pecasPorBarra, material.quantidade);
    
    for (let i = 0; i < pecasNestaBarra; i++) {
      cortes.push({
        x: posicao,
        width: material.comprimentoMM * escala,
        label: `${material.comprimentoMM}mm`
      });
      
      totalUtilizado += material.comprimentoMM;
      posicao += (material.comprimentoMM * escala);
      
      // Adicionar kerf (perda do disco) entre cortes
      if (i < pecasNestaBarra - 1) {
        posicao += kerfWidth;
        totalUtilizado += 5; // 5mm de perda por corte
      }
    }
    
    // SOBRA = Barra total - Total utilizado
    const sobra = barraTotal - totalUtilizado;
    const sobraWidth = sobra * escala;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-semibold">{material.codigo} - {material.nome}</span>
          <span className="text-blue-600">{material.barrasNecessarias} barra(s) de 6m necessárias</span>
        </div>
        
        <div className="relative bg-gray-300 rounded h-14 overflow-hidden border-2 border-gray-400" style={{ width: barraWidth }}>
          {/* Cortes */}
          {cortes.map((corte, idx) => (
            <div 
              key={idx}
              className="absolute top-0 h-full bg-blue-600 flex items-center justify-center border-r-2 border-red-500"
              style={{ 
                left: corte.x,
                width: corte.width
              }}
            >
              <span className="text-white text-[10px] font-bold truncate px-1">{corte.label}</span>
            </div>
          ))}
          
          {/* Sobra */}
          {sobra > 0 && (
            <div 
              className="absolute top-0 h-full bg-orange-400 flex items-center justify-center border-l-2 border-dashed border-orange-700"
              style={{ 
                left: posicao,
                width: sobraWidth
              }}
            >
              <span className="text-orange-900 text-[10px] font-bold">SOBRA: {Math.round(sobra)}mm</span>
            </div>
          )}
        </div>
        
        {/* Info detalhada */}
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>✂️ Cortes: {pecasNestaBarra}x {material.comprimentoMM}mm = {totalUtilizado}mm usado</span>
          <span className="text-orange-600">📦 Sobra: {Math.round(sobra)}mm ({((sobra/barraTotal)*100).toFixed(1)}%)</span>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ════════════════════════════════════════════════════════════════════

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-6 h-6" />
              <h2 className="text-2xl">🔍 Preview & Teste de Tipologia</h2>
            </div>
            <p className="text-blue-100 text-sm">
              {tipologia.codigo} - {tipologia.nome} ({tipologia.linha})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUNA 1: SIMULADOR DE ENTRADA */}
            <div className="space-y-6">
              {/* Simulador */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200">
                <div className="p-4 border-b bg-blue-50 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">🎯 Simulador de Orçamento</h3>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Largura (L) em mm *</label>
                    <input
                      type="number"
                      value={largura}
                      onChange={(e) => setLargura(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      min="100"
                      max="6000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Altura (H) em mm *</label>
                    <input
                      type="number"
                      value={altura}
                      onChange={(e) => setAltura(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      min="100"
                      max="3000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Quantidade *</label>
                    <input
                      type="number"
                      value={quantidade}
                      onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-gray-700 text-sm mb-2">Acabamento Alumínio</label>
                    <select
                      value={acabamento}
                      onChange={(e) => setAcabamento(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      {tipologia.acabamentosAluminio.map(ac => (
                        <option key={ac} value={ac}>{ac}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Cor do Vidro Guardian Glass</label>
                    <select
                      value={corVidro}
                      onChange={(e) => setCorVidro(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      {tipologia.vidros[0]?.cores.map(cor => (
                        <option key={cor} value={cor}>{cor}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">⚠️ Espessura do Vidro (Muda Roldanas!)</label>
                    <select
                      value={espessuraVidro}
                      onChange={(e) => setEspessuraVidro(e.target.value)}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 bg-yellow-50"
                    >
                      {tipologia.vidros[0]?.espessuras.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Vidro 4mm/6mm = RO-42 | Vidro 8mm = RO-44
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo de Pesos */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Weight className="w-5 h-5 text-green-600" />
                  ⚖️ Peso Total
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Alumínio</span>
                    <span className="text-gray-900">{(pesoTotal - pesoVidro).toFixed(2)} kg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Vidro {espessuraVidro}</span>
                    <span className="text-gray-900">{pesoVidro.toFixed(2)} kg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-600">
                    <span className="text-gray-900">TOTAL</span>
                    <span className="text-green-700 text-xl">{pesoTotal.toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA 2: DESENHO TÉCNICO */}
            <div className="lg:col-span-2 space-y-6">
              {/* Desenho 2D */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200">
                <div className="p-4 border-b bg-purple-50">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-purple-600" />
                    📐 Desenho Técnico 2D
                  </h3>
                </div>
                {renderDesenhoTecnico()}
              </div>
            </div>
          </div>

          {/* SEÇÃO: LISTA DE MATERIAIS CALCULADOS */}
          <div className="mt-6 space-y-6">
            {/* Perfis de Alumínio */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200">
              <div className="p-4 border-b bg-blue-50 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">🔩 Perfis de Alumínio ({perfisCalculados.length}) - SOBRAS E APROVEITAMENTO</h3>
              </div>

              <div className="p-4 space-y-4">
                {perfisCalculados.map((material, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">{material.codigo} - {material.nome}</p>
                        <p className="text-gray-600 text-sm">
                          {material.quantidade}x de {material.comprimentoMM}mm = {(material.comprimentoMM * material.quantidade).toFixed(0)}mm total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{material.pesoTotal.toFixed(3)} kg</p>
                        <p className="text-gray-600 text-xs">{material.barrasNecessarias} barra(s)</p>
                      </div>
                    </div>
                    
                    {/* Plano de Corte */}
                    {material.barrasNecessarias > 0 && renderPlanoCorte(material)}
                    
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
                      <div>
                        <span className="text-gray-600 block">Peças/Barra</span>
                        <span className="text-gray-900">{material.pecasPorBarra}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Sobra</span>
                        <span className="text-orange-600">{Math.round(material.sobra)}mm</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Barras</span>
                        <span className="text-blue-600">{material.barrasNecessarias}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vidros */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200">
              <div className="p-4 border-b bg-blue-50 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">🪟 Vidros Temperados ({vidrosCalculados.length}) - DIMENSÕES EXATAS</h3>
              </div>

              <div className="p-4 space-y-4">
                {vidrosCalculados.map((vidro, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-900">{vidro.nome}</p>
                        <p className="text-gray-600 text-sm">{vidro.cor} - {vidro.espessura}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{vidro.pesoKg.toFixed(2)} kg</p>
                        <p className="text-gray-600 text-xs">{vidro.quantidade}x peça(s)</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm bg-white rounded p-3">
                      <div>
                        <span className="text-gray-600 block text-xs">Largura</span>
                        <span className="text-gray-900">{vidro.larguraMM.toFixed(0)}mm</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs">Altura</span>
                        <span className="text-gray-900">{vidro.alturaMM.toFixed(0)}mm</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs">Área</span>
                        <span className="text-gray-900">{vidro.areaM2.toFixed(2)}m²</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acessórios */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
              <div className="p-4 border-b bg-green-50 flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900">🔧 Acessórios ({acessoriosCalculados.length}) - QUANTIDADES CALCULADAS</h3>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acessoriosCalculados.map((acessorio, idx) => (
                    <div key={idx} className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 text-sm">{acessorio.codigo}</p>
                        <p className="text-gray-600 text-xs">{acessorio.nome}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{acessorio.quantidade.toFixed(2)}</p>
                        <p className="text-gray-600 text-xs">{acessorio.unidade}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ⚠️ Roldanas mudam automaticamente: Vidro 4mm/6mm usa RO-42, Vidro 8mm usa RO-44
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Ações */}
        <div className="bg-gray-50 border-t p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Tipologia testada e validada</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onAprovar();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              ✅ Aprovar Tipologia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}