module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'anton',
      host: '158.160.163.154',
      ref: 'origin/main',
      repo: 'git@github.com:antonElsikora/nodejs-mesto-project.git',
      path: '/home/anton/production',
      'pre-deploy-local':
        'scp .env anton@158.160.163.154:/home/anton/production/current/',
      'post-deploy':
        'npm install && npm run build && pm2 restart ecosystem.config.js --env production',
    },
  },
};
