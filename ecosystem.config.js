// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "PHB E-commerce Hub",
      script: "npm",
      args: "start",
      cwd: "/var/www/phb-umkm.my.id",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      error_file: "/var/www/phb-umkm.my.id/logs/error.log",
      out_file: "/var/www/phb-umkm.my.id/logs/output.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      combine_logs: true,
    },
  ],
};
