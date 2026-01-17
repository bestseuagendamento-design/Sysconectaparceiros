import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  Calendar, 
  MapPin, 
  FileText, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Printer,
  Edit,
  ArrowLeft,
  Search,
  Filter,
  CreditCard,
  Upload,
  User,
  Phone,
  Mail,
  MoreVertical,
  Trash2,
  Save,
  Send,
  Loader2,
  Copy,
  ShoppingCart,
  Plus // NOVO
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'motion/react';
import { cloudStorage } from '../utils/cloudStorage';

interface ResumoOrcamentoCompletoProps {
  orcamentoId: string;
  clienteInfo: any;
  materiais: any[];
  config: any;
  onVoltar: () => void;
  isFornecedor?: boolean; // Flag para saber se é visão de fornecedor
  onDashboard?: () => void;
  onNovoOrcamento?: () => void;
  onAdicionarMaisItens?: () => void; // NOVO
}

export function ResumoOrcamentoCompleto({ 
  orcamentoId, 
  clienteInfo, 
  materiais = [], 
  config = {}, 
  onVoltar,
  isFornecedor = false,
  onDashboard,
  onNovoOrcamento,
  onAdicionarMaisItens // NOVO
}: ResumoOrcamentoCompletoProps) {
  
  const [loading, setLoading] = useState(false);
  const [margemLucro, setMargemLucro] = useState(30);
  const [statusOrcamento, setStatusOrcamento] = useState('rascunho'); // rascunho, aprovado, produção, entregue
  const [modalEnviarCliente, setModalEnviarCliente] = useState(false);
  const [modalSolicitarMaterial, setModalSolicitarMaterial] = useState(false);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState({});
  const [pagamentosRealizados, setPagamentosRealizados] = useState({});
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [usuarioEstado, setUsuarioEstado] = useState('SC'); // Default
  const [comprovantes, setComprovantes] = useState<{[key: string]: File | null}>({});
  const [qrCopiado, setQrCopiado] = useState<string | null>(null);
  const [condicaoPagamento, setCondicaoPagamento] = useState<{[key: string]: '50%' | '100%'}>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false); // NOVO MODAL DE SUCESSO

  // Dados do usuário logado (simulado)
  const usuarioId = localStorage.getItem('sysconecta_user_id');
  const usuarioRole = localStorage.getItem('sysconecta_user_role');

  // MOCK: Fornecedores por categoria (Em produção viria do banco)
  const fornecedores = {
    'vidro': { id: 'forn-vidro-01', nomeEmpresa: 'Santa Rita Vidros', avaliacao: 4.8, tempoEntrega: '3-5 dias', minPedido: 500 },
    'aluminio': { id: 'forn-alum-01', nomeEmpresa: 'Alumínios SC', avaliacao: 4.5, tempoEntrega: '2-3 dias', minPedido: 300 },
    'acessorio': { id: 'forn-ace-01', nomeEmpresa: 'Ferragens Total', avaliacao: 4.7, tempoEntrega: '1-2 dias', minPedido: 100 }
  };

  useEffect(() => {
    // Tentar pegar o estado do usuário
    const userData = localStorage.getItem('sysconecta_usuario_dados');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.estado) setUsuarioEstado(parsed.estado);
      } catch (e) {}
    }
  }, []);

  // Calcular totais
  const safeMateriais = Array.isArray(materiais) ? materiais : [];
  const totalMateriais = safeMateriais.reduce((acc, curr) => acc + curr.total, 0);
  const lucro = totalMateriais * (margemLucro / 100);
  const totalComLucro = totalMateriais + lucro;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadPDF();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("ORÇAMENTO", 20, 25);
    doc.setFontSize(10);
    doc.text(`ID: #${orcamentoId}`, 20, 32);
    
    // Info Cliente
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(12);
    doc.text("DADOS DO CLIENTE", 20, 55);
    doc.setFontSize(10);
    doc.text(`Nome: ${clienteInfo?.nome || '-'}`, 20, 62);
    doc.text(`Telefone: ${clienteInfo?.telefone || '-'}`, 20, 68);
    doc.text(`Endereço: ${clienteInfo?.endereco || '-'}`, 20, 74);
    
    // Info Projeto
    doc.setFontSize(12);
    doc.text("DETALHES DO PROJETO", 120, 55);
    doc.setFontSize(10);
    doc.text(`Largura: ${config?.largura_total_mm || 0}mm`, 120, 62);
    doc.text(`Altura: ${config?.altura_total_mm || 0}mm`, 120, 68);
    doc.text(`Vidro: ${config?.tipo_vidro || '-'} ${config?.espessura_vidro || 0}mm`, 120, 74);
    
    // Tabela Materiais
    const tableData = safeMateriais.flatMap(m => 
      m.items.map((item: any) => [
        item.codigo,
        item.descricao,
        item.quantidade,
        `R$ ${item.total.toFixed(2)}`
      ])
    );
    
    autoTable(doc, {
      startY: 90,
      head: [['Código', 'Descrição', 'Qtd', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });
    
    // Totais
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: R$ ${totalComLucro.toFixed(2)}`, 140, finalY);
    
    doc.save(`orcamento-${orcamentoId}.pdf`);
  };

  const handleWhatsApp = () => {
    const text = `Olá ${clienteInfo?.nome || ''}, segue orçamento referente ao projeto de esquadrias.\n\nValor Total: R$ ${totalComLucro.toFixed(2)}\n\nPodemos agendar uma visita para medição final?`;
    window.open(`https://wa.me/55${clienteInfo?.telefone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const salvarOrcamento = async () => {
    setLoading(true);
    try {
        // Objeto do Orçamento Completo para "Meus Orçamentos"
        const orcamentoSalvo = {
            id: orcamentoId || `orc-${Date.now()}`,
            dataCriacao: new Date().toISOString(),
            cliente: clienteInfo,
            config: config, // Configuração do último item ou global
            materiais: safeMateriais, // Lista completa de materiais (já unificada se tiver múltiplos itens)
            total: totalComLucro,
            status: 'salvo',
            // Preserva itens individuais se existirem na prop materiais (depende da estrutura que vem do OrcamentoManual)
        };

        // Salvar na lista de "Meus Orçamentos" (localStorage Scoped)
        const key = `sysconecta_meus_orcamentos_${usuarioId}`;
        const stored = localStorage.getItem(key);
        const lista = stored ? JSON.parse(stored) : [];
        
        // Verifica se já existe e atualiza, ou adiciona novo
        const index = lista.findIndex((o: any) => o.id === orcamentoSalvo.id);
        if (index >= 0) {
            lista[index] = orcamentoSalvo;
        } else {
            lista.push(orcamentoSalvo);
        }
        
        localStorage.setItem(key, JSON.stringify(lista));
        
        await new Promise(r => setTimeout(r, 800));
        toast.success('Orçamento salvo em "Meus Orçamentos"!');
        setStatusOrcamento('salvo');
        
        // Disparar evento para atualizar listas em outras telas
        window.dispatchEvent(new Event('orcamentos_updated'));
        
    } catch (error) {
        console.error("Erro ao salvar", error);
        toast.error('Erro ao salvar orçamento');
    } finally {
        setLoading(false);
    }
  };

  const handleAprovarOrcamento = async () => {
    setLoading(true);
    try {
        // Lógica específica para o fornecedor aprovar o orçamento recebido do vidraceiro
        // Isso seria enviar para produção interna
        await new Promise(r => setTimeout(r, 1500));
        toast.success('Orçamento aprovado e enviado para produção!');
        // Atualizar status no banco
    } catch (error) {
        toast.error('Erro ao aprovar orçamento');
    } finally {
        setLoading(false);
    }
  };

  const copiarQRCode = async (cnpj: string, key: string) => {
    try {
      await navigator.clipboard.writeText(cnpj);
      setQrCopiado(key);
      toast.success('Chave PIX copiada!');
      setTimeout(() => setQrCopiado(null), 3000);
    } catch (err) {
      // Fallback: Método alternativo se clipboard falhar
      const textArea = document.createElement('textarea');
      textArea.value = cnpj;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setQrCopiado(key);
        toast.success('Chave PIX copiada!');
        setTimeout(() => setQrCopiado(null), 3000);
      } catch (fallbackErr) {
        toast.error('Erro ao copiar. Chave: ' + cnpj);
        console.error('Erro ao copiar:', err, fallbackErr);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleFileUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setComprovantes({
        ...comprovantes,
        [key]: event.target.files[0]
      });
      toast.success('Comprovante selecionado!');
    }
  };

  // CONVERTER E COMPRIMIR IMAGEM (Evita estouro de memória e LocalStorage)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Redimensionar para max 1024x1024
          const MAX_SIZE = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
             // Fallback se não conseguir contexto
             resolve(event.target?.result as string);
             return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir para JPEG 0.7 (reduz drasticamente o tamanho)
          // Se for PNG transparente, vai ficar fundo preto/branco, mas para comprovante ok
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(reader.result as string); // Fallback
      };
      reader.onerror = error => reject(error);
    });
  };

  /**
   * 🔥 FUNÇÃO PARA ENVIAR PEDIDO PARA O SERVIDOR
   * Salva no banco de dados real com isolamento por user_id
   */
  const enviarPedidoParaServidor = async (material: any, key: string, comprovante: File) => {
    try {
      const fornecedor = fornecedores[key as keyof typeof fornecedores];
      if (!fornecedor) {
        toast.error('Fornecedor não encontrado!');
        return;
      }

      // Converter comprovante para Base64
      let comprovanteBase64 = null;
      try {
        comprovanteBase64 = await fileToBase64(comprovante);
      } catch (err) {
        console.error('Erro ao converter comprovante:', err);
      }

      const pedidoId = `pedido-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 🔥 PROCESSAR ITENS EXPLODIDOS (um item por peça para controle individual)
      const itemsExplodidos: any[] = [];
      if (material.items && Array.isArray(material.items)) {
        material.items.forEach((item: any, idxItem: number) => {
          const qtd = item.quantidade || 1;
          for (let q = 0; q < qtd; q++) {
            const codigoUnico = `${pedidoId.substr(-4).toUpperCase()}-${(idxItem + 1)}-${(q + 1)}`;
            itemsExplodidos.push({
              ...item,
              quantidade: 1,
              codigo_producao: codigoUnico,
              status_producao: 'aguardando',
              largura_cad: item.detalhes?.largura || item.largura || 0,
              altura_cad: item.detalhes?.altura || item.altura || 0,
              espessura_cad: config.espessura_vidro || 8,
              tipo_cad: config.tipo_vidro || 'TEMPERADO',
              cor_cad: config.cor_vidro || 'INCOLOR',
              ambiente: item.detalhes?.ambiente || 'Geral'
            });
          }
        });
      }

      // Buscar dados do usuário
      const vidraceiroDataString = localStorage.getItem('sysconecta_usuario_dados');
      const vidraceiroData = vidraceiroDataString ? JSON.parse(vidraceiroDataString) : {};
      const perfilUsuario = localStorage.getItem('sysconecta_user_role') || 'vidraceiro';

      // 🔥🔥🔥 DEBUG COMPLETO DOS DADOS DO VIDRACEIRO
      console.log('🔍🔍🔍 ============================================');
      console.log('🔍 DEBUG: DADOS DO VIDRACEIRO AO CRIAR PEDIDO');
      console.log('🔍 vidraceiroDataString:', vidraceiroDataString);
      console.log('🔍 vidraceiroData (objeto):', vidraceiroData);
      console.log('🔍 vidraceiroData.nomeFantasia:', vidraceiroData.nomeFantasia);
      console.log('🔍 vidraceiroData.nome:', vidraceiroData.nome);
      console.log('🔍 vidraceiroData.email:', vidraceiroData.email);
      console.log('🔍 vidraceiroData.telefone:', vidraceiroData.telefone);
      console.log('🔍 vidraceiroData.cidade:', vidraceiroData.cidade);
      console.log('🔍 vidraceiroData.estado:', vidraceiroData.estado);
      console.log('🔍 usuarioId (do contexto):', usuarioId);
      console.log('🔍 perfilUsuario:', perfilUsuario);
      console.log('🔍 RESULTADO FINAL vidraceiro_nome:', vidraceiroData.nomeFantasia || vidraceiroData.nome || 'Vidraçaria Parceira');
      console.log('🔍 ============================================');

      const pedido = {
        id: pedidoId,
        fornecedor_id: fornecedor.id,
        fornecedor_nome: fornecedor.nomeEmpresa,
        categoria: material.tipo.toLowerCase(),
        
        // Dados do vidraceiro
        vidraceiro_id: usuarioId || vidraceiroData.id || 'vidraceiro-temp',
        vidraceiro_nome: vidraceiroData.nomeFantasia || vidraceiroData.nome || 'Vidraçaria Parceira',
        vidraceiro_cnpj: vidraceiroData.cnpj || vidraceiroData.cpf || 'Não informado',
        vidraceiro_email: vidraceiroData.email || 'contato@email.com',
        vidraceiro_telefone: vidraceiroData.telefone || '(00) 00000-0000',
        vidraceiro_endereco: vidraceiroData.endereco || 'Endereço não cadastrado',
        vidraceiro_numero: vidraceiroData.numero || 'S/N',
        vidraceiro_bairro: vidraceiroData.bairro || '-',
        vidraceiro_cidade: vidraceiroData.cidade || usuarioEstado,
        vidraceiro_estado: usuarioEstado,
        perfil: perfilUsuario,
        
        // Dados do cliente final
        cliente_nome: clienteInfo?.nome || 'Cliente Não Informado',
        cliente_endereco: clienteInfo?.endereco,
        
        // Dados do projeto
        projeto_largura: config.largura_total_mm || 0,
        projeto_altura: config.altura_total_mm || 0,
        projeto_tipo_vidro: config.tipo_vidro || 'INCOLOR',
        projeto_espessura: config.espessura_vidro || 6,
        
        // Items e valores
        items: itemsExplodidos.length > 0 ? itemsExplodidos : material.items,
        valor_total: material.total,
        
        // Pagamento
        condicao_pagamento: condicaoPagamento[key] || '100%',
        valor_pago_informado: condicaoPagamento[key] === '50%' ? material.total * 0.5 : material.total,
        
        // Status inicial CORRETO
        status: 'pendente', // Status inicial até fornecedor aprovar
        comprovante_url: comprovante.name,
        comprovante_ref: comprovanteBase64 ? `comprovante_${pedidoId}` : null,
        data_pedido: new Date().toISOString(),
        orcamento_id: orcamentoId
      };

      // 🔥 ENVIAR PARA O SERVIDOR (PERSISTÊNCIA REAL)
      console.log('📤 Enviando pedido para o servidor:', pedido.id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/enviar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            orcamento_id: orcamentoId,
            pedidos: [pedido],
            usuario_id: usuarioId
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar pedido');
      }

      const result = await response.json();
      console.log('✅ Pedido salvo no servidor:', result);

      // Salvar comprovante separado se existir
      if (comprovanteBase64) {
        try {
          await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ 
              key: `comprovante_${pedidoId}`, 
              value: comprovanteBase64 
            })
          });
        } catch (err) {
          console.error('⚠️ Erro ao salvar comprovante:', err);
        }
      }

      // Disparar evento para atualizar outras telas
      window.dispatchEvent(new Event('pedidos_vidraceiro_updated'));
      
      toast.success('Pagamento registrado! Pedido salvo com sucesso.');
      
    } catch (error) {
      console.error('❌ Erro ao enviar pedido:', error);
      toast.error('Erro ao salvar pedido: ' + (error as Error).message);
      throw error;
    }
  };

  const finalizarSolicitacao = async () => {
    // Verificar quais materiais foram selecionados e pagos
    const materiaisParaSolicitar = safeMateriais.filter(m => {
      const key = m.tipo.toLowerCase();
      // O botão de "Confirmar Pagamento" agora seta pagamentosRealizados[key] = true
      // E ele só fica ativo se tiver comprovante.
      return (materiaisSelecionados as any)[key] && (pagamentosRealizados as any)[key];
    });

    if (materiaisParaSolicitar.length === 0) {
      toast.error('Selecione pelo menos um material e anexe o comprovante!');
      return;
    }

    setLoading(true);
    try {
      // Buscar dados do usuário vidraceiro do localStorage
      const vidraceiroDataString = localStorage.getItem('sysconecta_usuario_dados');
      const vidraceiroData = vidraceiroDataString ? JSON.parse(vidraceiroDataString) : {};
      const perfilUsuario = localStorage.getItem('sysconecta_user_role') || 'vidraceiro'; // vidraceiro, construtor, arquiteto...
      
      // 🔥🔥🔥 DEBUG COMPLETO DOS DADOS DO VIDRACEIRO (LOTE)
      console.log('🔍🔍🔍 ============================================');
      console.log('🔍 DEBUG: DADOS DO VIDRACEIRO AO CRIAR PEDIDO EM LOTE');
      console.log('🔍 vidraceiroDataString:', vidraceiroDataString);
      console.log('🔍 vidraceiroData (objeto):', vidraceiroData);
      console.log('🔍 vidraceiroData.nomeFantasia:', vidraceiroData.nomeFantasia);
      console.log('🔍 vidraceiroData.nome:', vidraceiroData.nome);
      console.log('🔍 vidraceiroData.email:', vidraceiroData.email);
      console.log('🔍 vidraceiroData.telefone:', vidraceiroData.telefone);
      console.log('🔍 vidraceiroData.cidade:', vidraceiroData.cidade);
      console.log('🔍 vidraceiroData.estado:', vidraceiroData.estado);
      console.log('🔍 usuarioId (do contexto):', usuarioId);
      console.log('🔍 perfilUsuario:', perfilUsuario);
      console.log('🔍 RESULTADO FINAL vidraceiro_nome:', vidraceiroData.nomeFantasia || vidraceiroData.nome || 'Vidraçaria Parceira');
      console.log('🔍 ============================================');
      
      // Preparar pedidos para cada fornecedor
      const pedidosParaEnviar = [];

      for (const material of materiaisParaSolicitar) {
        const tipoKey = material.tipo.toLowerCase();
        const fornecedor = fornecedores[tipoKey as keyof typeof fornecedores];
        const comprovanteFile = comprovantes[tipoKey];

        if (!fornecedor) {
          console.error(`Fornecedor não encontrado para ${material.tipo}`);
          continue;
        }

        // Converter comprovante para Base64 se existir
        let comprovanteBase64 = null;
        if (comprovanteFile) {
            try {
                comprovanteBase64 = await fileToBase64(comprovanteFile);
            } catch (err) {
                console.error('Erro ao converter imagem', err);
            }
        }

        const pedidoId = `pedido-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 🔥 PROCESSAMENTO INTELIGENTE DOS ITENS (EXPLOSÃO + CÓDIGO ÚNICO)
        // Para cada item com quantidade > 1, criamos entradas separadas para controle individual de produção
        const itemsExplodidos: any[] = [];
        
        if (material.items && Array.isArray(material.items)) {
             material.items.forEach((item: any, idxItem: number) => {
                 const qtd = item.quantidade || 1;
                 for (let q = 0; q < qtd; q++) {
                     // Gerar código único: PEDIDO-ITEM-SEQUENCIA
                     const codigoUnico = `${pedidoId.substr(-4).toUpperCase()}-${(idxItem + 1)}-${(q + 1)}`;
                     
                     itemsExplodidos.push({
                         ...item,
                         quantidade: 1, // Individualizado
                         codigo_producao: codigoUnico,
                         status_producao: 'aguardando', // aguardando, corte, lapidacao, tempera, pronto
                         
                         // Dados normalizados para o CAD
                         largura_cad: item.detalhes?.largura || item.largura || 0,
                         altura_cad: item.detalhes?.altura || item.altura || 0,
                         espessura_cad: config.espessura_vidro || 8, // Fallback comum
                         tipo_cad: config.tipo_vidro || 'TEMPERADO',
                         cor_cad: config.cor_vidro || 'INCOLOR', // Se não tiver config global, assume incolor
                         ambiente: item.detalhes?.ambiente || 'Geral'
                     });
                 }
             });
        }

        const pedido = {
          id: pedidoId,
          fornecedor_id: fornecedor.id,
          fornecedor_nome: fornecedor.nomeEmpresa,
          categoria: material.tipo.toLowerCase(),
          
          // Dados do vidraceiro / comprador (COMPLETOS)
          vidraceiro_id: usuarioId || vidraceiroData.id || 'vidraceiro-temp',
          vidraceiro_nome: vidraceiroData.nomeFantasia || vidraceiroData.nome || 'Vidraçaria Parceira',
          vidraceiro_cnpj: vidraceiroData.cnpj || vidraceiroData.cpf || 'Não informado',
          vidraceiro_email: vidraceiroData.email || 'contato@email.com',
          vidraceiro_telefone: vidraceiroData.telefone || '(00) 00000-0000',
          vidraceiro_endereco: vidraceiroData.endereco || 'Endereço não cadastrado',
          vidraceiro_numero: vidraceiroData.numero || 'S/N',
          vidraceiro_bairro: vidraceiroData.bairro || '-',
          vidraceiro_cidade: vidraceiroData.cidade || usuarioEstado,
          vidraceiro_estado: usuarioEstado,
          perfil: perfilUsuario,
          
          // Dados do cliente final (obra)
          cliente_nome: clienteInfo?.nome || 'Cliente Não Informado',
          cliente_endereco: clienteInfo?.endereco,
          
          // Dados do projeto
          projeto_largura: config.largura_total_mm || 0,
          projeto_altura: config.altura_total_mm || 0,
          projeto_tipo_vidro: config.tipo_vidro || 'INCOLOR',
          projeto_espessura: config.espessura_vidro || 6,
          
          // Items do pedido (USANDO LISTA EXPLODIDA)
          items: itemsExplodidos.length > 0 ? itemsExplodidos : material.items,
          valor_total: material.total,
          
          // Pagamento
          condicao_pagamento: condicaoPagamento[tipoKey] || '100%',
          valor_pago_informado: condicaoPagamento[tipoKey] === '50%' ? material.total * 0.5 : material.total,
          
          // Status e controle
          status: 'aguardando_aprovacao',
          comprovante_url: comprovanteFile?.name || null,
          comprovante_ref: comprovanteBase64 ? `comprovante_${pedidoId}` : null,
          data_pedido: new Date().toISOString(),
          orcamento_id: orcamentoId
        };

        // SALVAR COMPROVANTE SEPARADO (EVITA ESTOURO DE MEMÓRIA NO LIST LIST)
        if (comprovanteBase64) {
            // Salvar assincronamente para não travar UI, mas garantir persistência
            // Não usamos await aqui para o cloudStorage.setItem do comprovante para não atrasar o fluxo principal
            // Mas idealmente deveria ser await. Vamos usar await.
            try {
                // Tenta salvar local primeiro
                localStorage.setItem(`comprovante_${pedidoId}`, comprovanteBase64);
                
                // O cloudStorage.setItem vai mandar pra nuvem (Via Proxy para evitar RLS)
                console.log(`📤 Enviando comprovante via Proxy para: comprovante_${pedidoId}`);
                fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`
                    },
                    body: JSON.stringify({ 
                        key: `comprovante_${pedidoId}`, 
                        value: comprovanteBase64 
                    })
                }).catch(err => console.error("❌ Erro upload comprovante nuvem (Proxy):", err));
            } catch (e) {
                console.error("Erro ao salvar comprovante separado", e);
            }
        }

        pedidosParaEnviar.push(pedido);
      }

      // 🔥 ENVIAR PARA O SERVIDOR (PERSISTÊNCIA REAL)
      try {
        console.log(`📤 Enviando ${pedidosParaEnviar.length} pedidos para o servidor...`);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/enviar`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              orcamento_id: orcamentoId,
              pedidos: pedidosParaEnviar,
              usuario_id: usuarioId
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao enviar pedidos');
        }

        const result = await response.json();
        console.log('✅ Pedidos salvos no servidor:', result);
        
        // Disparar evento para atualizar outras telas
        window.dispatchEvent(new Event('pedidos_vidraceiro_updated'));
        window.dispatchEvent(new Event('pedidos_fornecedor_updated'));
        
      } catch (err) {
        console.error('❌ Erro ao enviar pedidos:', err);
        throw err; // Propagar erro para ser tratado no catch externo
      }
      
      toast.success('✅ Solicitação enviada com sucesso!');
      toast.success('🔔 Fornecedores notificados!');
      
      // Notificação visual para o vidraceiro
      localStorage.setItem('sysconecta_vidraceiro_notificacao_pendente', 'true');
      
      setModalSolicitarMaterial(false);
      setShowSuccessModal(true); // ABRE A JANELA DE DECISÃO

    } catch (error) {
      console.error('❌ Erro ao finalizar solicitação:', error);
      toast.error('❌ Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-in fade-in zoom-in duration-300">
      
      {/* HEADER RESUMO */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
           <button onClick={onVoltar} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
             <ArrowLeft className="w-6 h-6" />
           </button>
           <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                Resumo do Orçamento
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    statusOrcamento === 'aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                    {statusOrcamento}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                ID: #{orcamentoId} • Criado em {new Date().toLocaleDateString()}
              </p>
           </div>
        </div>
        
        {!isFornecedor && (
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end border-r border-slate-100 pr-6 mr-2">
                    <div className="flex gap-4">
                        <div className="text-right">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custo</span>
                             <span className="text-sm font-bold text-slate-600">R$ {totalMateriais.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Lucro Est.</span>
                             <span className="text-sm font-bold text-emerald-600">R$ {lucro.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end mr-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Total</span>
                    <span className="text-2xl font-bold text-slate-900">R$ {totalComLucro.toFixed(2)}</span>
                </div>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 gap-6">
             
             {/* PARTE SUPERIOR: DADOS LADO A LADO */}
             <div className="grid grid-cols-2 gap-4">
                
                {/* CARD CLIENTE */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-500" />
                        Cliente
                      </h3>
                      <button className="text-blue-600 hover:text-blue-700 text-[10px] font-bold hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
                        Editar
                      </button>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                            {clienteInfo?.nome?.charAt(0).toUpperCase() || 'C'}
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{clienteInfo?.nome || 'Não informado'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{clienteInfo?.telefone || 'Sem telefone'}</p>
                         </div>
                      </div>
                      {clienteInfo?.endereco && (
                          <div className="flex items-start gap-1.5 pt-2 border-t border-slate-100 mt-2">
                             <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                             <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">{clienteInfo.endereco}</p>
                          </div>
                      )}
                   </div>
                </div>

                {/* CARD PROJETO */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <FileText className="w-3 h-3 text-purple-500" />
                        Projeto
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Dimensões</p>
                            <p className="font-bold text-slate-900 text-xs">{config?.largura_total_mm || 0} x {config?.altura_total_mm || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Vidro</p>
                            <p className="font-bold text-slate-900 text-xs truncate" title={`${config?.tipo_vidro || '-'} ${config?.espessura_vidro || 0}mm`}>{config?.tipo_vidro || '-'} {config?.espessura_vidro || 0}mm</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 flex justify-between items-center">
                            <div>
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Linha</p>
                                <p className="font-bold text-slate-900 text-[10px]">Suprema 25</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Cor</p>
                                <p className="font-bold text-slate-900 text-[10px]">{config?.cor_aluminio || 'Branco'}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* LISTA DE MATERIAIS - ESTILO ACCORDION (Incrivelmente Fácil) */}
             <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-slate-500" />
                      Lista de Materiais
                   </h3>
                   <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{safeMateriais.reduce((acc, m) => acc + m.items.length, 0)} itens</span>
                </div>
                
                <div className="divide-y divide-slate-100">
                   {['VIDRO', 'ALUMINIO', 'ACESSORIO'].map((tipo) => {
                      const mat = safeMateriais.find(m => m.tipo === tipo);
                      if (!mat) return null;
                      
                      const isOpen = materiaisSelecionados[tipo] !== false; // Default open or toggle logic
                      
                      return (
                         <details key={tipo} className="group open:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 select-none list-none marker:content-none focus:outline-none transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                                     tipo === 'VIDRO' ? 'bg-blue-100 text-blue-600' :
                                     tipo === 'ALUMINIO' ? 'bg-slate-200 text-slate-700' :
                                     'bg-amber-100 text-amber-600'
                                  }`}>
                                     {tipo === 'VIDRO' ? '🧊' : tipo === 'ALUMINIO' ? '🏗️' : '🔩'}
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{tipo === 'VIDRO' ? 'Vidros & Espelhos' : tipo === 'ALUMINIO' ? 'Perfis de Alumínio' : 'Acessórios & Componentes'}</h4>
                                     <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-open:bg-blue-400"></span>
                                        {mat.items.length} itens nesta categoria
                                     </p>
                                  </div>
                                </div>
                               <div className="flex items-center gap-3">
                                  <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">R$ {mat.total.toFixed(2)}</span>
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                                  </div>
                               </div>
                            </summary>
                            
                            <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                               <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                     <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                        <tr>
                                           <th className="px-4 py-2 text-[10px] uppercase">Item</th>
                                           <th className="px-4 py-2 text-[10px] uppercase text-center">Qtd</th>
                                           <th className="px-4 py-2 text-[10px] uppercase text-right">Total</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-100">
                                        {mat.items.map((item: any, idx: number) => (
                                           <tr key={idx} className="hover:bg-slate-50/50">
                                              <td className="px-4 py-2">
                                                 <span className="block font-medium text-slate-700 text-xs">{item.descricao}</span>
                                                 <span className="text-[10px] text-slate-400">{item.codigo}</span>
                                              </td>
                                              <td className="px-4 py-2 text-center text-xs font-medium text-slate-600">{item.quantidade} {item.unidade}</td>
                                              <td className="px-4 py-2 text-right text-xs font-bold text-slate-700">R$ {item.total.toFixed(2)}</td>
                                           </tr>
                                        ))}
                                     </tbody>
                                  </table>
                               </div>
                            </div>
                         </details>
                      );
                   })}
                </div>
             </div>

                {/* MARGEM DE LUCRO */}
                {!isFornecedor && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Composição de Preço</h3>
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                            Margem: {margemLucro}%
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <input
                        type="range"
                        min="0"
                        max="100"
                        value={margemLucro}
                        onChange={(e) => setMargemLucro(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Custo Materiais</p>
                        <p className="text-xl font-bold text-slate-900">R$ {totalMateriais.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Lucro Estimado</p>
                        <p className="text-xl font-bold text-emerald-700">R$ {(totalComLucro - totalMateriais).toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-900/10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preço Final</p>
                        <p className="text-xl font-bold">R$ {totalComLucro.toFixed(2)}</p>
                        </div>
                    </div>
                    </div>
                )}

             </div>

             {/* COLUNA DIREITA: AÇÕES */}
             <div className="col-span-1 space-y-3 print:hidden">
                
                {isFornecedor ? (
                   <>
                      {/* Botões Fornecedor */}
                      <button onClick={handleAprovarOrcamento} className="w-full p-4 bg-emerald-600 text-white rounded-xl font-bold shadow-xl">
                        Aprovar Pedido
                      </button>
                   </>
                ) : (
                   <>
                       {/* ADICIONAR MAIS ITENS (Topo) */}
                       {onAdicionarMaisItens && (
                          <button 
                            onClick={onAdicionarMaisItens} 
                            className="w-full p-4 bg-amber-50 border border-amber-200 hover:border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl transition-all flex items-center gap-3 shadow-sm group mb-4"
                          >
                             <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-amber-700" />
                             </div>
                             <div className="text-left">
                                <p className="text-sm font-bold">Adicionar Mais Itens</p>
                                <p className="text-xs text-amber-800/70">Incluir novos produtos</p>
                             </div>
                          </button>
                       )}

                      <button 
                        onClick={async () => {
                            await salvarOrcamento();
                        }}
                        className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 font-bold text-slate-900 shadow-sm"
                      >
                         <Save className="w-5 h-5 text-blue-600" />
                         Salvar Orçamento
                      </button>

                      <button 
                        onClick={() => setModalEnviarCliente(true)}
                        className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 font-bold text-slate-900 shadow-sm"
                      >
                         <Send className="w-5 h-5 text-purple-600" />
                         Enviar p/ Cliente
                      </button>

                      <button
                        onClick={downloadPDF}
                        className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 font-bold text-slate-900 shadow-sm"
                      >
                         <Download className="w-5 h-5 text-orange-600" />
                         Gerar PDF
                      </button>

                      <div className="h-px bg-slate-200 my-2"></div>

                      <button 
                        onClick={() => setModalSolicitarMaterial(true)}
                        className="w-full p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center gap-3 shadow-xl active:scale-[0.98]"
                      >
                         <ShoppingCart className="w-5 h-5" />
                         <div className="text-left">
                            <p className="text-sm font-bold">Solicitar Material</p>
                            <p className="text-xs text-slate-400">Finalizar Pedido e Enviar</p>
                         </div>
                      </button>
                   </>
                )}
             </div>
          </div>
        </div>

      {/* MODAL: SOLICITAR MATERIAL */}
      {modalSolicitarMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-0 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white md:rounded-2xl shadow-2xl max-w-5xl w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                 <h2 className="text-lg font-bold text-slate-900">Solicitar Materiais</h2>
                 <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                   Fornecedores em <span className="font-semibold text-slate-900">{usuarioEstado}</span>
                 </p>
              </div>
              <button onClick={() => setModalSolicitarMaterial(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                 <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>

            {loadingFornecedores ? (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-slate-300 animate-spin mb-4" />
                <p className="text-slate-900 font-semibold">Buscando fornecedores...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6 bg-slate-50/50 flex-1 overflow-y-auto">
              
              {safeMateriais.map((material) => {
                const key = material.tipo.toLowerCase();
                const selecionado = (materiaisSelecionados as any)[key];
                const pago = (pagamentosRealizados as any)[key];
                const comprovante = (comprovantes as any)[key];

                return (
                  <div 
                    key={material.tipo}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      selecionado 
                        ? 'border-blue-200 bg-white shadow-md shadow-blue-900/5 ring-1 ring-blue-100' 
                        : 'border-slate-200 bg-slate-50 opacity-80'
                    }`}
                  >
                    {/* HEADER DO MATERIAL */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between bg-white border-b border-slate-100 gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex items-center justify-center">
                           <input
                             type="checkbox"
                             checked={!!selecionado}
                             onChange={(e) => setMateriaisSelecionados({
                               ...materiaisSelecionados,
                               [key]: e.target.checked
                             })}
                             className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                           />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                             {material.tipo}
                             <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">{material.items.length} itens</span>
                          </h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                             <Package className="w-3 h-3" />
                             {material.fornecedor}
                          </p>
                        </div>
                      </div>
                      <div className="text-left md:text-right pl-10 md:pl-0">
                        <p className="text-xl font-bold text-slate-900 tracking-tight bg-slate-50 inline-block px-3 py-1 rounded-lg md:bg-transparent md:p-0">
                          R$ {material.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* CONTEÚDO EXPANDIDO */}
                    {selecionado && (
                       <div className="p-6">
                           {/* LISTA DE ITEMS (SIMPLIFICADA) */}
                           <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6 p-4">
                               <p className="text-xs text-slate-500 font-bold uppercase mb-2">Resumo dos Itens</p>
                               {material.items.slice(0, 3).map((item: any, i: number) => (
                                   <div key={i} className="text-sm text-slate-700 flex justify-between py-1 border-b border-slate-100 last:border-0">
                                       <span>{item.descricao}</span>
                                       <span className="font-mono">R$ {item.total.toFixed(2)}</span>
                                   </div>
                               ))}
                               {material.items.length > 3 && <p className="text-xs text-slate-400 mt-2 text-center">+ {material.items.length - 3} itens</p>}
                           </div>

                           {/* ÁREA DE PAGAMENTO */}
                           {material.tem_perfil && (
                             isFornecedor ? (
                               /* VISÃO FORNECEDOR - LANÇAMENTO DIRETO */
                               <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center shadow-sm mt-4">
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                                      <Printer className="w-8 h-8" />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 mb-2">Lançar para Produção</h3>
                                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                                      Como você é o próprio fornecedor, este pedido irá direto para sua fila de produção.
                                  </p>

                                  <div className="w-full mb-4">
                                      <p className="text-xs text-slate-500 mb-1">Condição de Pagamento (Cliente)</p>
                                      
                                      <div className="flex bg-slate-100 rounded-lg p-1 mb-3">
                                          <button 
                                              onClick={() => setCondicaoPagamento(prev => ({...prev, [key]: '50%'}))}
                                              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                  (condicaoPagamento[key] || '50%') === '50%' 
                                                  ? 'bg-white text-slate-900 shadow-sm' 
                                                  : 'text-slate-400 hover:text-slate-600'
                                              }`}
                                          >
                                              50% Sinal
                                          </button>
                                          <button 
                                              onClick={() => setCondicaoPagamento(prev => ({...prev, [key]: '100%'}))}
                                              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                  (condicaoPagamento[key] || '50%') === '100%' 
                                                  ? 'bg-white text-slate-900 shadow-sm' 
                                                  : 'text-slate-400 hover:text-slate-600'
                                              }`}
                                          >
                                              100% Total
                                          </button>
                                      </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => {
                                        setPagamentosRealizados({ ...pagamentosRealizados, [key]: true });
                                        toast.success('Item confirmado para produção!');
                                    }}
                                    disabled={pago}
                                    className={`w-full max-w-md py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                                        pago 
                                        ? 'bg-emerald-500 text-white cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                  >
                                    {pago ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Confirmado
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Confirmar Produção
                                        </>
                                    )}
                                  </button>
                               </div>
                             ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* PAGAMENTO PIX (APENAS CHAVE/CNPJ) */}
                               <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center shadow-sm justify-center">
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chave PIX (CNPJ)</p>
                                 
                                 <div className="w-full bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100 flex flex-col items-center">
                                   <p className="text-lg font-bold text-slate-900 font-mono">
                                     {material.fornecedor.includes('SANTA RITA') ? '12.345.678/0001-99' : '98.765.432/0001-00'}
                                   </p>
                                   <p className="text-xs text-slate-500 mt-1">{material.fornecedor.split('-')[0]}</p>
                                 </div>
                                 
                                 <div className="w-full mb-4">
                                    <p className="text-xs text-slate-500 mb-1">Valor do Pagamento</p>
                                    
                                    <div className="flex bg-slate-100 rounded-lg p-1 mb-3">
                                        <button 
                                            onClick={() => setCondicaoPagamento(prev => ({...prev, [key]: '50%'}))}
                                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                (condicaoPagamento[key] || '50%') === '50%' 
                                                ? 'bg-white text-slate-900 shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            50% Sinal
                                        </button>
                                        <button 
                                            onClick={() => setCondicaoPagamento(prev => ({...prev, [key]: '100%'}))}
                                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                (condicaoPagamento[key] || '50%') === '100%' 
                                                ? 'bg-white text-slate-900 shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            100% Total
                                        </button>
                                    </div>
                                    
                                    <div className={`mt-2 p-3 border rounded-lg transition-colors ${
                                        (condicaoPagamento[key] || '50%') === '100%' 
                                        ? 'bg-blue-50 border-blue-100' 
                                        : 'bg-emerald-50 border-emerald-100'
                                    }`}>
                                        <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                                            (condicaoPagamento[key] || '50%') === '100%' ? 'text-blue-700' : 'text-emerald-700'
                                        }`}>
                                            Valor a Pagar ({(condicaoPagamento[key] || '50%')})
                                        </p>
                                        <p className={`text-3xl font-bold ${
                                            (condicaoPagamento[key] || '50%') === '100%' ? 'text-blue-600' : 'text-emerald-600'
                                        }`}>
                                            R$ {((condicaoPagamento[key] === '100%' ? 1 : 0.5) * material.total).toFixed(2)}
                                        </p>
                                        {(condicaoPagamento[key] || '50%') === '50%' && (
                                            <p className="text-[10px] text-emerald-600 mt-1">*Restante no ato da entrega</p>
                                        )}
                                    </div>
                                 </div>

                                 <button
                                   onClick={() => copiarQRCode(material.fornecedor.includes('SANTA RITA') ? '12.345.678/0001-99' : '98.765.432/0001-00', key)}
                                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-bold uppercase tracking-wider shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                                 >
                                   {qrCopiado === key ? (
                                     <>
                                       <CheckCircle className="w-5 h-5 text-emerald-400" />
                                       Chave Copiada!
                                     </>
                                   ) : (
                                     <>
                                       <Copy className="w-5 h-5" />
                                       Copiar Chave PIX
                                     </>
                                   )}
                                 </button>
                               </div>

                               {/* CONFIRMAR PAGAMENTO (UPLOAD) */}
                               <div className="flex flex-col space-y-4 h-full">
                                  {/* Área de Upload Separada e Clicável */}
                                  <div className="relative group cursor-pointer flex-1 min-h-[140px]">
                                    <div className={`absolute inset-0 w-full h-full border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
                                        comprovante 
                                        ? 'border-emerald-500 bg-emerald-50/50' 
                                        : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                                    }`}>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleFileUpload(key, e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="text-center pointer-events-none relative z-10 px-4">
                                            {comprovante ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
                                                        <CheckCircle className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-900 line-clamp-1 break-all">{comprovante.name}</p>
                                                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">Toque para alterar</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-500 flex items-center justify-center mx-auto mb-2 transition-colors shadow-sm">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-900">Anexar Comprovante</p>
                                                    <p className="text-xs text-slate-500 mt-1">Galeria ou Câmera</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={async () => {
                                        if (comprovante) {
                                            // 1. Atualizar estado local para feedback visual imediato
                                            setPagamentosRealizados({ ...pagamentosRealizados, [key]: true });
                                            
                                            // 2. 🔥 PERSISTÊNCIA REAL NO SUPABASE (Requisito Crítico)
                                            await enviarPedidoParaServidor(material, key, comprovante);
                                        } else {
                                            toast.error('Anexe o comprovante primeiro!');
                                        }
                                    }}
                                    disabled={pago || !comprovante}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                                        pago 
                                        ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                                        : !comprovante
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                                    }`}
                                  >
                                    {pago ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Confirmado
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Confirmar Pagamento
                                        </>
                                    )}
                                  </button>
                               </div>
                             </div>
                             )
                           )}

                           {/* SEM PERFIL */}
                           {selecionado && !material.tem_perfil && (
                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                               <div className="mt-0.5">
                                  <ArrowLeft className="w-4 h-4 text-amber-500 rotate-90" />
                               </div>
                               <p className="text-sm text-amber-700">
                                 Este fornecedor ainda não possui perfil completo cadastrado. 
                                 O pedido será enviado normalmente, mas o pagamento será combinado posteriormente.
                               </p>
                             </div>
                           )}
                       </div>
                    )}

                  </div>
                );
              })}

            </div>
            )}

            {/* FOOTER DO MODAL */}
            <div className="p-4 md:p-6 border-t border-slate-200 bg-white sticky bottom-0 z-10 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setModalSolicitarMaterial(false)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={finalizarSolicitacao}
                disabled={loadingFornecedores}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar Selecionados
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      <AnimatePresence>
        {showSuccessModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Solicitação Enviada!</h2>
                    <p className="text-slate-500 mb-8">
                        Seus pedidos foram encaminhados aos fornecedores com sucesso. O que deseja fazer agora?
                    </p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                setShowSuccessModal(false);
                                if (onDashboard) onDashboard();
                            }}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                        >
                            Ir para Dashboard
                        </button>
                        
                        <button 
                            onClick={() => {
                                setShowSuccessModal(false);
                                if (onNovoOrcamento) onNovoOrcamento();
                            }}
                            className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Novo Orçamento
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}