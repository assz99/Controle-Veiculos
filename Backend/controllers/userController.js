const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require('fs');
const User = mongoose.model("User");
const Motorcycles = mongoose.model("Motorcycles");
const Checklist = mongoose.model("CheckList");



//Aki se cria a requisição para registrar um novo usuario
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: "Usuario ja existe." });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "Falha em cadastrar usuario." });
  }
});
//Aki se cria a requisição para autenticar o usuario
router.post("/authenticate", async (req, res) => {
  try {

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log("usuario tentando logar com usuario: " + username);

    if (!user) {
      return res.status(400).json({ error: "Usuario não encontrado." });
      console.log("Usuario não encontrado.");
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: "Senha invalida." });
      console.log("Senha invalida.");
    }

    return res.json({
      user,
      token: user.generateToken()
    });
  } catch (err) {
    return res.status(400).json({ error: "Falha de autentificação de usuario." });
  }
});
//Aki se cria a requisição para registrar uma nova moto
router.post("/motos", async (req, res) => {
  const { label, value } = req.body;

  try {
    if (await Motorcycles.findOne({ label })) {
      return res.status(400).json({ error: "Moto ja existe." });
    }
    if (await Motorcycles.findOne({ value })) {
      return res.status(400).json({ error: "Moto ja existe." });
    }

    const moto = await Motorcycles.create(req.body);

    return res.json({ moto });
  } catch (err) {
    return res.status(400).json({ error: "Falha em cadastrar moto." });
  }
});


//Aki se cria a requisição para passar as motos cadastradas
router.get("/motos", async (req, res) => {
  try {
    const moto = await Motorcycles.find();
    return res.json({ moto });
  } catch (err) {
    return res.status(400).json({ error: "Falha em pegar as motos." });
  }
})

router.get("/pilots", async (req, res) => {
  try {
    const pilots = await User.find({}, { "_id": 0, "name": 1, "username": 1 });
    return res.json({ pilots });
  } catch (err) {
    return res.status(400).json({ error: "Falha em pegar os usuarios." });
  }

})


router.get("/checklist", async (req, res) => {
  try {
    const checklist = await Checklist.find({}, { "_id": 0, "user": 1, "motoSelected": 1, "kmInicial": 1, "kmFinal": 1, "annotation": 1, "horarioInicial": 1, "horarioFinal": 1, "problems": 1, "imageName": 1 });
    return res.json({ checklist });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Falha em pegar os checklists." });
  }

})
router.post("/oil", async (req, res) => {
  try {
    
    const moto = req.body.motoSelected;
    const kmInicial = req.body.kmInicial;
    const dbData = await Motorcycles.findOne({value:moto});
    
    if(kmInicial >= dbData.oil){
      return res.status(200).json({
        message: 'oil',
      })
    }
    
    return res.status(200).json({
      message: 'sucess!',
    })

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Falha em Verificar o oleo" });
  }
})


//Aki se cria a requisição para receber os dados do checkist e armazenar no mongoDB
router.post("/checklist", async (req, res) => {

  try {
    const state = req.body;
    //console.log(req.body);
    const moto = state.motoSelected;
    const data = state.horarioInicial;
    const nMoto = await Motorcycles.findOne({ value: moto });
    if (!nMoto) {
      console.log("Moto não encontrado.");
      return res.status(400).json({ error: "Moto não encontrado." });
    }
    console.log("Moto: " + moto + " encontrada.");
    let d = new Date();
    const dataf = d.toString();
    
	const test = await Motorcycles.findOneAndUpdate({value:state.motoSelected},{lastMileage:state.kmFinal},{new: true});
    if(state.problems.indexOf("isCheckedOleo") != -1 ){
      const newOil = Number(state.kmInicial) + 1000;
      await Motorcycles.findOneAndUpdate({value:state.motoSelected}, {oil:newOil},{new: true});
    }
    
    
    const CheckList = {
      user: state.user.name,
      motoSelected: state.motoSelected,
      kmInicial: state.kmInicial,
      kmFinal: state.kmFinal,
      annotation: state.annotation,
      horarioInicial: state.horarioInicial,
      horarioFinal: dataf,
      problems: state.problems,
      imageName: state.imageName,
    };

    const checklist = await Checklist.create(CheckList);

    res.status(200).json({
      message: 'Sucesso!',
    })
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Falha em cadastrar checklist." });
  }
});


module.exports = router;
