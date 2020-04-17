# bbce-middleware-logger
Repositório para o middleware de registro de log para o sistema BBCE

## TODO LIST BEFORE FINISH

- [x] Atualiza comando de start com -Rf
- [ ] TSLINT => ESLINT
- [ ] Usar mais o `npx`
- [ ] Garantir o tamanho baixo da imagem.

## Libraries List

- axios
- jest
- TypeDI
- TypeORM
- on-finished
- uuidv4

## Como Utilizar

Adicionar a variável no .env, como exemplo abaixo
```
LOGGER_BASE_PATH="http://bbce.rarolabs.com:8008"/logger/v1
```

Registrar o Middleware no arquivo de dependências
```
Container.set("loggerMiddleware", LoggerMiddlewareFactory.create(process.env.LOGGER_BASE_PATH));
```

No index, adicione como middleware global, como exemplo abaixo.
```
const middleware = Container.get<LoggerMiddleware>("loggerMiddleware");
app.use(middleware.registrarLog.bind(middleware));
```