
# Technology Stack Templates

> **Related Guides:**
>
  -$2Project setup: [01_project_setup.md](01_project_setup.md)

>
  -$2Development workflow: [03_development_and_maintenance.md](03_development_and_maintenance.md)

>
  -$2Deployment platforms: [09_deployment_platforms.md](09_deployment_platforms.md)

>
  -$2Database migrations: [14_database_migrations.md](14_database_migrations.md)

## # # # # Stack Decision Questions

Before implementation, ask these questions:

```text
text
text
text
markdown


1. Frontend Requirements:

  -$2Framework preference? (React, Vue, Svelte, Angular)
  -$2SSR requirements? (Next.js, Nuxt, SvelteKit)
  -$2Static vs Dynamic?
  -$2UI component library preferences?


1. Backend Requirements:

  -$2Language preference? (Node.js, Python, Go, Java, Rust)
  -$2Framework preference? (Express, FastAPI, Gin, Spring, Actix)
  -$2API architecture? (REST, GraphQL, gRPC)
  -$2Authentication requirements?


1. Database Requirements:

  -$2Development database? (SQLite, PostgreSQL, MySQL)
  -$2Production database? (PostgreSQL, MySQL, MongoDB)
  -$2ORM preference?
  -$2Migration strategy?


1. Development Environment:

  -$2Local development setup?
  -$2CI/CD requirements?
  -$2Containerization needs?
  -$2Development team size?

```text
text
text
text
text

## # # # # Template Path 1: Modern JavaScript Full Stack

## # ## Development Environment

## # ### Frontend (Next.js)

```text
text
text
text
yaml

## # # # docker-compose.dev.frontend.yml

version: '3.8'
services:
  frontend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./frontend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.dev

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2./frontend:/app
  -$2/app/node_modules

```text
text

```text
    ports:

```text

```text
text
  -$2"3000:3000"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=development
  -$2NEXT_PUBLIC_API_URL=<<<<<<http://localhost:4000>>>>>>

```text
text
text
text
text

## # # # ### Backend (Node.js/Express)

```text
text
text
text
yaml

## # # # docker-compose.dev.backend.yml

version: '3.8'
services:
  backend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./backend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.dev

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2./backend:/app
  -$2/app/node_modules

```text
text

```text
    ports:

```text

```text
text
  -$2"4000:4000"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=development
  -$2DATABASE_URL=postgresql://user:pass@db:5432/devdb

```text
text

```text
    depends_on:

```text

```text
text
  -$2db

  db:

```text
text

```text
    image: postgres:15-alpine

```text

```text
text

```text
text

```text
    environment:

```text

```text
text
  -$2POSTGRES_USER=user
  -$2POSTGRES_PASSWORD=pass
  -$2POSTGRES_DB=devdb

```text
text

```text
    ports:

```text

```text
text
  -$2"5432:5432"

```text
text

```text
    volumes:

```text

```text
text
  -$2postgres_dev_data:/var/lib/postgresql/data

volumes:
  postgres_dev_data:

```text
text
text
text
text

## # # # ## Production Environment

## # ### Frontend (Next.js)

```text
text
text
text
yaml

## # # # docker-compose.prod.frontend.yml

version: '3.8'
services:
  frontend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./frontend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.prod

```text

```text
text

```text
text

```text
    ports:

```text

```text
text
  -$2"3000:3000"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=production
  -$2NEXT_PUBLIC_API_URL=<<<<<<https://api.production.com>>>>>>

```text
text
text
text
text

## # # # ### Backend (Node.js/Express)

```text
text
text
text
yaml

## # # # docker-compose.prod.backend.yml

version: '3.8'
services:
  backend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./backend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.prod

```text

```text
text

```text
text

```text
    ports:

```text

```text
text
  -$2"4000:4000"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=production
  -$2DATABASE_URL=${PROD_DATABASE_URL}

```text
text
text
text
text

