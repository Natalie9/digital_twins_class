# Template conceitual para 8thWall

Este diretório não é uma aplicação 8thWall pronta para publicar, pois a plataforma usa estrutura e chaves próprias.

Use como referência para criar a experiência no painel do 8thWall.

## Ideia da experiência

- O técnico aponta o celular para uma máquina HVAC.
- A cena reconhece uma superfície ou imagem alvo.
- Um painel AR aparece sobre o ativo.
- O painel mostra métricas do Gêmeo Digital.
- A cor do painel indica estado: normal, atenção ou crítico.

## Arquivos

- `app.html`: estrutura conceitual de cena.
- `app.js`: lógica fictícia para atualizar o painel.

## Adaptação real

Em um projeto 8thWall real, você normalmente adicionaria scripts como:

```html
<script src="//apps.8thwall.com/xrweb?appKey=SUA_APP_KEY"></script>
```

E usaria componentes do 8thWall para world tracking, image targets ou surface placement.
