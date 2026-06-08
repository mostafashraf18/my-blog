# AWS EC2 Deployment Guide

Complete guide to deploying this Node.js blog on an AWS EC2 instance.

---

## 1. Launch EC2 Instance

In the AWS Console:
1. **AMI**: Ubuntu Server 22.04 LTS
2. **Instance type**: t3.micro (free tier eligible)
3. **Key pair**: Create or select one (save the .pem file)
4. **Security group** — allow inbound:
   - SSH (22) — your IP only
   - HTTP (80) — 0.0.0.0/0
   - HTTPS (443) — 0.0.0.0/0

---

## 2. Connect to Your Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## 3. Server Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20

# Install PM2 globally
npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

---

## 4. Deploy the App

```bash
# Clone your repo (or use scp / git)
git clone https://github.com/yourusername/my-blog.git
cd my-blog

# Install production dependencies
npm install --production

# Copy and edit environment variables
cp .env.example .env
nano .env   # fill in your values
```

---

## 5. Start with PM2

```bash
pm2 start app.js --name my-blog
pm2 startup         # generates a systemd command — run it
pm2 save            # persist the process list
```

**Useful PM2 commands:**
```bash
pm2 status          # check app status
pm2 logs my-blog    # view logs
pm2 restart my-blog # restart app
pm2 stop my-blog    # stop app
```

---

## 6. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/my-blog
```

Paste:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. HTTPS with Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-renews. Test renewal: `sudo certbot renew --dry-run`

---

## 8. Point Your Domain

In your domain registrar / Route 53, create:
- **A record**: `@` → EC2 Public IP
- **A record**: `www` → EC2 Public IP

Or use an **Elastic IP** in AWS to get a static IP that won't change on restarts.

---

## 9. Deploy Updates

```bash
cd ~/my-blog
git pull
npm install --production
pm2 restart my-blog
```

Optionally, set up a GitHub Actions workflow for automatic deploys on push.

---

## Architecture Summary

```
Internet → Route 53 / Domain
         → EC2 (Ubuntu)
           → Nginx :80/:443 (reverse proxy + SSL termination)
             → Node.js/Express :3000 (PM2 daemon)
               → src/content/posts/*.md (blog content)
```
