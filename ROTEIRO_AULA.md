# Roteiro rápido para demonstração em aula

## Ideia central

A interface de um Gêmeo Digital deve ser escolhida conforme a decisão que o usuário precisa tomar.

## 1. Chart.js — gráficos web simples

Acesse: <http://localhost:8080/chartjs/>

Mensagem para a aula:

> Quando eu preciso incorporar gráficos simples em uma página web, bibliotecas como Chart.js resolvem rapidamente séries temporais, comparações e distribuições.

Mostre:

- CO₂ ao longo do tempo;
- energia por ambiente;
- distribuição de estados.

Conceito associado:

- tendência temporal;
- comparação entre ativos;
- estado operacional.

## 2. Streamlit — dashboard operacional rápido

Acesse: <http://localhost:8501>

Mensagem para a aula:

> Com Streamlit, um protótipo de dashboard analítico em Python pode ser criado muito rapidamente, conectando dados, filtros, KPIs e alertas.

Mostre:

- filtros por ambiente;
- KPIs;
- gráfico temporal;
- tabela de estado;
- recomendações simples.

Conceito associado:

- monitorar;
- diagnosticar;
- apoiar decisão.

## 3. D3.js — visualização customizada

Acesse: <http://localhost:8080/d3/>

Mensagem para a aula:

> Algumas relações do Gêmeo Digital não são bem representadas por gráficos convencionais. D3 permite construir visualizações específicas para o problema.

Mostre:

- legenda de temperatura e CO₂;
- salas com estados operacionais;
- sensores;
- gateway;
- modelo preditivo;
- alerta;
- operador;
- caminho destacado quando uma sala é selecionada.

Conceito associado:

- entidades;
- dependências;
- fluxo de informação;
- cadeia dado → modelo → alerta → decisão.

## 4. p5.js — simulação visual 2D

Acesse: <http://localhost:8080/p5/>

Mensagem para a aula:

> Uma interface pode representar comportamento, não apenas números. Aqui a planta 2D mostra ocupação e risco de CO₂ de forma visual.

Mostre:

- salas coloridas por estado;
- pessoas em movimento;
- clique em uma sala para aumentar ocupação;
- aumento do CO₂.

Conceito associado:

- planta baixa;
- zonas de risco;
- simulação visual;
- contexto espacial interno.

## 5. Leaflet — dados georreferenciados

Acesse: <http://localhost:8080/leaflet/>

Mensagem para a aula:

> Quando ativos e sensores estão distribuídos no território, o mapa vira uma interface natural para localização e priorização.

Mostre:

- marcadores por sensor;
- popup com métricas;
- zonas críticas;
- camadas ativáveis.

Conceito associado:

- localização espacial;
- campus/cidade inteligente;
- inspeção e resposta operacional.

## 6. 8th Wall/WebAR — interface de campo

Acesse: <http://localhost:8080/8thwall-digital-twin/>

Mensagem para a aula:

> Em campo, a interface pode sair do dashboard e aparecer sobre o ativo físico. AR é útil quando a decisão precisa ser tomada no local.

Mostre:

- engine 8th Wall carregada via `@8thwall/engine-binary`;
- toque/click para posicionar o ativo;
- equipamento HVAC em AR;
- painel flutuante com dados do Gêmeo Digital;
- estado do ativo;
- ação recomendada.

Conceito associado:

- overlay AR;
- inspeção;
- manutenção;
- interação com ativo físico;
- diferença entre dashboard remoto e interface de campo.

## Fechamento

Pergunta para os alunos:

> Para o sistema de vocês, o usuário precisa acompanhar, diagnosticar, localizar, simular ou interagir com o ativo físico?

A resposta orienta a escolha da interface.
