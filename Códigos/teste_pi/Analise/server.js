const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aluno',
  database: 'dados'
});

// Último dado do sensor
app.get('/api/sensores', (req, res) => {
  db.query('SELECT * FROM sensores ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
    res.json(results[0]);
  });
});

// Histórico para gráfico
app.get('/api/historico', (req, res) => {
  db.query('SELECT DATE_FORMAT(data_hora, "%H:%i") as hora, temperatura FROM sensores ORDER BY id DESC LIMIT 10', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar histórico' });
    }
    res.json(results.reverse()); // Em ordem cronológica
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${1880}`);
});
