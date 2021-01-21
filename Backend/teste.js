const teste = {
    zero:0,um:1,dois:null,tres:3,quatro:4
}

console.log(teste)

function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === false) {
        delete obj[propName];
      }
    }
    return obj
  }
  clean(teste)
  console.log(teste)