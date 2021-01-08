const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server,{
  cors: {
  origin: "http://localhost:19000",
  methods: ["GET", "POST"]
}});

// Conecta no MongoDB
mongoose.connect(
  "mongodb://localhost:27017/",{ 
    useUnifiedTopology: true, 
    useNewUrlParser: true
    }
);

// Carrega o model de Usuário
require("./models/user");
require("./models/moto")
require("./models/checklist")

app.use((req,res, next) =>{
  req.io = io;
  return next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inicia as rotas da API
app.use("/api", require("./controllers/userController"));
console.log("Servidor Rodando na porta 3000")
app.listen(3000);
