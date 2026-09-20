# Harmonia

Webapp em português para explorar campos harmônicos e compor com autonomia. Não gera letras nem progressões de acordes.

## Funcionalidades

- Seleção de tom e modo maior ou menor natural.
- Escala e sequência de tons e semitons.
- Campo harmônico com tríades, sétimas, extensões e inversões.
- Diagramas de violão com dedos, pestanas e cordas soltas ou abafadas.
- Escala completa no braço até a casa 24.
- Cinco shapes da pentatônica do tom e do relativo, com repetições por oitava e tônicas destacadas.
- Indicação de notas fora do tom nas variações de acordes.

## Executar localmente

O projeto é estático: HTML, CSS e JavaScript, sem instalação de dependências ou etapa de compilação.

Com Python 3 instalado, execute na raiz do repositório:

```sh
python -m http.server 5180 --directory dist
```

Abra http://localhost:5180 no navegador.

## Estrutura

- `dist/index.html`: interface.
- `dist/app.js`: estado e controles.
- `dist/music.js`: escalas, acordes e escrita enarmônica.
- `dist/guitar.js`: posições e diagramas de acordes.
- `dist/scales.js`: braço completo e shapes pentatônicos.
- `dist/*.css`: estilos responsivos.
- `.openai/hosting.json`: identificação da hospedagem existente no Sites.

## Convenções musicais

Afinação padrão de violão: E A D G B e. Os cinco shapes são numerados pela posição no braço, das casas mais baixas às mais altas, e se repetem a cada 12 casas. Trechos fora das casas 0–24 são recortados e identificados. A escala menor utilizada é a menor natural.

As posições dos acordes são calculadas para conter as notas indicadas e respeitar o baixo das inversões. A digitação sugerida é uma possibilidade; adapte-a ao seu conforto.

## Publicação

Hospede o conteúdo de `dist/` em um serviço de arquivos estáticos. O app não usa servidor de aplicação, banco de dados ou chaves de API. As fontes são carregadas do Google Fonts, com fontes locais alternativas.

Versão hospedada: https://harmonia-giova-0920.giovannemarrone.chatgpt.site (acesso privado).