## # # # # Template Path 2: Python/Vue Stack

## # ## Development Environment

## # ### Frontend (Vue.js)

```text
text
text
text
yaml

## # # # docker-compose.dev.frontend.yml

version: '3.8'
services:
  frontend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./frontend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.dev

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2./frontend:/app
  -$2/app/node_modules

```text
text

```text
    ports:

```text

```text
text
  -$2"8080:8080"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=development
  -$2VUE_APP_API_URL=<<<<<<http://localhost:8000>>>>>>

```text
text
text
text
text

## # # # ### Backend (Python/FastAPI)

```text
text
text
text
yaml

## # # # docker-compose.dev.backend.yml

version: '3.8'
services:
  backend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./backend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.dev

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2./backend:/app

```text
text

```text
    ports:

```text

```text
text
  -$2"8000:8000"

```text
text

```text
    environment:

```text

```text
text
  -$2ENVIRONMENT=development
  -$2DATABASE_URL=mysql://user:pass@db:3306/devdb

```text
text

```text
    depends_on:

```text

```text
text
  -$2db

  db:

```text
text

```text
    image: mysql:8

```text

```text
text

```text
text

```text
    environment:

```text

```text
text
  -$2MYSQL_ROOT_PASSWORD=rootpass
  -$2MYSQL_DATABASE=devdb
  -$2MYSQL_USER=user
  -$2MYSQL_PASSWORD=pass

```text
text

```text
    ports:

```text

```text
text
  -$2"3306:3306"

```text
text

```text
    volumes:

```text

```text
text
  -$2mysql_dev_data:/var/lib/mysql

volumes:
  mysql_dev_data:

```text
text
text
text
text

## # # # ## Production Environment

## # ### Frontend (Vue.js)

```text
text
text
text
yaml

## # # # docker-compose.prod.frontend.yml

version: '3.8'
services:
  frontend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./frontend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.prod

```text

```text
text

```text
text

```text
    ports:

```text

```text
text
  -$2"80:80"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=production
  -$2VUE_APP_API_URL=<<<<<<https://api.production.com>>>>>>

```text
text
text
text
text

## # # # ### Backend (Python/FastAPI)

```text
text
text
text
yaml

## # # # docker-compose.prod.backend.yml

version: '3.8'
services:
  backend:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: ./backend

```text

```text
text

```text
text

```text
      dockerfile: Dockerfile.prod

```text

```text
text

```text
text

```text
    ports:

```text

```text
text
  -$2"8000:8000"

```text
text

```text
    environment:

```text

```text
text
  -$2ENVIRONMENT=production
  -$2DATABASE_URL=${PROD_DATABASE_URL}

```text
text
text
text
text

## # # # # Container Orchestration

> **Related Sections:**
>
  -$2For deployment strategies: See [04_deployment.md](04_deployment.md)

>
  -$2For monitoring setup: See [10_troubleshooting.md](10_troubleshooting.md)

>
  -$2For AI integration: See [00_ai_guidelines.md](00_ai_guidelines.md)

## 1. Kubernetes Templates

```text
text
text
text
yaml

## # # # deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3
  selector:

```text
text

```text
    matchLabels:

```text

```text
text

```text
text

```text
      app: web

```text

```text
text
  template:

```text
text

```text
    metadata:

```text

```text
text

```text
text

```text
      labels:

```text

```text
text

```text
text

```text
        app: web

```text

```text
text

```text
text

```text
    spec:

```text

```text
text

```text
text

```text
      containers:

```text

```text
text
  -$2name: web

```text
text

```text
        image: app:latest

```text

```text
text

```text
text

```text
        ports:

```text

```text
text
  -$2containerPort: 80

```text
text

```text
        resources:

```text

```text
text

```text
text

```text
          limits:

```text

```text
text

```text
text

```text
            cpu: "1"

```text

```text
text

```text
text

```text
            memory: "512Mi"

```text

