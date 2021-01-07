const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const User = mongoose.model("User");
const Motorcycles = mongoose.model("Motorcycles");

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

router.use(authMiddleware);

router.get("/motos", async(req,res) =>{
try{
const motos = await Motorcycles.find();

return res.json({ motos });
  
} catch (err) {
    return res.status(400).json({ error: "Can't get user information" });
  }
});


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
