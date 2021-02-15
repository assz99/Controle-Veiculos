const mongoose = require("mongoose");
//Cria o modelo das motos que se armazena no mongoDB
const MotorcyclesSchema = new mongoose.Schema({
    label: {
      type: String,
      unique:true,
      require: true
    },
    value: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    }
  },{collection:'motorcycles'}
  );

  mongoose.model("Motorcycles", MotorcyclesSchema);