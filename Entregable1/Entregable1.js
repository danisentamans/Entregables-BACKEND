const http = require("http");
const fs = require("fs");

const fetchPokemonData = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./pokedex.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const handleRequest = async (req, res) => {
  const pokemonData = await fetchPokemonData();
  const requestParam = decodeURI(req.url.substring(1));

  let pokemonInfo;

  // Comprobamos si el parámetro es numérico (ID)
  const isNumeric = !isNaN(requestParam);

  if (isNumeric) {
    // Buscamos por el ID
    pokemonInfo = pokemonData.find(
      (pokemon) => pokemon.id === parseInt(requestParam)
    );
  } else {
    // Buscamos por el nombre en cualquier idioma
    pokemonInfo = pokemonData.find((pokemon) => {
      const names = Object.values(pokemon.name);
      return names.some(
        (name) => name.toLowerCase() === requestParam.toLowerCase()
      );
    });
  }

  let response;

  // Si encontramos información del pokémon, la mostraremos con un json
  if (pokemonInfo) {
    // Si lo buscamos por ID, para saber que es correcto mostramos el nombre
    if (isNumeric) {
      response = {
        "Nombre del Pokemon 🆎": pokemonInfo.name.english,
        "Tipo 🔥💧🌿": pokemonInfo.type,
        "Vida (HP) 🧬": pokemonInfo.base.HP,
        "Ataque 💪": pokemonInfo.base.Attack,
        "Defensa 🛡️": pokemonInfo.base.Defense,
        "Velocidad de ataque 🫨": pokemonInfo.base["Sp. Attack"],
        "Velocidad de defensa 😷": pokemonInfo.base["Sp. Defense"],
        "Velocidad 🚄": pokemonInfo.base.Speed,
      };
    } else {
      // Si lo buscamos por nombre, mostramos el ID
      response = {
        "Id del pokemon 🅾️": pokemonInfo.id,
        "Tipo 🔥💧🌿": pokemonInfo.type,
        "Vida (HP) 🧬": pokemonInfo.base.HP,
        "Ataque 💪": pokemonInfo.base.Attack,
        "Defensa 🛡️": pokemonInfo.base.Defense,
        "Velocidad de ataque 🫨": pokemonInfo.base["Sp. Attack"],
        "Velocidad de defensa 😷": pokemonInfo.base["Sp. Defense"],
        "Velocidad 🚄": pokemonInfo.base.Speed,
      };
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    if (isNumeric) {
      res.end(
        `Pokemon con el id ${requestParam} no existe, por favor, revise que su id es correcto`
      );
    } else {
      res.end(
        `Pokemon con el nombre ${requestParam} no existe, por favor, revise que se ha escrito correctamente`
      );
    }
  }
};

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log("Escuchando en el puerto 3000");
});
