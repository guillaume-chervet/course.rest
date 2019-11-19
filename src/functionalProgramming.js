class Database {
    getPrixFromDb(id){
        if(id == "chaussure"){
            throw "database not available"
        }
        return 13;
    }
}

class Tarification {
    constructor(database){
        this.database = database;
    }
    getPrix(id) {
        let prixDb = 0;
        try {
            prixDb= this.database.getPrixFromDb(id);
        } catch (e) {
            return 30;
        }
        return prixDb + 6; 
    }
}

var tarifi = new Tarification(new Database());

console.log(tarifi.getPrix("poupée") === 19 );
console.log(tarifi.getPrix("chaussure") === 30 );

const getPrix = (getPrixFromDb) => (id) => {
    let prixDb = getPrixFromDb(id);
    return prixDb + 6; 
}

const manageError = (getPrixFromDb) => {
    try {
        return getPrixFromDb();
    } catch (e) {
        return 30;
    }
}

console.log(getPrix(manageError(new Database().getPrixFromDb))("poupée") === 19 );
console.log(getPrix(manageError(new Database().getPrixFromDb))("chaussure") === 30 );





