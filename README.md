<p align="center">
  <a href="https://rivenai.io" target="_blank" align="center" alt="Riven Holdings">
    <img width="200" src="./brand/assets/logo.png" alt="Riven Auth logo">
  </a>
</p>

# Riven Auth

**Riven Auth** is the identity and access management platform for **Riven Holdings**.

It provides secure, production-ready authentication for the Riven portfolio:
multi-tenant OIDC/OAuth 2.1, enterprise SSO, RBAC, user management, and a
web-based admin console.

- **Home:** <https://rivenai.io>
- **Admin console:** <https://auth-admin.rivenai.io/console>
- **Container image:** `ghcr.io/rivenai/riven-auth:0.1.0-riven`

## Upstream

Riven Auth is built on [Logto](https://github.com/logto-io/logto) v1.39.0
(MPL 2.0). See [`FORK.md`](FORK.md) for full attribution and upstream source
availability. The upstream `LICENSE` file is kept intact in this repository and
in the shipped container image.

## Running the image

```bash
docker run -p 3001:3001 -p 3002:3002 \
  -e DB_URL=postgres://user:pass@host:5432/logto \
  -e ENDPOINT=https://auth.rivenai.io \
  -e ADMIN_ENDPOINT=https://auth-admin.rivenai.io \
  ghcr.io/rivenai/riven-auth:0.1.0-riven
```

The core OIDC and Management API surface listens on **3001**; the admin console
surface listens on **3002**.

## Licensing

This project is distributed under the same license as the upstream Logto
project: [MPL-2.0](LICENSE).