```text
text

```text
text

```text
          requests:

```text

```text
text

```text
text

```text
            cpu: "0.5"

```text

```text
text

```text
text

```text
            memory: "256Mi"

```text

```text
text

```text
text

```text
        livenessProbe:

```text

```text
text

```text
text

```text
          httpGet:

```text

```text
text

```text
text

```text
            path: /health

```text

```text
text

```text
text

```text
            port: 80

```text

```text
text

```text
text

```text
          initialDelaySeconds: 30

```text

```text
text

```text
text

```text
          periodSeconds: 10

```text

```text
text

```text
text

```text
        readinessProbe:

```text

```text
text

```text
text

```text
          httpGet:

```text

```text
text

```text
text

```text
            path: /ready

```text

```text
text

```text
text

```text
            port: 80

```text

```text
text

```text
text

```text
          initialDelaySeconds: 5

```text

```text
text

```text
text

```text
          periodSeconds: 5

```text

```text
text

```text
text
text
text
text

## 1. Service Mesh Configuration

```text
text
text
text
yaml

## # # # istio-config.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: app-routes
spec:
  hosts:
  -$2app.example.com

  gateways:
  -$2app-gateway

  http:
  -$2match:
  -$2uri:

```text
text

```text
        prefix: /api

```text

```text
text

```text
text

```text
    route:

```text

```text
text
  -$2destination:

```text
text

```text
        host: api-service

```text

```text
text

```text
text

```text
        port:

```text

```text
text

```text
text

```text
          number: 80

```text

```text
text
  -$2route:
  -$2destination:

```text
text

```text
        host: web-service

```text

```text
text

```text
text

```text
        port:

```text

```text
text

```text
text

```text
          number: 80

```text

```text
text

```text
text
text
text
text

## 1. Helm Charts

```text
text
text
text
yaml

## # # # values.yaml

replicaCount: 3
image:
  repository: app
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  annotations:

```text
text

```text
    kubernetes.io/ingress.class: nginx

```text

```text
text
  hosts:
  -$2host: app.example.com

```text
text

```text
      paths: ["/"]

```text

```text
text
resources:
  limits:

```text
text

```text
    cpu: 1

```text

```text
text

```text
text

```text
    memory: 512Mi

```text

```text
text
  requests:

```text
text

```text
    cpu: 500m

```text

```text
text

```text
text

```text
    memory: 256Mi

```text

```text
text
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

```text
text
text
text
text

## 1. Docker Compose for Development

```text
text
text
text
yaml

## # # # docker-compose.dev.yml

version: '3.8'

services:
  app:

```text
text

```text
    build:

```text

```text
text

```text
text

```text
      context: .

```text

```text
text

```text
text

```text
      target: development

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2.:/app
  -$2/app/node_modules

```text
text

```text
    ports:

```text

```text
text
  -$2"3000:3000"

```text
text

```text
    environment:

```text

```text
text
  -$2NODE_ENV=development

```text
text

```text
    command: npm run dev

```text

```text
text
  db:

```text
text

```text
    image: postgres:13-alpine

```text

```text
text

```text
text

```text
    volumes:

```text

```text
text
  -$2postgres_data:/var/lib/postgresql/data

```text
text

```text
    environment:

```text

```text
text
  -$2POSTGRES_USER=dev
  -$2POSTGRES_PASSWORD=dev
  -$2POSTGRES_DB=app_dev

  redis:

```text
text

```text
    image: redis:alpine

```text

```text
text

```text
text

```text
    ports:

```text

```text
text
  -$2"6379:6379"

```text
text

```text
    volumes:

```text

```text
text
  -$2redis_data:/data

volumes:
  postgres_data:
  redis_data:

```text
text
text
text
text

## 1. Multi-Stage Builds

```text
text
text
text
dockerfile

## # # # Dockerfile

## # Build stage

FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

## # # # Development stage

FROM node:16-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

## # # # Production stage

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]

```text
text
text
text
text

