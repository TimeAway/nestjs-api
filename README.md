# NestJS Service API Learning 

## Installation

```bash
$ yarn
```

## Pre-operation

```bash
# start docker
$ yarn db:dev:up

# start prisma studio
$ prisma studio
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# watch mode
$ yarn test:watch

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## QA
Q1. 启动项目后，调用接口 500，查看日志发现无法连接数据库。

A1: 必须先启动 docker，开启数据库。先把项目关闭，启动数据库之后，再重新开启服务即可。
