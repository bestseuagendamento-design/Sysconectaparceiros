import React, { useState } from 'react';
import { Zap, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function CadastrarTipologiaL001() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  const cadastrarL001 = async () => {
    setLoading(true);
    setSucesso(false);

    try {
      const tipologiaL001 = {
        id: 'tip_l001_suprema',
        codigo: 'L001',
        nome: 'Janela de Correr 2 Folhas',
        linha: 'LINHA SUPREMA',
        categoria: 'JANELA',
        descricao: 'Janela de correr com 2 folhas móveis, sistema de roldanas, ideal para ambientes residenciais e comerciais.',
        imagemUrl: '',
        
        // PERFIS DE ALUMÍNIO COM FÓRMULAS
        perfis: [
          {
            codigo: 'SU-001',
            nome: 'Trilho Superior',
            formula: 'L',
            pesoKgMetro: 5.184,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Corte reto, 1 peça'
          },
          {
            codigo: 'SU-002',
            nome: 'Trilho Inferior',
            formula: 'L',
            pesoKgMetro: 4.0,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Corte reto, 1 peça'
          },
          {
            codigo: 'SU-003',
            nome: 'Marco Lateral',
            formula: 'H * 2',
            pesoKgMetro: 3.12,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Corte reto, 2 peças (direita e esquerda)'
          },
          {
            codigo: 'SU-039',
            nome: 'Montante Lateral Folha',
            formula: '(H - 45) * 2',
            pesoKgMetro: 2.84,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Desconto técnico de 45mm, 2 peças'
          },
          {
            codigo: 'SU-040',
            nome: 'Montante Mão de Amigo',
            formula: '(H - 45) * 2',
            pesoKgMetro: 2.61,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Desconto técnico de 45mm, 2 peças'
          },
          {
            codigo: 'SU-053',
            nome: 'Travessa da Folha',
            formula: '((L + 12) / 2) * 4',
            pesoKgMetro: 2.64,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Adiciona 12mm, divide por 2 folhas, 4 peças (2 superiores + 2 inferiores)'
          },
          {
            codigo: 'CM-060',
            nome: 'Contra-marco (Opcional)',
            formula: '(L * 2) + (H * 2)',
            pesoKgMetro: 1.591,
            tamanhoBarraDisponivel: 6000,
            kerfDisco: 5,
            observacoes: 'Opcional - Corte em 45°, montagem em esquadria'
          }
        ],
        
        // VIDROS
        vidros: [
          {
            nome: 'Vidro Folha Esquerda',
            larguraFormula: '((L + 12) / 2) - 72',
            alturaFormula: '(H - 45) - 72',
            espessuras: ['4mm', '6mm', '8mm'],
            cores: ['Clear (Incolor)', 'French Green', 'Euro Grey', 'Royal Silver', 'Sky Blue', 'Neutral'],
            observacoes: 'Vidro temperado Guardian Glass - Folga técnica de 72mm'
          },
          {
            nome: 'Vidro Folha Direita',
            larguraFormula: '((L + 12) / 2) - 72',
            alturaFormula: '(H - 45) - 72',
            espessuras: ['4mm', '6mm', '8mm'],
            cores: ['Clear (Incolor)', 'French Green', 'Euro Grey', 'Royal Silver', 'Sky Blue', 'Neutral'],
            observacoes: 'Vidro temperado Guardian Glass - Folga técnica de 72mm'
          }
        ],
        
        // ACESSÓRIOS
        acessorios: [
          {
            codigo: 'RO-42',
            nome: 'Roldana 4 Rodas (4mm/6mm)',
            tipo: 'FIXO',
            quantidadeFixa: 4,
            unidade: 'UNIDADE',
            observacoes: 'Para vidros de 4mm e 6mm - 4 unidades (2 por folha)'
          },
          {
            codigo: 'RO-44',
            nome: 'Roldana 4 Rodas (8mm)',
            tipo: 'FIXO',
            quantidadeFixa: 4,
            unidade: 'UNIDADE',
            observacoes: 'Para vidros de 8mm - 4 unidades (2 por folha)'
          },
          {
            codigo: 'NYL-524',
            nome: 'Guia de Nylon',
            tipo: 'FIXO',
            quantidadeFixa: 4,
            unidade: 'UNIDADE',
            observacoes: '4 unidades'
          },
          {
            codigo: 'FEC-18',
            nome: 'Fecho Central',
            tipo: 'FIXO',
            quantidadeFixa: 1,
            unidade: 'UNIDADE',
            observacoes: '1 unidade'
          },
          {
            codigo: 'BAT-001',
            nome: 'Batedor',
            tipo: 'FIXO',
            quantidadeFixa: 4,
            unidade: 'UNIDADE',
            observacoes: '4 unidades'
          },
          {
            codigo: 'ESC-5X5',
            nome: 'Escova de Vedação 5x5mm',
            tipo: 'FORMULA',
            formula: '((H - 45) * 4) + (((L + 12) / 2) * 4)',
            unidade: 'METRO',
            observacoes: 'Metro linear - Perímetro das folhas'
          },
          {
            codigo: 'GAX-EPDM',
            nome: 'Gaxeta EPDM',
            tipo: 'FORMULA',
            formula: '((((L + 12) / 2) - 72) + ((H - 45) - 72)) * 4 * 2',
            unidade: 'METRO',
            observacoes: 'Metro linear - Perímetro dos vidros (2 folhas)'
          },
          {
            codigo: 'PAR-4238',
            nome: 'Parafuso Inox 4,2 x 38mm',
            tipo: 'FIXO',
            quantidadeFixa: 16,
            unidade: 'UNIDADE',
            observacoes: '16 unidades para montagem'
          }
        ],
        
        // OPCIONAIS
        opcionais: [
          {
            nome: 'Puxador Concha',
            perfisAdicionais: [],
            acessoriosAdicionais: [
              {
                codigo: 'PUX-CONCHA',
                nome: 'Puxador Concha Alumínio',
                tipo: 'FIXO',
                quantidadeFixa: 2,
                unidade: 'UNIDADE',
                observacoes: '2 unidades (1 por folha)'
              }
            ]
          },
          {
            nome: 'Contra-marco CM-060',
            perfisAdicionais: [
              {
                codigo: 'CM-060',
                nome: 'Contra-marco',
                formula: '(L * 2) + (H * 2)',
                pesoKgMetro: 1.591,
                tamanhoBarraDisponivel: 6000,
                kerfDisco: 5,
                observacoes: 'Corte em 45°'
              }
            ],
            acessoriosAdicionais: []
          }
        ],
        
        // ACABAMENTOS DISPONÍVEIS
        acabamentosAluminio: ['Branco', 'Preto', 'Bronze', 'Fosco', 'Amadeirado Claro', 'Amadeirado Escuro'],
        
        // CONFIGURAÇÕES
        permiteReaproveitamento: true,
        normaTecnica: 'NBR 10821',
        
        // STATUS
        status: 'APROVADO',
        dataCriacao: new Date().toISOString(),
        dataAprovacao: new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/sysconecta/tipologia/linha`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipologiaL001)
      });

      const data = await response.json();

      if (data.success) {
        setSucesso(true);
        alert('✅ Tipologia L001 - Janela de Correr 2 Folhas cadastrada com sucesso!');
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar tipologia L001:', error);
      alert('❌ Erro ao cadastrar tipologia L001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg flex-shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 text-lg mb-2">🎯 Cadastrar Tipologia L001 (Exemplo Completo)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Janela de Correr 2 Folhas - LINHA SUPREMA<br />
            Com todas as fórmulas dinâmicas (L, H), perfis, vidros e acessórios configurados.
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 text-sm">
            <h4 className="text-gray-900 mb-2">📋 Incluído nesta tipologia:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 7 perfis de alumínio com fórmulas (SU-001, SU-002, SU-003, SU-039, SU-040, SU-053, CM-060)</li>
              <li>✅ 2 vidros temperados Guardian Glass (fórmulas de largura e altura)</li>
              <li>✅ 8 tipos de acessórios (roldanas, escovas, fechos, parafusos, gaxetas)</li>
              <li>✅ Opcionais: Puxador Concha e Contra-marco</li>
              <li>✅ 6 acabamentos de alumínio disponíveis</li>
              <li>✅ Reaproveitamento de retalhos habilitado</li>
            </ul>
          </div>

          {sucesso ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Tipologia L001 cadastrada com sucesso!</span>
            </div>
          ) : (
            <button
              onClick={cadastrarL001}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Cadastrar Tipologia L001 Completa
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
