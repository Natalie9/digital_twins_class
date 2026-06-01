# D3.js — Fluxo de decisão do Gêmeo Digital

Demonstra uma visualização customizada que seria difícil de representar com gráficos prontos.

## Demonstra

- SVG manipulado com D3;
- fluxo explícito: ambiente físico → sensor → gateway → modelo → alerta → operador;
- seleção interativa de ambientes;
- destaque do caminho do dado até a decisão;
- painel lateral com métricas e ação recomendada;
- animação de partículas para representar o dado trafegando pelo sistema.

## Execução

```bash
docker compose up web
```

Acesse: <http://localhost:8080/d3/>
