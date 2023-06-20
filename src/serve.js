const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const FILE_PATH = './cardapio.json';

// Carregar dados do arquivo JSON
let cardapio = [];
if (fs.existsSync(FILE_PATH)) {
  const fileData = fs.readFileSync(FILE_PATH);
  cardapio = JSON.parse(fileData);
}

// Salvar dados no arquivo JSON
function salvarCardapio() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(cardapio, null, 2));
}

// Endpoint: Adicionar um item ao cardápio
app.post('/cardapio', (req, res) => {
  const novoItem = req.body;
  cardapio.push(novoItem);
  salvarCardapio();
  res.status(201).json(novoItem);
});

// Endpoint: Retornar o cardápio completo
app.get('/cardapio', (req, res) => {
  res.json(cardapio);
});

// Endpoint: Retornar um item específico do cardápio (consulta por ID)
app.get('/cardapio/:id', (req, res) => {
  const itemId = req.params.id;
  const item = cardapio.find((item) => item.id === itemId);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
});

// Endpoint: Alterar um item do cardápio
app.put('/cardapio/:id', (req, res) => {
  const itemId = req.params.id;
  const itemIndex = cardapio.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    cardapio[itemIndex] = req.body;
    salvarCardapio();
    res.json(cardapio[itemIndex]);
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
});

// Endpoint: Excluir um item do cardápio
app.delete('/cardapio/:id', (req, res) => {
  const itemId = req.params.id;
  const itemIndex = cardapio.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const deletedItem = cardapio.splice(itemIndex, 1);
    salvarCardapio();
    res.json(deletedItem[0]);
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});