## # # # # YAML Configuration Testing

> **Related Testing Guides:**
>
  -$2General testing setup: [02_testing_setup.md](02_testing_setup.md)

>
  -$2AI-driven testing: [00_ai_guidelines.md](00_ai_guidelines.md)

>
  -$2Deployment testing: [09_deployment_platforms.md](09_deployment_platforms.md)

## 1. Pre-Deployment Validation

```text
text
text
text
bash

## # !/bin/bash

## # validate_yaml.sh

## # Required tools

command -v yamllint >/dev/null 2>&1 || { echo "yamllint required"; exit 1; }
command -v yq >/dev/null 2>&1 || { echo "yq required"; exit 1; }

## # # # Validate YAML syntax

validate_yaml() {

```text
text

```text
    local file=$1

```text

```text
text

```text
text

```text
    echo "Validating $file..."

```text

```text
text

```text
text

```text
    if ! yamllint -d relaxed "$file"; then

```text

```text
text

```text
text

```text
        echo "❌ YAML syntax error in $file"

```text

```text
text

```text
text

```text
        return 1

```text

```text
text

```text
text

```text
    fi

```text

```text
text

```text
text

```text
    echo "✅ $file is valid"

```text

```text
text

```text
text

```text
    return 0

```text

```text
text
}

## # # # Find and validate all YAML files

find . -type f \( -name "*.yml" -o -name "*.yaml" \) -exec bash -c 'validate_yaml "$0"' {} \;

```text
text
text
text
text

## 1. Schema Validation

```text
text
text
text
yaml

## # # # .yamllint.yml

extends: default

rules:
  line-length: disable
  document-start: disable
  truthy:

```text
text

```text
    check-keys: false

```text

```text
text

```text
text
text
text
text

## 1. Environment Variable Testing

```text
text
text
text
bash

## # # # test_env_substitution.sh

```bash
#!/bin/bash
```

test_env_substitution() {

```text
text

```text
    local file=$1

```text

```text
text

```text
text

```text
    echo "Testing env vars in: $file"

```text

```text
text

## # # Create test environment file

```text
text

```text
    cat > .env.test << EOF

```text

```text
text

```text
text

```text
    DATABASE_URL=postgresql://test:test@localhost:5432/testdb

```text

```text
text

```text
text

```text
    API_KEY=test_key

```text

```text
text

```text
text

```text
    NODE_ENV=test

```text

```text
text
EOF

## # # # Test substitution

```text
text

```text
    if ! docker-compose --env-file .env.test -f "$file" config > /dev/null 2>&1; then

```text

```text
text

```text
text

```text
        echo "❌ Environment variable substitution failed in: $file"

```text

```text
text

```text
text

```text
        return 1

```text

```text
text

```text
text

```text
    fi

```text

```text
text

```text
text

```text
    echo "✅ Environment variable substitution successful in: $file"

```text

```text
text

```text
text

```text
    return 0

```text

```text
text
}

## # # # Test all docker-compose files

find . -type f -name "docker-compose*.yml" -exec bash -c 'test_env_substitution "$0"' {} \;

```text
text
text
text
text

## 1. CI/CD Integration

```text
text
text
text
yaml

## # # # .github/workflows/yaml-validation.yml

name: YAML Validation

on:
  push:

```text
text

```text
    paths:

```text

```text
text
  -$2'**.yml'
  -$2'**.yaml'

  pull_request:

```text
text

```text
    paths:

```text

```text
text
  -$2'**.yml'
  -$2'**.yaml'

jobs:
  validate:

```text
text

```text
    runs-on: ubuntu-latest

```text

```text
text

```text
text

```text
    steps:

```text

```text
text
  -$2uses: actions/checkout@v2
  -$2name: Install tools

```text
text

```text
        run: |

```text

```text
text

```text
text

```text
          pip install yamllint

```text

