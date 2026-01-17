# 📐 LEITOR DWG - GUIA DE USO

## 🎯 O QUE É?

O **Leitor DWG** é um sistema inteligente que **lê arquivos de AutoCAD** e **identifica automaticamente** todos os elementos relacionados a vidro:
- ✅ **Janelas** (Windows)
- ✅ **Portas** (Doors)
- ✅ **Guarda-corpos** (Railings)
- ✅ **Esquadrias de vidro**
- ✅ **Qualquer elemento retangular** que possa ser vidro

## 🚀 COMO ACESSAR?

### Opção 1: Via Dashboard
1. Faça login como **Vidraceiro**
2. No dashboard, clique no botão **"Leitor DWG"** na sidebar esquerda
3. Ou clique no card **"Leitor DWG"** no grid de atalhos

### Opção 2: Acesso Rápido via Console
```javascript
acessarLeitorDWG()
```

## 📝 COMO USAR?

### Passo 1: Preparar o Arquivo no AutoCAD
⚠️ **IMPORTANTE:** O sistema **NÃO lê arquivos .DWG binários diretamente**. Você precisa exportar como **DXF**:

1. Abra seu projeto no AutoCAD
2. Vá em **Arquivo → Salvar Como**
3. Escolha o formato **DXF (*.dxf)**
4. Salve o arquivo

### Passo 2: Upload do Arquivo
1. Arraste o arquivo `.dxf` para a área de upload
2. Ou clique na área e selecione o arquivo

### Passo 3: Análise Automática
O sistema irá:
1. ✅ Analisar o arquivo DXF
2. ✅ Identificar blocos de janelas, portas, etc.
3. ✅ Extrair dimensões (largura x altura)
4. ✅ Calcular área em m²
5. ✅ Classificar por nível de confiança:
   - **ALTA**: Nome do bloco claramente indica o tipo (ex: "JANELA", "PORTA")
   - **MÉDIA**: Identificado por layer ou geometria
   - **BAIXA**: Retângulo genérico que pode ser vidro

### Passo 4: Revisar Resultados
- Veja a lista completa de elementos detectados
- Verifique as medidas (largura, altura, área)
- Marque os elementos que deseja importar para orçamento

### Passo 5: Importar para Orçamento
1. Selecione os elementos desejados (checkbox)
2. Clique em **"Importar para Orçamento"**
3. Os elementos serão transferidos automaticamente

## 🔍 COMO O SISTEMA IDENTIFICA OS ELEMENTOS?

### 1. **Blocos (INSERT/BLOCK)**
O sistema procura por blocos com nomes como:
- `JANELA`, `WINDOW`, `JAN`
- `PORTA`, `DOOR`
- `GUARDA`, `GUARD`, `RAIL`
- `VIDRO`, `GLASS`, `ESQUADRIA`

### 2. **Polilinhas (LWPOLYLINE)**
O sistema analisa retângulos formados por polilinhas e:
- Extrai as dimensões
- Verifica o layer (camada)
- Identifica se o layer contém palavras-chave de vidro

### 3. **Layers (Camadas)**
Layers com nomes relevantes aumentam a confiança:
- `JANELA`, `WINDOW`
- `PORTA`, `DOOR`
- `VIDRO`, `GLASS`
- `GUARDA-CORPO`

## 📏 UNIDADES E MEDIDAS

### Conversão Automática:
- **Blocos**: Usa o scale do bloco (dividido por 100)
- **Polilinhas**: Coordenadas convertidas de mm para metros
- **Filtros**: Elementos entre 0.3m e 6m (descarta elementos muito pequenos ou grandes)

### Exemplo de Saída:
```
Janela 01 - 1.50m x 2.10m = 3.15m²
Porta de Vidro - 0.90m x 2.20m = 1.98m²
Guarda-Corpo - 3.00m x 1.10m = 3.30m²
```

## 🎨 INTERFACE

### Área de Upload
- **Drag & Drop**: Arraste arquivos diretamente
- **Click to Upload**: Clique para abrir seletor
- **Feedback Visual**: Animação durante processamento

### Tabela de Resultados
- **Checkbox**: Selecionar/desselecionar elementos
- **Tipo**: Ícone e nome do tipo de elemento
- **Descrição**: Nome do bloco ou layer
- **Medidas**: Largura, Altura, Área
- **Confiança**: Badge colorido (Alta/Média/Baixa)

### Ações
- **Selecionar Todos**: Marca todos os elementos
- **Limpar**: Desmarca todos
- **Novo Arquivo**: Limpa tudo e permite novo upload
- **Importar**: Envia selecionados para orçamento

## 🛠️ TROUBLESHOOTING

### ❌ "Arquivo DWG detectado"
**Problema:** Tentou fazer upload de arquivo .DWG binário  
**Solução:** Exporte como DXF no AutoCAD

### ⚠️ "Nenhum elemento encontrado"
**Possíveis causas:**
1. Arquivo DXF vazio ou corrompido
2. Blocos com nomes genéricos
3. Elementos muito pequenos ou grandes (fora do range 0.3m - 6m)

**Soluções:**
1. Verifique se o arquivo tem conteúdo
2. Renomeie blocos no AutoCAD (ex: "BLOCO1" → "JANELA1")
3. Ajuste a escala do desenho

### 🔧 Medidas Incorretas
**Problema:** Dimensões muito grandes ou pequenas  
**Causa:** Escala incorreta no desenho  
**Solução:** 
1. Verifique a escala no AutoCAD
2. Desenhos devem estar em escala 1:100 ou similar
3. Unidades devem ser milímetros

## 💡 DICAS PROFISSIONAIS

### Para Melhores Resultados:

1. **Use Nomenclatura Padrão**
   - Renomeie blocos com nomes descritivos
   - Use "JANELA", "PORTA", "VIDRO" nos nomes

2. **Organize Layers**
   - Separe elementos em layers específicos
   - Use nomes descritivos nos layers

3. **Padronize Blocos**
   - Crie biblioteca de blocos padrão
   - Mantenha scale consistente

4. **Verifique Escala**
   - Desenhos em escala 1:100
   - Unidades em milímetros

5. **Revise Antes de Importar**
   - Confira todas as medidas
   - Desmarque elementos incorretos
   - Adicione observações se necessário

## 🔮 PRÓXIMAS VERSÕES

### Em Desenvolvimento:
- [ ] Suporte direto para arquivos DWG binários
- [ ] Reconhecimento de elementos circulares
- [ ] Detecção de espessura de vidro
- [ ] Identificação automática de tipo de vidro
- [ ] Preview 2D do desenho
- [ ] Exportação para PDF
- [ ] Integração com scanner de QR Code

## 📞 SUPORTE

Dúvidas ou problemas?
- 📧 Email: suporte@sysconecta.com
- 💬 Chat: Disponível no dashboard
- 📱 WhatsApp: (00) 0000-0000

---

**Desenvolvido por SysConecta** 🚀  
*Transformando AutoCAD em Orçamentos Inteligentes*
