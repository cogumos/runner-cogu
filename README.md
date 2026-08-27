# runner-cogu

> Runner customizado para Cypress com Node.js e Module API, criado para tornar a execução de testes E2E pelo terminal mais clara, previsível e fácil de operar.

O `runner-cogu` adiciona uma camada de execução sobre o Cypress com seleção interativa de usuário e ambiente, checks da máquina, acompanhamento pelo terminal e métricas para ajudar a interpretar a qualidade e a estabilidade da rodada de testes.

`// executar. observar. entender.`


## >_ o que ele faz

- seleção interativa de **usuário e ambiente**;
- execução via **Cypress Module API**;
- verificações de CPU e memória;
- acompanhamento da execução diretamente pelo terminal;
- resumo dos resultados;
- **Quality Score** e **Índice de Estabilidade**;
- configuração adaptável para diferentes projetos Cypress.

```text
usuário → ambiente → checks → Cypress → resultados → métricas
```


## >_ como testar

```bash
git clone https://github.com/cogumos/runner-cogu.git
cd runner-cogu
npm install
node runner-cogu.js
```

Se o Cypress ainda não estiver disponível:

```bash
npx cypress install
```

Depois, basta seguir as opções apresentadas pelo runner no terminal.


## >_ integrar em outro projeto Cypress

Copie `runner-cogu.js` para o seu projeto, ajuste usuários, ambientes e configurações e execute:

```bash
node runner-cogu.js
```

Ou adicione ao `package.json`:

```json
{
  "scripts": {
    "runner": "node runner-cogu.js"
  }
}
```

E rode:

```bash
npm run runner
```


## >_ stack

`Cypress` `Cypress Module API` `Node.js` `JavaScript` `npm`

**Foco:** `E2E Testing` `Test Automation` `Quality Engineering` `CLI` `Developer Experience`
