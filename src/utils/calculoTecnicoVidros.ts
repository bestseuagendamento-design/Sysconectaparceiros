
export const isPortaCorrer = (nomeProduto: string): boolean => {
  return nomeProduto.toLowerCase().includes('correr') || nomeProduto.toLowerCase().includes('box');
};

export const calcularVidrosPortaCorrer = (nomeProduto: string, larguraVao: number, alturaVao: number) => {
  const nomeLower = nomeProduto.toLowerCase();
  let vidros = [];

  if (nomeLower.includes('2 folhas') || nomeLower.includes('padrao')) {
    // 2 Folhas (1 Fixa, 1 Móvel)
    const transpasse = 50;
    const larguraVidro = (larguraVao + transpasse) / 2;
    
    vidros.push({
      tipo: 'FIXA',
      numeroFolha: 1,
      largura: Math.round(larguraVidro),
      altura: Math.round(alturaVao), // Simplificado
      descricao: 'Folha Fixa'
    });
    
    vidros.push({
      tipo: 'MÓVEL',
      numeroFolha: 2,
      largura: Math.round(larguraVidro),
      altura: Math.round(alturaVao), // Simplificado
      descricao: 'Folha Móvel'
    });
  } else if (nomeLower.includes('4 folhas')) {
    // 4 Folhas (2 Fixas, 2 Móveis)
    const transpasse = 50;
    const larguraVidro = (larguraVao + (2 * transpasse)) / 4;
    
    vidros.push({ tipo: 'FIXA', numeroFolha: 1, largura: Math.round(larguraVidro), altura: Math.round(alturaVao), descricao: 'Fixa Esquerda' });
    vidros.push({ tipo: 'MÓVEL', numeroFolha: 2, largura: Math.round(larguraVidro), altura: Math.round(alturaVao), descricao: 'Móvel Esquerda' });
    vidros.push({ tipo: 'MÓVEL', numeroFolha: 3, largura: Math.round(larguraVidro), altura: Math.round(alturaVao), descricao: 'Móvel Direita' });
    vidros.push({ tipo: 'FIXA', numeroFolha: 4, largura: Math.round(larguraVidro), altura: Math.round(alturaVao), descricao: 'Fixa Direita' });
  } else {
    // Default 1 folha se não reconhecido
     vidros.push({
      tipo: 'MÓVEL',
      numeroFolha: 1,
      largura: Math.round(larguraVao),
      altura: Math.round(alturaVao),
      descricao: 'Peça Única'
    });
  }
  
  return vidros;
};
