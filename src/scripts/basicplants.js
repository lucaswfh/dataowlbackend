function setbasicplants(PlantType) {
    const plants = [
        "Pasto cuaresma (Digitaria sanguinalis)",
        "Capín (Echinochloa grusgalli)",
        "Pata de ganso (Eleusine indica)",
        "Rama negra (Conyza bonariensis)",
        "Yuyo colorado (Amaranthus hybridus)",
        "Malva cimarrona (Anoda cristata)",
        "Quinoa blanca (Chenopodium album)" ];

    plants.forEach(p => {
        const plant = new PlantType({ 'plantType': p });
        plant.save((err) => { });
    });
}

module.exports = setbasicplants;