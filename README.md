# Prompt Template Manager

REST API for managing versioned prompt templates. See [SPEC.md](SPEC.md) for requirements.

## Setup

```bash
npm install
```

## Scripts

- `npm start` — run the server (default port 3000)
- `npm run dev` — run with nodemon
- `npm test` — run Jest tests

## Health check

```bash
curl http://localhost:3000/health
```

## API Endpoints

### Create template
```bash
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{"name":"My Template","content":"Hello {{name}}","tags":["greeting"],"variables":[{"name":"name"}]}'
```

### List templates
```bash
curl http://localhost:3000/templates
curl "http://localhost:3000/templates?tag=greeting&name=my"
```

### Get template by ID
```bash
curl http://localhost:3000/templates/$TEMPLATE_ID
```

### Update template
```bash
curl -X PATCH http://localhost:3000/templates/$TEMPLATE_ID \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated {{name}} content"}'
```

### Get specific version
```bash
curl http://localhost:3000/templates/$TEMPLATE_ID/versions/1
```

### Render template
```bash
curl -X POST http://localhost:3000/templates/$TEMPLATE_ID/render \
  -H "Content-Type: application/json" \
  -d '{"variables":{"name":"Kshitij"}}'
```