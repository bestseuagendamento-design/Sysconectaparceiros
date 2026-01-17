/**
 * 🏭 INICIALIZAR FORNECEDORES DE EXEMPLO
 * Popula fornecedores SANTA RITA e ALUSUPRA em SC
 */

import React, { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function InicializarFornecedores() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const popularFornecedores = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedores/seed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSucesso(true);
        toast.success('✅ Fornecedores cadastrados com sucesso!');
        console.log('Fornecedores cadastrados:', data);
      } else {
        toast.error('Erro ao cadastrar fornecedores');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Fornecedores de Exemplo</h4>
            <p className="text-xs text-[#9CA3AF]">SC: SANTA RITA + ALUSUPRA</p>
          </div>
        </div>
        
        {!sucesso ? (
          <button
            onClick={popularFornecedores}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941E] text-black font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              '🏭 Cadastrar Fornecedores'
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Cadastrados!</span>
          </div>
        )}
      </div>
    </div>
  );
}
