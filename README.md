# Demos de Visualização e Interface para Gêmeos Digitais

Este repositório reúne uma coleção de mini projetos usados em aula para demonstrar diferentes formas de visualização e interação em **Gêmeos Digitais**.

O objetivo é comparar tecnologias de interface a partir de um mesmo cenário: um **edifício inteligente/laboratório** com ambientes monitorados por sensores.

As demos mostram que a escolha da interface depende da decisão que o usuário precisa tomar: acompanhar, diagnosticar, localizar, simular ou interagir com o ativo físico.

---

## Cenário das demos

Todas as demonstrações usam, sempre que possível, o mesmo conjunto de dados simulados.

O sistema representa um edifício com ambientes como:

- Laboratório de IA;
- Laboratório de Robótica;
- Sala de Aula;
- Casa de Máquinas / HVAC;
- Auditório.

Cada ambiente possui leituras fictícias de:

- temperatura;
- CO₂;
- ocupação;
- energia;
- status operacional.

O status pode ser:

| Status | Interpretação |
|---|---|
| `normal` | ambiente dentro da faixa esperada |
| `atencao` | métrica acima do limite de atenção |
| `critico` | métrica acima do limite crítico |

### Limites usados

#### Temperatura

| Faixa | Status |
|---|---|
| `≤ 25,5 °C` | normal |
| `> 25,5 °C` | atenção |
| `> 27,5 °C` | crítico |

#### CO₂

| Faixa | Status |
|---|---|
| `≤ 850 ppm` | normal |
| `> 850 ppm` | atenção |
| `> 1200 ppm` | crítico |

O status final do ambiente fica crítico se **temperatura ou CO₂** ultrapassarem o limite crítico.

Um caso proposital incluído nos dados é o ambiente `HVAC-A`, que possui **temperatura crítica com CO₂ baixo**. Ele serve para mostrar que nem todo alerta crítico é causado por ar poluído; também pode haver falha térmica ou problema de climatização.

---

## Tecnologias demonstradas

| Tecnologia | Demonstração | Pergunta que responde |
|---|---|---|
| Streamlit | Dashboard operacional em Python | Como montar rapidamente um painel analítico? |
| Chart.js | Gráficos web simples | Quais são os valores, tendências e distribuições? |
| D3.js | Fluxo de decisão customizado | Como o dado percorre o sistema até virar decisão? |
| p5.js | Simulador 2D de conforto ambiental | Como representar comportamento e interação em uma planta? |
| Leaflet | Mapa operacional | Onde está o problema e qual área/rota importa? |
| 8th Wall | Overlay AR/WebAR | Como sobrepor dados ao ativo físico em campo? |

---

## Estrutura do projeto

```text
.
├── docker-compose.yml
├── data/
│   ├── sensor_readings.csv
│   └── sensors.json
├── streamlit-dashboard/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── web/
│   ├── index.html
│   ├── style.css
│   ├── data/
│   │   ├── sensor_readings.csv
│   │   └── sensors.json
│   ├── slides/
│   ├── chartjs/
│   ├── d3/
│   ├── p5/
│   ├── leaflet/
│   ├── 8thwall-digital-twin/
│   ├── 8thwall-mock/
│   └── 8thwall-template/
└── scripts/
    └── presentation-server.ps1
```

### Dados

Os dados principais estão em:

```text
data/sensors.json
web/data/sensors.json
```

A pasta `data/` é usada pelo Streamlit.  
A pasta `web/data/` é usada pelas demos HTML/JavaScript.

---

## Pré-requisitos

Para executar todas as demos com facilidade, recomenda-se instalar:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git
- Navegador moderno, como Chrome, Edge ou Firefox

Opcionalmente, para testar acesso por celular:

- Tailscale, ngrok, Cloudflare Tunnel ou outro túnel HTTPS;
- rede Wi-Fi local com os dispositivos na mesma rede.

---

## Como executar com Docker

Na pasta do projeto, execute:

```bash
docker compose up --build
```

Depois acesse:

| Página | URL |
|---|---|
| Índice das demos | <http://localhost:8080> |
| Slides da aula | <http://localhost:8080/slides/> |
| Chart.js | <http://localhost:8080/chartjs/> |
| D3.js | <http://localhost:8080/d3/> |
| p5.js | <http://localhost:8080/p5/> |
| Leaflet | <http://localhost:8080/leaflet/> |
| 8th Wall AR | <http://localhost:8080/8thwall-digital-twin/> |
| Streamlit | <http://localhost:8501> |

Para parar os serviços:

```bash
docker compose down
```

---

## Como executar apenas as demos web

As demos web são servidas por Nginx no Docker:

```bash
docker compose up web
```

Acesse:

```text
http://localhost:8080
```

---

## Como executar apenas o Streamlit

```bash
docker compose up --build streamlit
```

Acesse:

```text
http://localhost:8501
```

---

## Descrição das demos

### Slides

URL:

```text
http://localhost:8080/slides/
```

Página de apresentação da aula. Contém uma sequência de slides sobre visualização e interface em Gêmeos Digitais, com links para as demonstrações.

---

### Chart.js

URL:

```text
http://localhost:8080/chartjs/
```

