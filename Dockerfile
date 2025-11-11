FROM node:24

COPY . .

## Preparando a aplicação
RUN npm i

## Criar Usuário no Banco ---TESTE! TUDO PODE DAR ERRADO, SÓ SE VIVE UMA VEZ
RUN node ./scripts/criarUsuario.js

## Rodando de fato
CMD ["node", "app.js"]