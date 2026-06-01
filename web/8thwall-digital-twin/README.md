# 8th Wall — Digital Twin AR Overlay

Exemplo atualizado usando o stack aberto do 8th Wall pós-migração para `8thwall.org`.

## O que mudou no 8th Wall

Segundo a documentação atual:

- o hosted platform antigo foi aposentado em 28/02/2026;
- experiências já publicadas continuam rodando até 28/02/2027;
- o 8th Wall agora é um toolset open source para AR e 3D;
- framework, módulos principais e ferramentas estão sob MIT;
- SLAM continua distribuído separadamente como binário;
- há app desktop chamado 8th Wall Studio para projetos locais.

## O que esta demo mostra

- uso de `@8thwall/engine-binary` via CDN;
- uso de `xrextras` e `landing-page`;
- cena A-Frame com componente customizado;
- toque/click no chão para posicionar um ativo HVAC;
- overlay operacional com dados de Gêmeo Digital;
- cor de alerta e ação recomendada.

## Execução via Docker

Na raiz do projeto:

```bash
docker compose up web
```

Acesse:

```text
http://localhost:8080/8thwall-digital-twin/
```

No computador, `localhost` costuma funcionar para teste. Em celular, câmera/AR geralmente exige HTTPS. Para demonstração móvel, use um túnel HTTPS ou abra/adapte o projeto no 8th Wall Studio Desktop.

## Relação com Gêmeos Digitais

Esta demo representa a situação em que um técnico está em campo e precisa ver dados sobrepostos ao ativo físico:

- status do equipamento;
- temperatura;
- vibração;
- CO₂ da zona;
- recomendação operacional.

A mensagem didática é:

> AR faz sentido quando a decisão precisa ser tomada no local, olhando para o ativo físico.
