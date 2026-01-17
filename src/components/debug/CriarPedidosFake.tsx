import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PackagePlus, Loader } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function CriarPedidosFake() {
  const [criando, setCriando] = useState(false);

  const criarPedidosFake = async () => {
    setCriando(true);
    
    try {
      // 🔥 CRIAR 5 PEDIDOS FAKE PARA SANTA RITA VIDROS
      const pedidosFake = [
        {
          userId: 'user-460605',
          vidraceiro_id: 'user-460605',
          vidraceiro_nome: 'Vidraçaria Zara',
          vidraceiro_email: 'leandro.zara@sysvidro.com',
          fornecedor: 'Santa Rita Vidros',
          fornecedor_id: 'forn-santa-rita-vidros',
          cliente: {
            nome: 'João Silva',
            telefone: '(48) 99999-1111',
            endereco: 'Rua das Flores, 123'
          },
          itens: [
            {
              id: '1',
              tipo: 'vidro',
              descricao: 'Vidro Temperado 8mm',
              largura: 1.5,
              altura: 2.0,
              quantidade: 2,
              valorUnitario: 250.00,
              valorTotal: 500.00
            }
          ],
          valorTotal: 500.00,
          status: 'aguardando_aprovacao',
          dataCriacao: new Date().toISOString()
        },
        {
          userId: 'user-460605',
          vidraceiro_id: 'user-460605',
          vidraceiro_nome: 'Vidraçaria Zara',
          vidraceiro_email: 'leandro.zara@sysvidro.com',
          fornecedor: 'Santa Rita Vidros',
          fornecedor_id: 'forn-santa-rita-vidros',
          cliente: {
            nome: 'Maria Santos',
            telefone: '(48) 99999-2222',
            endereco: 'Av. Central, 456'
          },
          itens: [
            {
              id: '1',
              tipo: 'vidro',
              descricao: 'Vidro Laminado 10mm',
              largura: 2.0,
              altura: 1.5,
              quantidade: 3,
              valorUnitario: 350.00,
              valorTotal: 1050.00
            }
          ],
          valorTotal: 1050.00,
          status: 'aprovado',
          dataCriacao: new Date(Date.now() - 86400000).toISOString()
        },
        {
          userId: 'user-460605',
          vidraceiro_id: 'user-460605',
          vidraceiro_nome: 'Vidraçaria Zara',
          vidraceiro_email: 'leandro.zara@sysvidro.com',
          fornecedor: 'Santa Rita Vidros',
          fornecedor_id: 'forn-santa-rita-vidros',
          cliente: {
            nome: 'Pedro Costa',
            telefone: '(48) 99999-3333',
            endereco: 'Rua do Comércio, 789'
          },
          itens: [
            {
              id: '1',
              tipo: 'vidro',
              descricao: 'Box Blindex',
              largura: 1.8,
              altura: 2.2,
              quantidade: 1,
              valorUnitario: 800.00,
              valorTotal: 800.00
            }
          ],
          valorTotal: 800.00,
          status: 'producao',
          dataCriacao: new Date(Date.now() - 172800000).toISOString()
        },
        {
          userId: 'user-460605',
          vidraceiro_id: 'user-460605',
          vidraceiro_nome: 'Vidraçaria Zara',
          vidraceiro_email: 'leandro.zara@sysvidro.com',
          fornecedor: 'Santa Rita Vidros',
          fornecedor_id: 'forn-santa-rita-vidros',
          cliente: {
            nome: 'Ana Paula',
            telefone: '(48) 99999-4444',
            endereco: 'Rua dos Lírios, 321'
          },
          itens: [
            {
              id: '1',
              tipo: 'vidro',
              descricao: 'Espelho 4mm',
              largura: 1.0,
              altura: 1.5,
              quantidade: 4,
              valorUnitario: 120.00,
              valorTotal: 480.00
            }
          ],
          valorTotal: 480.00,
          status: 'saiu_entrega',
          dataCriacao: new Date(Date.now() - 259200000).toISOString()
        },
        {
          userId: 'user-460605',
          vidraceiro_id: 'user-460605',
          vidraceiro_nome: 'Vidraçaria Zara',
          vidraceiro_email: 'leandro.zara@sysvidro.com',
          fornecedor: 'Santa Rita Vidros',
          fornecedor_id: 'forn-santa-rita-vidros',
          cliente: {
            nome: 'Carlos Mendes',
            telefone: '(48) 99999-5555',
            endereco: 'Av. Beira Mar, 1000'
          },
          itens: [
            {
              id: '1',
              tipo: 'vidro',
              descricao: 'Vidro Comum 6mm',
              largura: 1.2,
              altura: 1.8,
              quantidade: 5,
              valorUnitario: 180.00,
              valorTotal: 900.00
            }
          ],
          valorTotal: 900.00,
          status: 'entregue',
          dataCriacao: new Date(Date.now() - 345600000).toISOString()
        }
      ];

      console.log('🔥 Criando 5 pedidos fake para Santa Rita Vidros...');

      let criados = 0;
      
      for (const pedido of pedidosFake) {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/criar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(pedido)
        });

        const result = await response.json();

        if (result.success) {
          criados++;
          console.log(`✅ Pedido ${criados}/5 criado com sucesso!`);
        } else {
          console.error(`❌ Erro ao criar pedido ${criados + 1}:`, result.error);
        }
      }

      if (criados === 5) {
        toast.success(`🎉 ${criados} pedidos criados com sucesso!`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.warning(`⚠️ Apenas ${criados}/5 pedidos foram criados`);
      }
    } catch (error) {
      console.error('❌ Erro ao criar pedidos:', error);
      toast.error('Erro ao criar pedidos fake');
    } finally {
      setCriando(false);
    }
  };

  return (
    <motion.button
      onClick={criarPedidosFake}
      disabled={criando}
      className="fixed bottom-36 right-6 z-[1000] bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {criando ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          <span className="hidden md:inline">Criando...</span>
        </>
      ) : (
        <>
          <PackagePlus className="w-5 h-5" />
          <span className="hidden md:inline">Criar Pedidos Fake</span>
        </>
      )}
    </motion.button>
  );
}
