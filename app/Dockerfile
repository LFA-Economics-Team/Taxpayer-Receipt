FROM node:lts-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5173
RUN chown -R node /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER node
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5173/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1 
CMD ["npm", "run" , "dev"]
