// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'fastpi',
      script: 'npm',
      args: 'run dev',
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
};
