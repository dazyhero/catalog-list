## Running the app in the docker 

```bash
# development
$ docker-compose up
```

## Running the app locally 

### Start db

```bash
# development
$ docker-compose up db
```

### Add .env file
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/catalog-list?schema=public"
JWT_SECRET="secret-key"
JWT_EXPIRATION_TIME=256000
```

## Documentation

All the documentation is running on localhost:3000/api there will be swagger open api

### Test using postman

First authorize
/localhost:3000/authentication/register
with user data in the body

```json
{
    "email": "test@gmail.com",
    "password": "1234"
}
```

Then login
localhost:3000/authentication/log-in
with user data in the body

```json
{
    "email": "test@gmail.com",
    "password": "1234"
}
```

After that cookies should be automatically applied in the postman and further request will use them


## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
