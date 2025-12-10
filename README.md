![Demo](https://netcattest.com/im/foto3-runner-cogu.jpg)

## Uma maneira mais visual e prática de rodar testes Cypress Node.js + Module API

O **runner-cogu** é um script em Node.js que oferece uma experiência de execução mais completa do que o tradicional `npx cypress run`, com **menus interativos**, **métricas básicas**, **relatórios mais claros**, **checagens de ambiente** e uma **visualização mais agradável** para entender rapidamente o que está acontecendo durante os testes, sem alterar sua estrutura.

---

![Demo](https://netcattest.com/im/escolha-runner-cogu.gif)

## ✨ Recursos principais

- Seleção de **usuário** e **ambiente** através de menus interativos
- Relatórios visuais no terminal (barra de progresso, status em tempo real, resumo limpo)
- **Checks da máquina** antes de rodar (CPU, memória, risco de falso negativo)
- **Quality Score** + **Índice de Estabilidade** com base nos resultados
- Integração com o Cypress via **Module API**, sem gambiarras
- Execução simplificada: `node runner-cogu`

---

## 🚀 Como usar

1️⃣ Em um projeto novo


```bash
git clone https://github.com/cogumos/runner-cogu.git
npm install
npx cypress install
node runner-cogu.js

```

---

2️⃣ Em um projeto Cypress existente

- Copie `runner-cogu.js` para seu projeto
- Ajuste caminhos/variáveis conforme sua estrutura
- (Opcional) Adicione ao `package.json`:

Exemplo de script opcional (inserir dentro do arquivo `package.json`):
```json
{
  "scripts": {
    "runner": "node runner-cogu.js"
  }
}
```

Depois disso, você pode executar diretamente por:
```bash
npm run runner
#ou
node runner-cogu
#ou
node runner-cogu.js
```
---


## 🔍 Checando o Cypress
```bash
# Antes de rodar o runner, confira:
npx cypress -v
# Caso o Cypress não esteja instalado no seu projeto:
npx cypress install
```

---

## ⚙️ Personalização

O **runner-cogu** permite alterar o nome do runner, além de personalizar usuários, ambientes, métricas, validações e o formato dos relatórios, tudo de forma simples e fácil de editar.

---


## 💡 Vantagens

- Melhora a experiência de quem roda testes diariamente
- Reduz erros de ambiente e configuração
- Traz métricas que ajudam a visualizar estabilidade
- Centraliza configuração em um único lugar
- Deixa o processo mais profissional e previsível

---
