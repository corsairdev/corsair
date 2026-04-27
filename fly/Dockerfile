FROM node:22-alpine

RUN npm install -g tsx

WORKDIR /app

# Install control server dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Control server source
COPY src ./src
COPY tsconfig.json ./

# workspace-defaults is copied to the Fly volume on first boot.
# It contains the runtime template: the actual corsair subprocess.
COPY workspace-defaults /workspace-defaults

# The volume mount point — persists installed plugins and the generated corsair.ts
RUN mkdir -p /workspace

EXPOSE 8080

ENV NODE_ENV=production \
    CONTROL_PORT=8080 \
    RUNTIME_PORT=3000 \
    WORKSPACE_DIR=/workspace \
    WORKSPACE_DEFAULTS_DIR=/workspace-defaults

CMD ["tsx", "src/index.ts"]
