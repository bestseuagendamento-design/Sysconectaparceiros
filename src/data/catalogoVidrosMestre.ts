export interface VidroSKU {
  id: string; // ex: 'float-incolor-8mm'
  categoria: 'Float' | 'Temperado' | 'Laminado' | 'Controle Solar' | 'Decorativo' | 'Tecnico';
  nome: string;
  cor: string;
  espessura: number; // em mm
  unidade: 'm2' | 'chapa';
  descricao?: string;
}

// GERAÇÃO AUTOMÁTICA DOS SKUs BASEADA NA SUA LISTA
// Isso garante que Vidraceiro e Fornecedor falem EXATAMENTE a mesma língua.

const gerarSKUs = (): VidroSKU[] => {
  const catalogo: VidroSKU[] = [];

  // FUNÇÃO AUXILIAR PARA GERAR IDS ÚNICOS E LEGÍVEIS
  const add = (categoria: VidroSKU['categoria'], tipo: string, cor: string, espessuras: number[]) => {
    espessuras.forEach(mm => {
      const id = `${tipo.toLowerCase().replace(/\s+/g, '-')}-${cor.toLowerCase().replace(/\s+/g, '-')}-${mm}mm`
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
      
      catalogo.push({
        id,
        categoria,
        nome: `${tipo} ${cor}`,
        cor,
        espessura: mm,
        unidade: 'm2'
      });
    });
  };

  // 1. VIDRO FLOAT (COMUM / PLANO)
  add('Float', 'Float', 'Incolor', [2, 3, 4, 5, 6, 8, 10, 12, 15, 19, 25]);
  add('Float', 'Float', 'Extraclaro', [3, 4, 5, 6, 8, 10, 12, 15, 19]);
  add('Float', 'Float', 'Verde', [3, 4, 6, 8, 10]);
  add('Float', 'Float', 'Cinza', [3, 4, 6, 8, 10]); // Fumê
  add('Float', 'Float', 'Bronze', [3, 4, 6, 8, 10]);
  add('Float', 'Float', 'Azul', [4, 6, 8, 10]);

  // 2. VIDRO TEMPERADO
  add('Temperado', 'Temperado', 'Incolor', [4, 5, 6, 8, 10, 12, 15, 19]);
  add('Temperado', 'Temperado', 'Extraclaro', [4, 6, 8, 10, 12, 15, 19]);
  add('Temperado', 'Temperado', 'Verde', [4, 6, 8, 10, 12]);
  add('Temperado', 'Temperado', 'Cinza', [4, 6, 8, 10, 12]);
  add('Temperado', 'Temperado', 'Bronze', [4, 6, 8, 10, 12]);
  add('Temperado', 'Temperado', 'Azul', [4, 6, 8, 10, 12]);
  add('Temperado', 'Temperado Acidado', 'Fosco', [4, 6, 8, 10, 12]);

  // 3. VIDRO LAMINADO
  add('Laminado', 'Laminado', 'Incolor', [6, 8, 10, 12, 16, 20, 24]);
  add('Laminado', 'Laminado', 'Verde', [6, 8, 10, 12, 20]);
  add('Laminado', 'Laminado', 'Cinza', [6, 8, 10, 12, 20]);
  add('Laminado', 'Laminado', 'Bronze', [6, 8, 10, 12, 20]);
  add('Laminado', 'Laminado', 'Azul', [6, 8, 10, 12, 20]);
  add('Laminado', 'Laminado Opaco', 'Branco Leitoso', [6, 8, 10, 12]);
  add('Laminado', 'Laminado Acustico', 'Incolor', [6, 8, 10, 12]);
  add('Laminado', 'Laminado Multi', 'Blindado', [30, 35, 40, 50, 60]);

  // 4. VIDRO DE CONTROLE SOLAR (REFLETIVOS)
  add('Controle Solar', 'Refletivo Pirolitico', 'Prata', [4, 6, 8, 10]);
  add('Controle Solar', 'Refletivo Pirolitico', 'Champanhe', [4, 6, 8, 10]);
  add('Controle Solar', 'Refletivo Pirolitico', 'Verde', [4, 6, 8, 10]);
  add('Controle Solar', 'Refletivo Pirolitico', 'Azul', [4, 6, 8, 10]);
  add('Controle Solar', 'Refletivo Pirolitico', 'Cinza', [4, 6, 8, 10]);
  add('Controle Solar', 'Low-E', 'Neutro', [6, 8, 10]);
  add('Controle Solar', 'Low-E', 'Azulado', [6, 8, 10]);
  add('Controle Solar', 'Low-E', 'Prateado', [6, 8, 10]);

  // 5. DECORATIVOS E REVESTIMENTOS
  add('Decorativo', 'Espelho', 'Prata', [3, 4, 5, 6]);
  add('Decorativo', 'Espelho', 'Bronze', [3, 4, 5, 6]);
  add('Decorativo', 'Espelho', 'Cinza', [3, 4, 5, 6]);
  add('Decorativo', 'Pintado', 'Branco', [4, 6]);
  add('Decorativo', 'Pintado', 'Preto', [4, 6]);
  add('Decorativo', 'Pintado', 'Vermelho', [4, 6]);
  add('Decorativo', 'Pintado', 'Bege', [4, 6]);
  add('Decorativo', 'Pintado', 'Chocolate', [4, 6]);
  add('Decorativo', 'Fantasia', 'Canelado', [3, 4, 6, 8]);
  add('Decorativo', 'Fantasia', 'Mini-Boreal', [3, 4, 6, 8]);
  add('Decorativo', 'Fantasia', 'Artico', [3, 4, 6, 8]);
  add('Decorativo', 'Fantasia', 'Martele', [3, 4, 6, 8]);
  add('Decorativo', 'Fantasia', 'Pontilhado', [3, 4, 6, 8]);
  add('Decorativo', 'Aramado', 'Incolor', [6]);

  // 6. TÉCNICOS ESPECIAIS (2026)
  add('Tecnico', 'Vacuo VIG', 'Incolor', [6.3, 8.3, 10.3]);
  add('Tecnico', 'Antirreflexo', 'Incolor', [4, 6, 8, 10]);
  add('Tecnico', 'Autolimpante', 'Incolor', [4, 6, 8]);
  add('Tecnico', 'Corta-Fogo', 'Incolor', [15, 20, 25, 30, 50]);

  return catalogo;
};

export const CATALOGO_VIDROS = gerarSKUs();

export const CATEGORIAS_VIDRO = [
  'Float', 
  'Temperado', 
  'Laminado', 
  'Controle Solar', 
  'Decorativo', 
  'Tecnico'
] as const;