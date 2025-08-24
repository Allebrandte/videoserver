# 🎬 VideoServer Multi-Cliente

Sistema de gerenciamento de vídeos e programação para SmartTVs e Box Android.

## 🚀 Funcionalidades
- Multi-cliente (cada cliente com login/senha e pasta própria)
- Upload de vídeos
- Grade de programação
- Streaming ao vivo
- Painel moderno
- Deploy com Docker

## 📦 Instalação com Docker
```bash
git clone https://github.com/Allebrandte/videoserver.git
cd videoserver
docker-compose up -d
```

- Painel: `http://187.16.231.233:3000`
- API: `http://187.16.231.233:3001`
- MongoDB: `mongodb://localhost:27017`

Login inicial: `admin / admin123`
