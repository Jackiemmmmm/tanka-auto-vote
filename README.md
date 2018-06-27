# exchange-web

> Base react, redux project and antd component

## Development

### Install

```sh
$ yarn
```
### Usage

```sh
$ yarn start
```

### Build

```sh
$ yarn build
```

## Deploy

### nginx
```sh
$ docker run -d --name dealer -p 9005:80 \
-v `pwd`/build:/usr/share/nginx/html:ro \
-v `pwd`/default.conf:/etc/nginx/conf.d/default.conf \
-v `pwd`/nginx.conf:/etc/nginx/nginx.conf \
nginx
```

### caddy
```sh
docker run -d --name dealer \
    -v $(pwd)/Caddyfile:/etc/Caddyfile \
    -v $(pwd)/build:/var/www/dealer \
    -p 9005:80 \
    abiosoft/caddy
```
