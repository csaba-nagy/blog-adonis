ARG VARIANT=16-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ARG USERNAME

ENV PROMPT_COMMAND="history -a"
ENV HISTFILE=/commandhistory/.bash_history

RUN mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory \
  && mkdir -p /home/$USERNAME/.vscode-server/extensions \
  && mkdir -p /home/$USERNAME/.local/share/pnpm/store \
  && chown -R $USERNAME /home/$USERNAME/.vscode-server /home/$USERNAME/.local/share

USER $USERNAME

RUN npm install -g \
  pnpm \
  @antfu/ni \
  && pnpm config set store-dir /home/$USERNAME/.local/share/pnpm/store