```text
text

```text
text

```text
          sudo snap install yq

```text

```text
text
  -$2name: Validate YAML

```text
text

```text
        run: ./validate_yaml.sh

```text

```text
text

```text
text
text
text
text

## # # # # Database Migration Strategies

## # ## Development to Production

## # ### PostgreSQL to PostgreSQL

```text
text
text
text
bash

## # !/bin/bash

## # migrate_postgres.sh

## # Dump development database

pg_dump -h localhost -U devuser -d devdb > dev_dump.sql

## # # # Modify production connection settings

sed -i 's/devuser/produser/g' dev_dump.sql
sed -i 's/devdb/proddb/g' dev_dump.sql

## # # # Import to production

psql -h production-host -U produser -d proddb < dev_dump.sql

```text
text
text
text
text

## # # # ### SQLite to PostgreSQL

```text
text
text
text
python

## # # # migrate_sqlite_to_postgres.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def migrate_data():

```text
text

```text
    sqlite_engine = create_engine('sqlite:///dev.db')

```text

```text
text

```text
text

```text
    postgres_engine = create_engine('postgresql://user:pass@host/proddb')

```text

```text
text

```text
text

```text
    Session = sessionmaker(bind=sqlite_engine)

```text

```text
text

```text
text

```text
    sqlite_session = Session()

```text

```text
text

```text
text

```text
    ProdSession = sessionmaker(bind=postgres_engine)

```text

```text
text

```text
text

```text
    prod_session = ProdSession()

```text

```text
text

## # # Migration logic here

```text
text
text
text
text

## # # # ### MySQL to PostgreSQL

```text
text
text
text
bash

## # !/bin/bash

## # migrate_mysql_to_postgres.sh

## # Export from MySQL

mysqldump -h localhost -u devuser -p devdb > mysql_dump.sql

## # # # Convert to PostgreSQL format

pgloader mysql://devuser:pass@localhost/devdb \
  postgresql://produser:pass@production-host/proddb

```text
text
text
text
text

## # # # # Environment-Specific Configurations

## # ## Development

```text
text
text
text
yaml

## # # # .env.development

NODE_ENV=development
API_URL=<<<<<<http://localhost:8000>>>>>>
DATABASE_URL=postgresql://user:pass@localhost:5432/devdb
REDIS_URL=redis://localhost:6379

```text
text
text
text
text

## # # # ## Production

```text
text
text
text
yaml

## # # # .env.production

NODE_ENV=production
API_URL=<<<<<<https://api.production.com>>>>>>
DATABASE_URL=${PROD_DATABASE_URL}
REDIS_URL=${PROD_REDIS_URL}

```text
text
text
text
text

## # # # # Implementation Guidelines


1. **Start with Development Environment**

  -$2Set up local databases first
  -$2Configure development tools
  -$2Set up hot-reloading
  -$2Enable debugging tools


1. **Create Production Configuration**

  -$2Remove development dependencies
  -$2Configure production databases
  -$2Set up SSL/TLS
  -$2Configure caching


1. **Set up CI/CD Pipeline**

  -$2Configure testing environments
  -$2Set up staging environment
  -$2Configure production deployment
  -$2Set up monitoring


1. **Database Migration Process**

  -$2Create migration scripts
  -$2Test with sample data
  -$2Plan production migration
  -$2Set up backup strategy

## # # # # Security Considerations


1. **Development**

  -$2Use dummy data
  -$2Local environment variables
  -$2Disable sensitive features
  -$2Use development certificates


1. **Production**

  -$2Secure environment variables
  -$2Production SSL certificates
  -$2Database encryption
  -$2Access control

## # # # # Monitoring Setup


1. **Development**

  -$2Local logging
  -$2Development metrics
  -$2Performance profiling
  -$2Error tracking


1. **Production**

  -$2Production logging
  -$2Metrics collection
  -$2Alert system
  -$2Performance monitoring
