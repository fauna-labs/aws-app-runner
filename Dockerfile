# Copyright Fauna, Inc.
# SPDX-License-Identifier: MIT-0
FROM node:12.22.4
WORKDIR /app-runner

COPY . .

RUN npm ci

ENTRYPOINT [ "npm", "run", "start" ]

