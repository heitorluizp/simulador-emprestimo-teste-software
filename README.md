# Simulador de Empréstimos

[![codecov](https://codecov.io/gh/heitorluizp/simulador-emprestimo-teste-software/branch/main/graph/badge.svg)](https://codecov.io/gh/heitorluizp/simulador-emprestimo-teste-software)

## 1. Membros do Grupo

- Heitor Luiz
- Renato Silva Santos
- Caio

---

## 2. Explicação do Sistema

Este sistema é um simulador de empréstimos que permite ao usuário calcular o valor das parcelas, o valor total a ser pago, o total de juros, o prazo e a idade do solicitante a partir dos dados informados. O usuário deve preencher o valor do empréstimo, o prazo em meses e a data de nascimento. O sistema valida as informações, realiza o cálculo considerando regras de taxa de juros por idade e exibe os resultados de forma clara e detalhada, incluindo uma tabela de amortização das parcelas.

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
