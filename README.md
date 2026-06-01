# Demos de Visualização para Gêmeos Digitais

Coleção de mini projetos para aula sobre **Visualização e Interface em Gêmeos Digitais**.

Cenário único usado em todos os exemplos: um **edifício inteligente/laboratório** com salas, sensores de temperatura, CO₂, ocupação, energia, alertas e ativos HVAC.

## Tecnologias demonstradas

| Tecnologia | Demonstração | Uso em Gêmeos Digitais |
|---|---|---|
| Streamlit | Dashboard operacional em Python | KPIs, filtros, alertas e análise rápida |
| Chart.js | Painel web com gráficos prontos | Séries temporais e comparações simples |
| D3.js | Grafo customizado de relações | Entidades, sensores, ativos e alertas |
| p5.js | Simulação visual 2D | Planta baixa, zonas, ocupação e dispersão |
| Leaflet | Mapa interativo | Ativos e sensores distribuídos no espaço |
| 8th Wall | Overlay AR com engine-binary | Dados sobrepostos ao ativo físico |
| WebAR mock | Cena conceitual sem engine AR | Plano B para demonstrar sem câmera/SLAM |

## Como executar com Docker

Na pasta deste projeto:

```bash
docker compose up --build
```

Depois acesse:

- Streamlit: <http://localhost:8501>
- Índice web: <http://localhost:8080>
- Chart.js: <http://localhost:8080/chartjs/>
- D3.js: <http://localhost:8080/d3/>
- p5.js: <http://localhost:8080/p5/>
- Leaflet: <http://localhost:8080/leaflet/>
- 8th Wall AR: <http://localhost:8080/8thwall-digital-twin/>
- Mock WebAR: <http://localhost:8080/8thwall-mock/>

Para parar:

```bash
docker compose down
```

## Observação sobre 8th Wall

O 8th Wall mudou: o antigo hosted platform foi aposentado e o projeto passou a ser aberto em `8thwall.org`/GitHub. O framework, módulos centrais e ferramentas foram disponibilizados sob MIT, enquanto SLAM segue distribuído separadamente como binário.

Este pacote agora inclui:

1. `web/8thwall-digital-twin`: demo AR usando `@8thwall/engine-binary`, `xrextras`, `landing-page` e A-Frame.
2. `web/8thwall-mock`: demo conceitual executável mesmo sem câmera/SLAM.
3. `web/8thwall-template`: template comentado para adaptação em projetos 8th Wall Studio.

## Roteiro sugerido para apresentação

1. **Chart.js** — gráficos web básicos: tendência, comparação, distribuição.
2. **Streamlit** — dashboard operacional rápido: KPIs, filtros e alertas.
3. **D3.js** — visualização customizada: grafo de entidades e dependências.
4. **p5.js** — simulação 2D: planta, ocupação e risco.
5. **Leaflet** — visualização espacial: sensores em campus/cidade.
6. **8th Wall/WebAR** — interface em campo: dados sobre o ativo físico.

Frase-guia:

> A interface ideal de um Gêmeo Digital depende da decisão que o usuário precisa tomar: acompanhar, diagnosticar, localizar, simular ou interagir com o sistema físico.
