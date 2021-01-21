const mongoose = require("mongoose");

const checkListSchema = new mongoose.Schema({
    user: {
      type: String,
      require: true
    },
    motoSelected: {
      type: String,
      required: true
    },
    kmInicial: {
        type: Number,
        required: true
    },
    kmFinal: {
        type: Number,
        required: true
    },
    problems:{
        type: String
    },
    annotation:{
        type:String
    },
    horarioInicial:{
        type: Date,
        required:true
    },
    horarioFinal: {
        type: Date,
        default: Date.now
      },
    capturedImage:{
      type: String,
      
    }
  },{collection:'checkList'}
  );

  mongoose.model("CheckList", checkListSchema);