Mostra gráficos web simples:

- CO₂ ao longo do tempo;
- energia por ambiente;
- distribuição dos estados.

Uso didático:

> Chart.js é adequado para incorporar gráficos tradicionais em aplicações web com pouco esforço.

---

### Streamlit

URL:

```text
http://localhost:8501
```

Dashboard operacional em Python com:

- KPIs;
- filtros por ambiente;
- gráfico temporal;
- tabela de estado;
- alertas e recomendações.

Uso didático:

> Streamlit é útil para prototipar rapidamente dashboards analíticos e interfaces para especialistas técnicos.

---

### D3.js

URL:

```text
http://localhost:8080/d3/
```

Mostra um fluxo de decisão:

```text
ambiente físico → sensor → gateway → modelo → alerta → operador
```

A visualização permite clicar em uma sala e destacar o caminho do dado até a decisão.

Uso didático:

> D3.js é indicado quando a visualização precisa ser customizada para explicar relações, fluxos ou processos que não cabem bem em gráficos prontos.

---

### p5.js

URL:

```text
http://localhost:8080/p5/
```

Simulador 2D de conforto ambiental com:

- planta baixa simplificada;
- partículas representando pessoas;
- modos de interação: `+ Pessoas`, `Ventilar` e `Falha térmica`;
- cards com resumo dos ambientes;
- painel da sala selecionada;
- barras de temperatura e CO₂;
- botão de reset.

Uso didático:

> p5.js é útil para representar comportamento, simulação e interação visual em uma planta ou ambiente 2D.

---

### Leaflet

URL:

```text
http://localhost:8080/leaflet/
```

Mapa operacional com:

- sensores georreferenciados;
- zonas de risco;
- filtros por estado;
- lista de prioridade de inspeção;
- rota sugerida até o sensor selecionado;
- camadas de mapa.

Uso didático:

> Leaflet é adequado quando a decisão depende de localização, território, rota ou área afetada.

---

### 8th Wall / WebAR

URL:

```text
http://localhost:8080/8thwall-digital-twin/
```

Demonstra uma interface de campo com overlay AR para um ativo HVAC.

Mostra:

- equipamento representado em 3D;
- painel flutuante com dados do Gêmeo Digital;
- status, temperatura, vibração, CO₂ e ação sugerida.

Uso didático:

> WebAR é útil quando o usuário precisa tomar decisão no local, olhando para o ativo físico.

Observação: recursos de câmera/AR em celular geralmente exigem HTTPS. Para testar em dispositivos móveis, use uma URL HTTPS, por exemplo via Tailscale Funnel, ngrok ou Cloudflare Tunnel.

---

## Acesso pelo celular

### Opção 1 — Mesma rede Wi-Fi

Se o computador e o celular estiverem na mesma rede, descubra o IP local do computador e acesse:

```text
http://IP_DO_COMPUTADOR:8080
```

Exemplo:

```text
http://192.168.0.10:8080
```

Se o firewall bloquear, libere a porta `8080`.

### Opção 2 — Tailscale Serve

Disponibiliza a página apenas para dispositivos conectados à mesma tailnet:

```bash
tailscale serve --bg 8080
```

Veja a URL com:

```bash
tailscale serve status
```

### Opção 3 — Tailscale Funnel

Disponibiliza uma URL pública HTTPS:

```bash
tailscale funnel --bg 8080
```

Veja a URL com:

```bash
tailscale serve status
```

Depois da apresentação, desligue o compartilhamento:

```bash
tailscale serve reset
```

---

## Script auxiliar para apresentação local

Em Windows, há um script auxiliar em:

```text
scripts/presentation-server.ps1
```

Ele sobe o serviço web e mostra os IPs disponíveis para acesso pela rede local.

Uso:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/presentation-server.ps1
```

Para abrir as configurações de Hotspot Móvel do Windows:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/presentation-server.ps1 -OpenHotspotSettings
```

Para ativar também o Tailscale Serve:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/presentation-server.ps1 -EnableTailscaleServe
```

---

## Como modificar os dados

Edite os arquivos:

```text
data/sensors.json
web/data/sensors.json
```

Se alterar os dados históricos, mantenha também os CSVs correspondentes:

```text
data/sensor_readings.csv
web/data/sensor_readings.csv
```

As páginas web carregam os dados de `web/data/sensors.json`.  
O Streamlit lê os dados de `data/sensor_readings.csv`.

---

## Sugestão de roteiro de estudo

1. Abra os slides em `http://localhost:8080/slides/`.
2. Veja o Chart.js para entender valores e tendências.
3. Veja o Streamlit para observar o dashboard operacional.
4. Veja o D3.js para entender o fluxo do dado até a decisão.
5. Veja o p5.js para experimentar uma simulação 2D.
6. Veja o Leaflet para discutir localização e inspeção.
7. Veja o 8th Wall para discutir interfaces de campo com AR.

---

## Ideia central

> O dado pode ser o mesmo, mas a interface muda conforme a decisão que se deseja apoiar.

Em um Gêmeo Digital, uma boa visualização não deve apenas exibir sensores. Ela deve ajudar o usuário a entender estado, risco, contexto e ação possível.
