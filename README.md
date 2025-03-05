# 📱 API de Gerenciamento de Campanhas

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Descrição

API de Gerenciamento de Campanhas desenvolvida com NestJS que permite criar e gerenciar campanhas de envio de mensagens em massa. A API é responsável por processar os dados e enviar mensagens para uma fila RabbitMQ, que podem ser consumidas por diferentes serviços implementados em Rust, TypeScript ou Go.

## 🔧 Pré-requisitos

- Node.js (v18 ou superior)
- Docker
- Docker Compose
- Git

## ⚙️ Configuração Inicial

### Clone o repositório

```bash
git clone https://github.com/gabrigabs/api-campaign-management.git
cd api-campaign-management
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo .env baseado no .env.example:
```bash
cp .env.example .env
```

## 🚀 Executando a Aplicação

### 1. Inicie os serviços com Docker Compose

```bash
docker-compose up -d
```

Este comando iniciará os seguintes serviços:
- 📦 PostgreSQL
- 🐰 RabbitMQ
- 🌿 MongoDB

### 2. Execute as migrações do banco de dados e seed

Para rodar as migrações

```bash
npx prisma migrate dev
```
Para popular o banco de dados com dados iniciais:

```bash
npm run seed
```
Após executar o seed, você terá dois usuários disponíveis:

```
Email: admin@acme.com / Senha: 123456
Email: admin@netflix.com / Senha: 123456
```

Para redefinir o banco de dados (em caso de necessidade):

```bash
npm run db:reset
```

bash
npm run db:reset

### 3. Inicie a aplicação

### Para desenvolvimento

```bash
npm run start:dev
```

#### Para produção
```
npm run build
npm run start:prod
```
## 📝 Testando a API

### Utilizando o Postman

O projeto inclui uma coleção do Postman para testar todos os endpoints:

1. Importe o arquivo "Campaign Management API.postman_collection.json" no Postman
2. Configure a variável de ambiente "baseUrl" para a sua url com a porta que você configurou
3. Comece com os endpoints de autenticação (Auth) para obter um token
4. Com o token obtido é possivel testar as rotas de campanhas, já as rotas de companies não são necessárias autenticação


## 📚 Documentação Adicional

A documentação da API está disponível em:
- Swagger UI: endpoint /api/docs (disponível após iniciar a aplicação)


## 🔄 Integração com Consumidores de Mensagens

Esta API produz mensagens em uma fila RabbitMQ que podem ser consumidas por um dos três consumidores abaixo:


[🦀 Consumidor em Rust](https://github.com/gabrigabs/rust-campaign-message-consumer)


 [📘 Consumidor em TypeScript](https://github.com/gabrigabs/typescript-campaign-message-consumer)

[🦦 Consumidor em Go](https://github.com/gabrigabs/go-campaign-message-consumer)

 As informações para configurar e rodar cada consumer estão em seu respectivo repositório
