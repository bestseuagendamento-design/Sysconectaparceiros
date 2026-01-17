import React from 'react';
import { OrcamentoManual } from './OrcamentoManual';

interface NovoOrcamentoSantaRitaProps {
  onNavigate: (screen: string) => void;
}

export function NovoOrcamentoSantaRita({ onNavigate }: NovoOrcamentoSantaRitaProps) {
  // Dados simulados do "Usuário" (Fornecedor atuando como Vidraceiro para o sistema)
  const fornecedorUser = {
    id: 'fornecedor-santa-rita',
    nomeEmpresa: 'Santa Rita Vidros',
    estado: 'SC',
    perfil: 'fornecedor'
  };

  return (
    <OrcamentoManual
      usuario={fornecedorUser}
      onVoltar={() => onNavigate('dashboard-santa-rita')}
      isFornecedor={true}
      // Passar lista de clientes vazia ou buscar se necessário, 
      // mas OrcamentoManual já tem busca interna reativa.
      clientes={[]} 
      onAdicionarCliente={(c) => console.log('Cliente adicionado:', c)}
    />
  );
}
