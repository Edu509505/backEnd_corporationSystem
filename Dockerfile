FROM node:24

COPY . .

## Preparando a aplicação
RUN npm i

## Rodando de fato
CMD ["node", "app.js"]