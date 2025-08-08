FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package.json pnpm-lock.yaml ./
# Copy client files  
COPY client/package.json client/pnpm-lock.yaml ./client/
# Copy server files
COPY server/package.json server/pnpm-lock.yaml ./server/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile
RUN cd client && pnpm install --frozen-lockfile
RUN cd server && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build applications
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["pnpm", "start"]