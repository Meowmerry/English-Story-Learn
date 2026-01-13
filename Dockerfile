# Use Node.js base image
FROM node:18-bullseye

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server ./server

# Install dependencies
RUN npm install --production

# Download the model (this will be done at build time)
# You may want to do this at runtime instead to reduce image size
# RUN ollama pull gpt-oss

# Expose ports
EXPOSE 3001
EXPOSE 11434

# Create startup script
RUN echo '#!/bin/bash\n\
ollama serve &\n\
sleep 5\n\
ollama pull phi3\n\
node server/index.js' > /app/start.sh && chmod +x /app/start.sh

# Start both Ollama and the Node server
CMD ["/app/start.sh"]
