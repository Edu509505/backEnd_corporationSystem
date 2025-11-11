FROM node:24

COPY . .

## Criar Usuário no Banco ---TESTE! TUDO PODE DAR ERRADO, SÓ SE VIVE UMA VEZ
RUN node ./scripts/criarUsuario.js

## Preparando a aplicação
RUN npm i


## Rodando de fato
CMD ["node", "app.js"]