# Simulador de Empréstimos

[![codecov](https://codecov.io/gh/heitorluizp/simulador-emprestimo-teste-software/branch/main/graph/badge.svg)](https://codecov.io/gh/heitorluizp/simulador-emprestimo-teste-software)

## 1. Membros do Grupo

- Heitor Luiz
- Renato Silva Santos
- Caio Simões da Silva Ferreira

---

## 2. Explicação do Sistema

Este sistema é um simulador de empréstimos que permite ao usuário calcular o valor das parcelas, o valor total a ser pago, o total de juros, o prazo e a idade do solicitante a partir dos dados informados. 

### Como funciona

- **Preenchimento dos dados:**  
  O usuário informa o valor do empréstimo, o prazo em meses e sua data de nascimento.

- **Validação:**  
  O sistema checa se os valores são válidos (por exemplo, se o valor do empréstimo e o prazo são maiores que zero e se a idade mínima é respeitada).

- **Cálculo:**  
  Com os dados preenchidos, o sistema:
  - Calcula a idade do usuário.
  - Define a taxa de juros de acordo com a idade, seguindo regras pré-definidas.
  - Usa a fórmula PMT para calcular o valor fixo das parcelas.
   - PMT = PV × r / [1 - (1 + r)^-n]
   - Onde:
      - **PMT** = valor da parcela
      - **PV** = valor do empréstimo
      - **r** = taxa de juros mensal
      - **n** = número de parcelas

      Assim, o usuário consegue saber exatamente quanto vai pagar em cada mês e quanto pagará ao final do empréstimo.
  - Mostra o valor total a ser pago, o total de juros, o valor de cada parcela e o prazo.

- **Tabela de amortização:**  
  O usuário pode abrir uma tabela detalhada que mostra, mês a mês, quanto está pagando de juros, quanto está amortizando e qual o saldo devedor após cada parcela.
  A tabela de amortização é um recurso que mostra, de forma detalhada, como a dívida do empréstimo diminui ao longo do tempo. Nela, o usuário pode visualizar mês a mês:

- O número da parcela.
- O valor pago em juros naquela parcela.
- O valor efetivamente amortizado (abatido da dívida principal) em cada pagamento.
- O saldo devedor restante após cada parcela.
---

## 3. Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface de usuário.
- **Material UI**: Biblioteca de componentes React para estilização e responsividade.
- **Jest** e **React Testing Library**: Ferramentas para testes automatizados da interface e lógica do sistema.
- **Day.js**: Biblioteca para manipulação e cálculo de datas.
- **Node.js** e **npm**: Ambiente de execução e gerenciamento de dependências do projeto.

---

## 4. Requisitos para rodar o projeto Localmente

- Node.js (versão 18 ou superior)
- npm (geralmente instalado junto com o Node.js)

---

## 5. Instruções para Rodar Localmente

1. **Clone o repositório:**

   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd simulador-emprestimos
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Rode o sistema localmente:**

   ```sh
   npm start
   ```

   O sistema estará disponível em [http://localhost:3000](http://localhost:3000).

4. **Para rodar os testes:**
   ```sh
   npm test
   ```

---
