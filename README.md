# Experimental blog project

### Set up:
1. Before you build the devcontainer, you should create the necessary *.env* files: `cp .env.example .env && cd packages/server && cp .env.example .env`
2. To change the default values, open and modify the *.env* file at root directory.

### Connection testing:
1. Start the server package from root via `pnpm start:server` command
2. Visit ***http://127.0.0.1:3333/health*** (or your custom server address) to check the connection status.
