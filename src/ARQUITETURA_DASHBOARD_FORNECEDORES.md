# ARQUITETURA MESTRE: ECOSSISTEMA DE FORNECEDORES SYSCONECTA (2026)

> **Documento de Definição Técnica**
> **Status:** Em Planejamento
> **Última Atualização:** Janeiro 2026

## 1. A REGRA DE OURO (Escopo de Atuação)
*   **O Papel do Fornecedor:** Venda e Entrega de Matéria-Prima (Insumos).
    *   **NÃO** realiza montagem.
    *   **NÃO** entrega janelas prontas.
    *   **ENTREGA** vidros cortados/temperados, barras de perfil (ou kits de perfis soltos) e caixas de acessórios.
*   **O Papel do Vidraceiro/Comprador:** Compra, Recebimento, Montagem e Instalação.

---

## 2. A MÁQUINA DE TEMPLATES (Conceito "Instagram")
Não criaremos códigos individuais. Criaremos 3 Templates Mestres que se adaptam a qualquer empresa via banco de dados.

### A. Dashboard Fornecedor de VIDROS (Base: Santa Rita)
*   **Foco:** Processamento de Chapas (Corte, Lapidação, Têmpera).
*   **Visualização:** Medidas exatas de vão luz com folgas já descontadas.
*   **Unidade:** Peças de Vidro / M².

### B. Dashboard Fornecedor de ALUMÍNIO
*   **Foco:** Separação de Perfis (Extrusão).
*   **Visualização:** Códigos de Perfis, Quantidade de Barras (6m) ou Kits de Perfis Cortados (soltos).
*   **Unidade:** Barras / Kg / Kits Lineares.

### C. Dashboard Fornecedor de ACESSÓRIOS
*   **Foco:** Picking (Separação de Miudezas).
*   **Visualização:** Listas de componentes (Roldanas, Fechos, Escovas).
*   **Unidade:** Peças Unitárias / Kits de Ferragem.

---

## 3. O FLUXO DE DADOS ("A Explosão")
Como um pedido de "1 Janela" vira 3 pedidos diferentes.

1.  **Entrada:** Vidraceiro define Tipologia (Ex: Janela Suprema 2F 1500x1200).
2.  **Processamento (BOM - Bill of Materials):** O Sistema explode a tipologia em 3 listas.
3.  **Roteamento:**
    *   Lista de Vidros -> Vai para ID Têmpera (Preço base Têmpera).
    *   Lista de Perfis -> Vai para ID Distribuidora (Preço base Distribuidora).
    *   Lista de Acessórios -> Vai para ID Loja (Preço base Loja).

---

## 4. GESTÃO DE PREÇOS EM ESCALA (SKU Mestre)
Como lidar com 5.000 tipologias sem editar uma por uma.

*   **SKU Mestre (Master Catalog):** O SysConecta define o código único (Ex: `GLS-001` = Vidro 8mm Incolor).
*   **Tabela de Preço Dinâmica:** O Fornecedor edita apenas o preço do INSUMO.
    *   *Exemplo:* Fornecedor altera `GLS-001` para R$ 150,00/m².
    *   *Resultado:* Todas as janelas que usam esse vidro são re-calculadas instantaneamente.

---

## 5. LOGÍSTICA E GEOLOCALIZAÇÃO (Gestão de 2.000 Vidraceiros)
Como entregar sem erros.

1.  **Cadastro Geo-Referenciado:** Todo vidraceiro/obra tem Latitude/Longitude salva no cadastro.
2.  **Mapa de Calor (Dashboard Logística):**
    *   O fornecedor vê clusters (agrupamentos) de pedidos no mapa.
    *   Visualiza zonas de alta demanda.
3.  **Roteamento Inteligente:** Seleção visual de pedidos no mapa para criar "Cargas" otimizadas por bairro/cidade.
4.  **Conferência BIPADA (Zero Erro):**
    *   QR Code na etiqueta do produto.
    *   O produto só entra no caminhão se o bip confirmar que ele pertence àquela Rota.

---

## 6. PERFIS ESPECIAIS (Não Compradores)
*   **Indústria (Guardian/Cebrace/Etc):** Atua como vitrine, gerador de leads e marketing. Não recebe pedidos de compra diretos dos pequenos vidraceiros (fluxo normal), apenas de grandes construtoras ou distribuidores.
*   **ParceiroSys:** Anunciantes e serviços agregados.

---

## 7. PRÓXIMOS PASSOS (Roadmap)
1.  Definir a **Engenharia Financeira** (Como o fornecedor recebe? Split de pagamento?).
2.  Definir a **Engenharia de Notificações** (Como lidar com o "Chat" entre Fábrica e Vidraceiro em escala?).
3.  Iniciar o desenvolvimento dos Templates Alumínio e Acessórios.
