FROM node:20-alpine

# Install curl for healthchecks/debugging
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables for dev container
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV WATCHPACK_POLLING=true

EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
