const mongoose = require("mongoose");

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