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
