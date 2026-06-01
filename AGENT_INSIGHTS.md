# Diário de Raciocínios e Insights do Agente

## [2026-06-01] - Demos Dockerizadas para Visualização em Gêmeos Digitais

**Problema/Desafio:**
Era necessário criar, em pouco tempo, um conjunto de pequenos projetos demonstráveis em aula para bibliotecas heterogêneas: Streamlit, Chart.js, D3.js, p5.js, Leaflet e 8th Wall. O desafio principal era evitar exemplos soltos e genéricos, mantendo coerência com o contexto da aula sobre interfaces para Gêmeos Digitais.

**O Raciocínio:**
- A melhor estratégia didática foi usar um **cenário único**: um Gêmeo Digital de edifício inteligente/laboratório com salas, sensores, CO₂, temperatura, ocupação, energia e alertas. Isso permite comparar as bibliotecas por tipo de decisão apoiada, e não apenas por sintaxe.
- Para reduzir fricção de instalação, a infraestrutura foi centralizada em **Docker Compose**: um serviço `streamlit` para Python e um serviço `web` com Nginx servindo as demos HTML/JS estáticas.
- Optei por dados fictícios compartilhados em `data/` e `web/data/`, pois isso reforça a ideia de que múltiplas interfaces podem visualizar o mesmo estado do Gêmeo Digital sob perspectivas diferentes.
- A ordem das demos foi pensada como progressão didática: gráficos simples → dashboard analítico → visualização customizada → simulação 2D → mapa espacial → AR de campo.
- Para o 8th Wall, inicialmente foi criada uma versão mock, porque a interpretação anterior era de que a plataforma exigia conta/projeto hospedado. Após pesquisa, a estratégia foi revisada porque o 8th Wall passou a ter stack aberto em `8thwall.org`.

**A Decisão/Solução:**
Foi criado o projeto `demos-visualizacao-gemeos-digitais` com:
- `docker-compose.yml`;
- README geral;
- roteiro de aula;
- dados sintéticos;
- dashboard Streamlit;
- demos Chart.js, D3.js, p5.js e Leaflet;
- mock WebAR;
- exemplo atualizado de 8th Wall usando `@8thwall/engine-binary`, `xrextras`, `landing-page` e A-Frame.

---

## [2026-06-01] - Atualização da Estratégia para 8th Wall Open Source

**Problema/Desafio:**
O usuário informou que o 8th Wall agora é open source e que havia uma instalação local no computador. A versão anterior da demo tratava 8th Wall como plataforma comercial fechada, então era necessário pesquisar e ajustar a abordagem.

**O Raciocínio:**
- Primeiro verifiquei a presença local do software. O executável foi encontrado em `C:/Users/natal/AppData/Local/Programs/8th Wall/8th Wall.exe`, confirmando que o 8th Wall Studio Desktop estava instalado.
- Em seguida, pesquisei fontes recentes: `8thwall.org`, GitHub `8thwall/8thwall`, documentação de instalação e README do pacote `engine`.
- A informação relevante foi que o hosted platform antigo foi aposentado, mas o projeto passou a ser comunitário/open source. O framework e ferramentas estão sob MIT, enquanto SLAM segue distribuído separadamente como binário.
- Isso mudou a decisão técnica: em vez de manter apenas um mock conceitual, fazia sentido criar uma demo realista baseada no novo stack público: `@8thwall/engine-binary`, `@8thwall/xrextras`, `@8thwall/landing-page` e A-Frame.
- Ainda mantive o mock como plano B, porque AR em celular costuma exigir HTTPS, permissões de câmera e compatibilidade de dispositivo. Em aula, é prudente ter uma versão que funcione sem depender de SLAM/câmera.

**A Decisão/Solução:**
Foi adicionada a pasta `web/8thwall-digital-twin/` com uma demo de overlay AR para um ativo HVAC. A página permite toque/click para posicionar o ativo no chão e exibe um painel operacional com status, temperatura, vibração, CO₂ e ação recomendada. O README e o roteiro de aula foram atualizados para refletir a nova situação do 8th Wall.

---

## [2026-06-01] - Organização do Repositório Git em Commits Didáticos

**Problema/Desafio:**
Depois de gerar os arquivos, o usuário pediu para iniciar um repositório Git e fazer commits. O desafio era organizar os commits de forma compreensível, sem colocar tudo em um único bloco pouco informativo.

**O Raciocínio:**
- Como os arquivos foram criados em etapas conceituais, os commits deveriam refletir essas camadas: estrutura base, dashboard Python, demos web e AR.
- Essa separação facilita explicar a evolução do projeto em aula ou reverter partes específicas se necessário.
- Após a atualização do 8th Wall, foi feito um commit adicional específico, preservando o histórico da mudança de entendimento sobre a tecnologia.

**A Decisão/Solução:**
O repositório Git foi inicializado e organizado com commits semânticos:
- `chore: estrutura inicial das demos`;
- `feat: adiciona dashboard Streamlit`;
- `feat: adiciona demos web de visualizacao`;
- `feat: adiciona demo conceitual de WebAR`;
- `feat: adiciona exemplo atualizado do 8th Wall`.

