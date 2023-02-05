# Trend in One API 서버

## 0. Information

### 0-1. API Documents

- Development API: localhost:13000/docs

### 0-2. Maintainers

- 임채성 | [@puleugo](https://github.com/puleugo)

### 0-3. Technical Specs

- Node.js 16 (with Yarn)
- Nest.js 9

---

## 1. Prerequisites

### 1-1. Setup Environment Variables

Copy example environment variables.

```shell
$ cp .env.example .env
```

Change values below accordingly.

```dotenv
# Application
APP_URL=localhost:3000
APP_PORT=3000
APP_SECRET=xxxxxxxxxx

# Database
DB_HOST=xxxxxxxxxx
DB_PORT=15432
DB_DATABASE=xxxxxxxxxx
DB_USERNAME=xxxxxxxxxx
DB_PASSWORD=xxxxxxxxxx
```
