# MeshCore Brasil — novo site

Site da comunidade brasileira de MeshCore, construído como uma mescla de três fontes de conteúdo existentes em um único lugar de referência.

## A ideia

A comunidade brasileira de MeshCore tinha conteúdo distribuído em sites diferentes, cada um com informações complementares mas sem um ponto central de entrada. A ideia foi unificar tudo em um site só, com identidade visual consistente, mantendo e creditando o conteúdo original de cada fonte.

## Fontes de conteúdo

| Site | Contribuição |
|---|---|
| [meshcore.com.br](https://meshcore.com.br) | Identidade visual, parâmetros de rádio para o Brasil, introdução ao MeshCore |
| [meshsorocaba.org](https://www.meshsorocaba.org) | Guias de configuração, lista de equipamentos com preços, gerador de nomes para repetidoras, `brazil_cities.json` (UN/LOCODE) |
| [regionmesh.com](https://www.regionmesh.com) | Referência complementar de conteúdo |

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Home com visão geral, parâmetros de rádio e links para a comunidade |
| `pages/o-que-e.html` | Explicação do MeshCore, modos de operação e FAQ |
| `pages/equipamentos.html` | Companions e repetidoras recomendados com preços (consultados em abr/2026) |
| `pages/configuracao.html` | Guia passo a passo para companion, repetidora e observer |
| `pages/comunidade.html` | Grupos de Telegram, Discord e grupos regionais |
| `pages/ferramentas.html` | Gerador de nomes para repetidoras + CoreScope |
| `pages/flasher.html` | Embed de flasher.meshcore.io |
| `pages/mapa.html` | Embed de map.meshcore.io centrado no Brasil |
| `pages/corescope.html` | Embed de corescope.meshcore.com.br/#/live |

## Stack

HTML + CSS puro, sem framework. Um arquivo JS para o gerador de nomes (`js/repeater-name-generator.js`) portado do meshsorocaba com `brazil_cities.json` (lista completa de municípios brasileiros com abreviações UN/LOCODE).

## Preset de rádio

A comunidade brasileira usa o preset **"Australia: SA, WA / Brazil"** no app MeshCore — adicionado oficialmente pelo mantenedor após solicitação da comunidade.

```
Frequência:        923.125 MHz
Bandwidth:         62.5 kHz
Spreading Factor:  SF 8
Coding Rate:       CR 8
Faixa Anatel:      915–928 MHz (Resolução 680/2017)
Potência máxima:   30 dBm (1W)
```

## Comunidade

- Telegram: [@meshcorebrasil](https://t.me/meshcorebrasil)
- Telegram Sorocaba: [@meshsorocaba](https://t.me/meshsorocaba)
- Discord global: [meshcore.gg](https://meshcore.gg)

---

Site independente, não afiliado ao projeto MeshCore oficial.
