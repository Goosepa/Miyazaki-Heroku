const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/buttons/*/*.js`)).map(async buttonFile => {
        const button = require(buttonFile);
        
        if (!button.name) return console.log(`----------\n Bouton non-chargé : erreur de typographie. \n Fichier -> ${buttonFile}\n ----------`)

        client.buttons.set(button.name, button);
    });
};
