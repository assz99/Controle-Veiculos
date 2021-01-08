const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const User = mongoose.model("User");
const Motorcycles = mongoose.model("Motorcycles");
const Checklist = mongoose.model("CheckList");

router.post("/register", async (req, res) => {
  const { name, username,password } = req.body;

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ error:"Usuario ja existe." });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "Falha em cadastrar usuario." });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    console.log("entrou");

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log("usuario tentando logar com usuario: "+username);
    
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

router.post("/motos", async (req, res) => {
  const { label,value } = req.body;

  try {
    if (await Motorcycles.findOne({ label })) {
      return res.status(400).json({ error:"Moto ja existe." });
    }
    if (await Motorcycles.findOne({ value })) {
      return res.status(400).json({ error:"Moto ja existe." });
    }

    const moto = await Motorcycles.create(req.body);

    return res.json({ moto });
  } catch (err) {
    return res.status(400).json({ error: "Falha em cadastrar moto." });
  }
});



router.get("/motos", async (req, res) => {
  try {
    const moto = await Motorcycles.find();
    return res.json({ moto });
  } catch (err) {
    return res.status(400).json({ error: "Falha em pegar as motos." });
  }
});
router.post("/checklist", async (req, res) => {
  const { user,moto,kmInicial,kmFinal,problems,annotation} = req.body;

  try {
    

    const checklist = await Checklist.create(req.body);

    return res.json({ moto });
  } catch (err) {
    return res.status(400).json({ error: "Falha em cadastrar moto." });
  }
});

router.use(authMiddleware);

router.get("/me", async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "Can't get user information" });
  }
});



module.exports = router;
