# Tech no Dia Dia

Site institucional com duas páginas para serviços técnicos presenciais em Niterói e São Gonçalo.

## Estrutura

```
tech-no-dia-dia/
├── index.html              → página principal
├── seguranca.html          → segunda aba (segurança digital + CFTV)
├── assets/
│   ├── css/styles.css      → todo o visual do site
│   ├── js/main.js          → menu, simuladores, avaliações, FAQ
│   └── img/                → logo, favicon, portfólio, câmeras e imagens de CFTV
└── README.md
```

## Como abrir

Basta dar dois cliques em `index.html`. O site funciona direto no navegador, sem instalar nada.

Para testar como se estivesse publicado, abra esta pasta no VS Code e use a extensão **Live Server**, ou rode:

```powershell
cd "C:\Users\eliel\Documents\tech-no-dia-dia"
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## O que editar antes de publicar

### 1. WhatsApp e telefone

O contato configurado é **(79) 98117-3409** e o link do WhatsApp usa `5579981173409`.

- A constante `WHATSAPP` em `assets/js/main.js` já está com esse número.
- Os links `wa.me` e o `tel:` dos dois arquivos HTML também já estão atualizados.
- Se o número mudar, faça a substituição em `assets/js/main.js` e nos dois HTMLs.

### 2. Instagram e e-mail

- Instagram: o perfil configurado é `https://www.instagram.com/tecnodiadia/` nos dois HTMLs.
- E-mail: o endereço configurado é `t3chnodiadia@gmail.com` nos dois HTMLs.

### 3. Nome do responsável e CNPJ

Os dados já estão preenchidos como:

- **Responsável técnico:** Eliel Alexsander
- **CNPJ:** 69.008.173/0001-52

Eles aparecem no rodapé das duas páginas e no bloco de assinatura da seção **CFTV em operação**. Se algum dado mudar, faça a substituição nos dois arquivos HTML e também no `README.md`.

### 4. Portfólio de serviços

As fotos de atendimentos realizados ficam em `assets/img/portfolio/` e aparecem na seção **Serviços realizados** da página inicial:

- `assistencia-tecnica.jpg`
- `instalacao-de-telas.jpg`
- `otimizacao-de-notebooks.jpg`
- `pc-montado.jpg`
- `reparo-de-impressoras.jpg`
- `reparo-de-notebook.jpg`
- `servico-a-escritorio.jpg`
- `servico-para-claro.jpg`

As imagens foram recortadas em proporção 2:3, redimensionadas para 900 × 1350 px e otimizadas em JPEG. Elas recebem um tom verde do site por padrão e voltam à cor original ao passar o mouse. Para trocar uma foto, substitua o arquivo mantendo o mesmo nome ou atualize o `src` no `index.html`. Os títulos e as descrições de cada card também ficam nesse arquivo.

### 5. Imagens da área de CFTV

As imagens estão em `assets/img/`:

- `cftv-monitoramento.webp`
- `cftv-controle.jpg`
- `cftv-mural.jpg`
- `cftv-cameras.jpg`

Elas recebem um tratamento de cor em CSS para combinar com o verde-limão e o azul-marinho do site. Para usar fotos reais dos seus atendimentos, basta substituir os arquivos mantendo os mesmos nomes ou atualizar os caminhos no `seguranca.html`.

A simulação de monitoramento com os canais **Entrada**, **Sala**, **Quintal** e **Garagem** fica em `assets/img/cameras/`:

- `entrada.jpg`
- `sala.jpg`
- `quintal.jpg`
- `garagem.jpg`

As imagens foram redimensionadas para 800 × 450 px e otimizadas em JPEG. O efeito VHS (scanlines, ruído e varredura animada) é aplicado apenas em CSS; ao passar o mouse sobre uma câmera, o filtro some e a imagem volta às cores originais com mais nitidez. Para trocar uma cena, substitua o arquivo mantendo o mesmo nome ou atualize o `src` em `index.html` e `seguranca.html`.

### 6. Preços e estimativas

Os valores dos simuladores estão em `assets/js/main.js`:

- `problems` → faixa de preço por tipo de problema na página inicial.
- `equipAdjustment` → ajuste por tipo de equipamento.
- `servicePrices` e `cameraPrices` → valores da área de segurança.

Os preços exibidos nos cards de serviço da página `seguranca.html` são texto no HTML e podem ser ajustados diretamente.

### 7. Avaliações

A seção de avaliações é uma **simulação de demonstração**, com nomes, textos e notas fictícios. Há um aviso discreto abaixo dos depoimentos. Substitua pelos depoimentos reais quando tiver autorização dos clientes.

### 8. Logos das empresas

Os logos de Claro, Lenovo, Vivo e TIM foram representados como wordmarks estilizados em texto/CSS, sem imagens externas. Se quiser usar os arquivos oficiais, coloque as imagens em `assets/img/` e substitua os `<span class="brand-logo ...">` no `index.html` por `<img>`.

### 9. Logo e favicon

A logo da Tech no Dia Dia está em `assets/img/logo-tech.png` e é usada no cabeçalho e no rodapé das duas páginas. O favicon é `assets/img/favicon.png`, e o ícone para atalhos no celular é `assets/img/apple-touch-icon.png`. Para trocar a identidade visual, substitua esses arquivos mantendo os mesmos nomes.

## Recursos prontos

- Layout responsivo (desktop, tablet e celular).
- Menu mobile com acessibilidade básica.
- Simulador de atendimento na página inicial com estimativa e resumo enviado ao WhatsApp.
- Consulta de bairro em Niterói e São Gonçalo.
- Segunda página de segurança com 4 serviços detalhados, calculadora de orçamento, FAQ e avaliações.
- Portfólio com oito fotos de serviços realizados na página inicial.
- Galeria de CFTV com quatro imagens tratadas nas cores do site.
- Identificação do responsável técnico e CNPJ no rodapé e na seção de CFTV.
- FAQ em acordeão.
- Botão flutuante de WhatsApp.
- Animações suaves e respeito a `prefers-reduced-motion`.
- Sem dependência de framework ou banco de dados.

## Publicação

Opções simples e gratuitas:

1. **Netlify Drop** — arraste a pasta `tech-no-dia-dia` em https://app.netlify.com/drop.
2. **Vercel** — importe a pasta como projeto estático.
3. **GitHub Pages** — envie os arquivos para um repositório e ative o Pages.
4. **Hospedagem tradicional** — envie o conteúdo da pasta para `public_html` via FTP.

Depois de publicar, vale comprar um domínio como `technodiadia.com.br` e apontar para a hospedagem.
