---
title: "Deploying a Node.js App on AWS EC2 with Nginx and PM2"
date: "2024-01-15"
tags: ["Node.js", "AWS", "DevOps"]
excerpt: "A step-by-step guide to getting your Node.js application running in production on EC2, with Nginx as a reverse proxy and PM2 for process management."
published: true
---

## Why EC2?

When you want full control over your server environment, EC2 is the right choice. Unlike managed platforms, you decide the OS, the process manager, the reverse proxy — everything.

This guide covers a setup that I've used in production:

- **Node.js + Express** as the application server
- **PM2** to keep the process alive and restart on crash
- **Nginx** as a reverse proxy on port 80/443
- **Ubuntu 22.04** on the EC2 instance

## Launch your EC2 instance

From the AWS console, launch an **Ubuntu 22.04 LTS** instance. A `t3.micro` is fine for a personal site — it's free tier eligible.

Make sure your security group allows:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS)

## Install Node.js

SSH into your instance and install Node via `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## Deploy your app

Clone your repo and install dependencies:

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
npm install --production
```

## Set up PM2

PM2 keeps your app running as a daemon:

```bash
npm install -g pm2
pm2 start app.js --name my-blog
pm2 startup   # auto-start on reboot
pm2 save
```

## Configure Nginx

Install Nginx and create a site config:

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/my-blog
```

Paste this config (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Add HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

That's it. Your Node.js app is now running in production with automatic HTTPS renewal.
