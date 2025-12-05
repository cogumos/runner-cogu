# <img src="https://netcattest.com/im/cogumos-cogumelo1.png" alt="Cogumelo" width="40"/> runner-cogu

---

![Demo](https://netcattest.com/im/cogumos-capa-5.gif)

## Um jeito mais inteligente e visual de rodar sua suíte Cypress usando Node.js + Module API

O **runner-cogu** é um pequeno script em Node.js que usa a Module API do Cypress para oferecer uma experiência de execução mais completa do que o tradicional:
```bash
npx cypress run
```

Com ele, você ganha **menus interativos**, **métricas básicas**, **checks antes da execução** e uma **visualização mais agradável** para entender rapidamente o que está acontecendo durante os testes.

---

![Demo](https://netcattest.com/im/cogumos-runner-3.gif)

## ✨ O que ele faz?

- Seleção de **usuário** e **ambiente** através de menus interativos
- Relatórios visuais no terminal (barra de progresso, status em tempo real, resumo limpo)
- **Checks da máquina** antes de rodar (CPU, memória, risco de falso negativo)
- **Quality Score** + **Índice de Estabilidade** com base nos resultados
- Integração com o Cypress via **Module API**, sem gambiarras
- Execução simplificada: `node runner-cogumos.js`

---

## 🚀 Como usar este projeto

Você pode usar o **runner-cogu** de duas formas:

### ✔️ 1. Começando um projeto novo com Cypress

Clone o repositório:
```bash
git clone https://github.com/cogumos/runner-cogu.git
```

Instale as dependências:
```bash
npm install
```

Certifique-se de que o Cypress está instalado. Se não estiver, rode:
```bash
npx cypress install
```

Agora, basta executar:
```bash
node runner-cogu
```

ou
```bash
node runner-cogu.js
```

---

### ✔️ 2. Inserindo o runner em um projeto Cypress já existente

Se você já tem uma automação rodando, basta:

1. Copiar o arquivo `runner-cogu.js` para dentro do seu projeto
2. Ajustar os caminhos e variáveis conforme sua estrutura
3. Verificar se sua versão do Cypress é compatível com a Module API
4. Adaptar o `package.json` para incluir os scripts ou dependências que deseja

Exemplo de script opcional (inserir dentro de `package.json`):
```bash
{
  "scripts": {
    "runner": "node runner-cogu.js"
    # continuação do seu código
  }
}
```

Depois disso, você pode executar diretamente por:
```bash
npm run runner
```

ou
```bash
node runner-cogu
```

ou
```bash
node runner-cogu.js
```

---

## 🔍 Verificando a instalação do Cypress

Antes de rodar o runner, confira:
```bash
npx cypress -v
```

Caso o Cypress não esteja instalado no seu projeto:
```bash
npx cypress install
```

---

## 🧩 Personalização

O **runner-cogu** é totalmente adaptável:

- Modifique o nome do runner-
- Troque os nomes dos usuários
- Personalize ambientes (Dev / QA / Stage / Prod)
- Mude as métricas
- Altere o formato do relatório
- Adicione novas validações antes da execução

O código foi feito para ser simples de editar.

---

## 📁 Estrutura básica do projeto
```
📦 seu-projeto/
├── cypress/
├── runner-cogu.js
├── package.json
└── README.md
```

---

## 💡 Por que usar este runner?

- Melhora a experiência de quem roda testes diariamente
- Reduz erros de ambiente e configuração
- Traz métricas que ajudam a visualizar estabilidade
- Centraliza configuração em um único lugar
- Deixa o processo mais profissional e previsível

**Simples, direto e útil.**
