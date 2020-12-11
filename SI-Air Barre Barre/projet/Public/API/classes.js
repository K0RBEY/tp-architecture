/* ======================================================= */
/* ------------ < Initialisation des listes > ------------ */
/* ======================================================= */

/*! \class Aeorport 
* \brief classe d'un aeroport
* \param nom: nom de la ville
* \param code: acronyme aeoroport de la ville
* \see displayAeroport affiche le nom et le code 
*/
class AEROPORT{
	constructor(nom,code){
		this.nom = nom;
		this.code = code;
	}

	displayAeroport(){
		console.log("Ville: " + this.nom + " Aeroport: "+this.code);
	}
}


/*! \class Voyage
* \param depart: aeoroport de depart
* \param destination: aeoroport d'arrive
* \param prix: prix du voyage
*/
class VOYAGE{
	constructor(depart,destination,prix){
		this.depart = depart;
		this.destination = destination;
		this.prix = prix;
	}

	displayVoyages(i,user=false){
		let depart = this.depart.nom + " " + this.depart.code;
		let destination = this.destination.nom + " " + this.destination.code;
		let prix = this.prix  + "€";
		let input;

		if(user){
			input = "<input class=\"button_tab\" type=\"button\" onClick=\"annuler("+i+")\" value=\"Annuler\">";
		}else{
			input = "<input  class=\"button_tab\" type=\"button\" onClick=\"reserver("+i+")\" value=\"Réserver\">";
		}

		return "<tr>\
					<td class=\"vols\">\
						<h3>"+ depart +" - "+ destination +"</h3>\
					</td>\
					<td class=\"prix\">\
						<span>"+prix+"</span>\
					</td>\
					<td class=\"in_action\">\
						"+input+"\
					</td>\
				</tr>";
	}
}

/*! \class user
* \param nom,prenom,mail de l'utilisateur 
* \param voyages: Tableau de ses voyages reservé
*/
class USER {
	constructor(nom,prenom,mail,voyages){
		this.nom = nom;
		this.prenom = prenom;
		this.mail = mail;

		if(Array.isArray(voyages) && voyages != 'undefined'){
			this.voyages = new Array();
			if(voyages.length > 0){
				for (var i = 0; i < voyages.length; i++) {
					this.voyages.push(new VOYAGE(voyages[i].depart,voyages[i].destination,voyages[i].prix));
				}
			}
		}else{
			this.voyages = new 	Array();
		}
	}

	reservation(voyage){
		this.voyages.push(voyage);
	}

	annulation(id_voyage){
		this.voyages.splice(id_voyage, 1);
	}

	displayVoyagesUser(list){
		if(this.voyages.length == 0){
			list.innerHTML = "\
			<tr>\
				<td colspan='3' style='text-align:center'>Aucun voyages de réservé.</td>\
			</tr>";
		}else{
			for (var i = 0; i < this.voyages.length; i++) {
				list.innerHTML += this.voyages[i].displayVoyages(i,true);
			}
		}
	}

}


/*! \class ListTrip
* \brief Class comportant la liste des voyages disponibles
* Permet d'obtenir une liste aléatoirement effectué par le serveur
*/
class ListTrip{
	constructor(ID_div,listAeroports){
		this.ID_div = ID_div;
		this.listAeroports = listAeroports;
		this.Voyages = new Array();
	}

	async loadVoyages(){
		console.log('loading trips...');
		var res = await axiosLoad('Voyages');

		let depart,destination,prix;

		for(var i = 0 ; i < res.data.length; i++){
			depart = this.listAeroports[res.data[i][0]];
			destination = this.listAeroports[res.data[i][1]];
			prix = res.data[i][2];

			this.Voyages.push(new VOYAGE(depart,destination,prix));
		}

		console.log('update trips');
	}

	displayListTrip(){
		var list = document.getElementById(this.ID_div);

		list.innerHTML = "";
		for (var i = 0; i < this.Voyages.length; i++) {
			list.innerHTML += this.Voyages[i].displayVoyages(i,false);
		}
	}

	getOneVoyage(id){
		if(id < this.Voyages.length)
			return this.Voyages[id];
		else
			return false;
	}
}


/*! \class ListAirport
* \brief Class comportant la liste des aeroprots disponibles
* Les aeroports son intialisé dans un fichier database.json
* Ils sont récupérés grace à l'ajax
*/
class ListAirport{
	constructor(nameDatabase){
		this.listAeroports = new Array();
		this.nameDatabase = nameDatabase;
	}

	async loadAirports(){
		console.log('loading airports...');
		var res = await axiosLoad(this.nameDatabase);
		for (var i = 0; i < res.data.length; i++) {
		 	this.listAeroports.push(new AEROPORT(res.data[i].nom,res.data[i].code));
		}
		console.log('update airports');
	}

}


/* ======================================================= */
/* ----------------- < Function Utiles > ----------------- */
/* ======================================================= */

/*! \brief Function to request serveur with get method 
* This function use promise, it's to wait the response of request
* \param nameDatabase it's url of server recovered by app.get in nodejs
*/
function axiosLoad(nameDatabase){
	return new Promise(resolve => {
		try{
			const res = axios.get(nameDatabase+"/");
			resolve(res);
		}catch(e){
			console.log(e);
		}
	});
}

/*! \brief Function to request serveur with get method 
* This function use promise, it's to wait the response of request
* \param url of server recovered by app.get in nodejs
* \param data send to server
*/
function axiosSend(url,data){
	if(!data){
		console.log("No data");
		return false;
	}

	return new Promise(resolve => {
		try{
			const res = axios.post(url+'/',{
				data:data
			});

			resolve(res);
		}catch(e){
			console.log(e);
		}
	});
}

/*! \brief disabled a button */
function desactiverButton(className){	
	var button_tab = document.getElementsByClassName(className);
	for (var i = 0; i < button_tab.length; i++) {
		button_tab[i].disabled='disabled';
	}
}


/*! \brief function to save before exit page */
if(sessionStorage.getItem('userCurrent')){
	window.addEventListener("beforeunload", async function(event){

		try{
			var res = await axiosSend("../saveUser",JSON.stringify(user));
			if(!res.data){
				Alert('Une erreur est survenue');
			}
		}catch(e){
			event.preventDefault();
			console.log(e);
		}

		return null;
	});
}

