const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting: máximo 2 requests por IP por hora
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 2, // máximo 2 requests
  message: 'Muitas tentativas. Tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS restrito (ajuste para seu domínio)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://seusite.vercel.app' : '*', // Substitua pelo seu domínio
  methods: ['POST'], // Apenas POST
}));

app.use(bodyParser.json({ limit: '10kb' })); // Limite de tamanho do body

// Função para sanitizar inputs (remover scripts/tags)
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim(); // Remove tags HTML
}

app.post('/api', (req, res) => {
  const { firstName, lastName, whatsapp } = req.body;

  // Validação de entrada
  if (!whatsapp || !/^\d{10,15}$/.test(whatsapp)) {
    return res.status(400).json({ error: 'Número do WhatsApp inválido (10-15 dígitos).' });
  }
  if (!lastName || lastName.length > 100) {
    return res.status(400).json({ error: 'Plano inválido.' });
  }

  // Sanitizar
  const sanitizedFirstName = sanitizeInput(firstName || '');
  const sanitizedLastName = sanitizeInput(lastName);
  const sanitizedWhatsapp = sanitizeInput(whatsapp);

  // Verificar se SENHA_FIXA está definida (sem fallback inseguro)
  const SENHA = process.env.SENHA_FIXA;
  if (!SENHA) {
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }

  const MY_WHATSAPP = process.env.MY_WHATSAPP;
  if (!MY_WHATSAPP) {
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }

  const msg = `🚀 *NOVO PEDIDO CMTV*\n👤 CLIENTE: ${sanitizedWhatsapp}\n📦 PLANO: ${sanitizedLastName}\n🔑 SENHA: ${SENHA}`;
  const link = `https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(msg)}`;

  res.status(200).json({ whatsappLink: link });
});

module.exports = app;