---

## [2026-06-01] - Refinamento das Demos para Clareza Didática e Consistência dos Dados

**Problema/Desafio:**
Após a criação inicial das demos, algumas visualizações ainda não comunicavam bem o objetivo pedagógico. O D3 parecia um grafo genérico difícil de interpretar; o Leaflet inicialmente era apenas um mapa com marcadores; o p5.js tinha dados próprios e não refletia corretamente o caso de temperatura crítica com CO₂ baixo; Chart.js e D3 também aparentavam dados desatualizados por cache do navegador.

**O Raciocínio:**
- A primeira versão do D3 usava uma simulação de força. Embora tecnicamente interessante, ela não era a melhor escolha para aula, pois a disposição automática dos nós gerava ambiguidade visual. A pergunta didática não era “quais entidades existem?”, mas “como um dado vira decisão?”. Por isso, a visualização foi redesenhada como um fluxo explícito: ambiente físico → sensor → gateway → modelo → alerta → operador.
- No Leaflet, a pergunta relevante era espacial: “onde está o problema e como priorizar a inspeção?”. Por isso, em vez de apenas marcadores, a demo passou a incluir painel operacional, filtros, lista de prioridade, área monitorada, zonas de risco e rota da base de manutenção até o sensor selecionado.
- O p5.js exigia uma mudança conceitual maior: ele estava usando dados hardcoded e só considerava CO₂ para status. Isso contradizia o caso importante para a aula: um ambiente crítico por temperatura alta mesmo com CO₂ baixo. A solução foi sincronizar com `web/data/sensors.json`, considerar temperatura e CO₂, e transformar a demo em um simulador 2D com modos de interação.
- Para evitar inconsistências percebidas em aula, foi necessário lidar com cache de navegador adicionando query strings (`?v=...`) e `cache: 'no-store'` em chamadas `fetch`. Isso foi especialmente importante porque as demos são estáticas, servidas por Nginx, e mudanças rápidas em arquivos JS/JSON podem não aparecer imediatamente no navegador ou celular.
- A responsividade do p5.js foi tratada com um sistema de coordenadas lógico (`LOGICAL_WIDTH`/`LOGICAL_HEIGHT`) e escala proporcional. Assim, o canvas se adapta ao contêiner sem quebrar detecção de clique, pois `mouseX`/`mouseY` são convertidos de volta para coordenadas lógicas.

**A Decisão/Solução:**
Foram feitas as seguintes melhorias:
- D3 redesenhado como fluxo de decisão, com legenda de temperatura e CO₂ no topo.
- Leaflet transformado em mapa operacional com KPIs, filtros, camadas, zonas de risco e rota de inspeção.
- Chart.js e D3 ajustados para carregar dados com cache busting.
- p5.js sincronizado com os dados compartilhados e convertido em simulador 2D de conforto ambiental.
- p5.js recebeu painel de sala selecionada, modos `+ Pessoas`, `Ventilar` e `Falha térmica`, botão de reset, indicadores separados de temperatura/CO₂ e layout responsivo.
- p5.js passou a exibir área em m² por ambiente e a desenhar as informações em cards escuros/translúcidos sobre as partículas, evitando perda de legibilidade.

---

## [2026-06-01] - Modelo Didático de Métricas e Estados Operacionais

**Problema/Desafio:**
As demos precisavam deixar explícito como o status `normal`, `atenção` e `crítico` era calculado, especialmente porque o caso de temperatura alta com CO₂ baixo poderia confundir se o aluno assumisse que todo alerta vinha de ar poluído.

**O Raciocínio:**
- A página inicial deveria funcionar como “contrato semântico” dos dados: antes de abrir qualquer demo, o aluno precisa saber quais métricas existem e quais limites geram cada estado.
- A temperatura e o CO₂ são métricas principais porque determinam diretamente o status. Ocupação e energia são métricas auxiliares: ocupação ajuda a explicar causa provável; energia ajuda a discutir custo operacional.
- Mantive limites simples e legíveis, mesmo que em um projeto real eles dependessem de normas, tipo de ambiente, capacidade do HVAC e histórico operacional. Para aula, a regra precisa ser transparente.
- A presença de ícones como 🌡️ e 🌫️ reforça a distinção entre desconforto térmico e qualidade do ar, que é central para explicar o caso HVAC-A.

**A Decisão/Solução:**
A home recebeu uma seção explicativa com:
- Temperatura: `≤ 25,5 °C` normal, `> 25,5 °C` atenção, `> 27,5 °C` crítico.
- CO₂: `≤ 850 ppm` normal, `> 850 ppm` atenção, `> 1200 ppm` crítico.
- Ocupação como explicação de pressão sobre CO₂/calor.
- Energia como indicador de esforço/custo operacional.
- Status final crítico se temperatura ou CO₂ ultrapassarem limite crítico.

Também foi criado no dataset o caso `HVAC-A`: temperatura `28,4 °C`, CO₂ `640 ppm`, status `crítico`, para demonstrar que um alerta pode ser térmico mesmo sem ar poluído.
