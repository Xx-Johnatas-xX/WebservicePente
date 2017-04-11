var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();
const uuidV4 = require('uuid/v4');
uuidV4();

var PION_VIDE = 0;
var PION_BLANC = 1;
var PION_NOIR  = 2;

var joueur1 = null;
var joueur2 = null;
var players = {};
var dernierCoupX = -1;
var dernierCoupY = -1;
var message = "";
var timeout = null;

var Plateau = {
	pions: [],
	playerTurn: 1,
	prolongation: false,
	finDePartie: false,
	tours: 0
};

function checkPlateau() {
	function checkAt(x, y, pion) {
		if(x < 0 || x > 18 || y < 0 || y > 18) {
			return pion;
		}
		else {
			return Plateau.pions[x][y];
		}
	}
	
	function recursif(x, y, pion, v, direction) {
		var cinqAligne = (v == 5);
		
		if((direction == 1 || typeof direction == "undefined") && checkAt(x-1, y-1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x-1, y-1, pion, v+1, 1);
		}
		
		if((direction == 2 || typeof direction == "undefined") && checkAt(x, y-1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x, y-1, pion, v+1, 2);
		}
		
		if((direction == 3 || typeof direction == "undefined") && checkAt(x-1, y, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x-1, y, pion, v+1, 3);
		}
		
		if((direction == 4 || typeof direction == "undefined") && checkAt(x-1, y+1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x-1, y+1, pion, v+1, 4);
		}
		
		if((direction == 5 || typeof direction == "undefined") && checkAt(x+1, y-1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x+1, y-1, pion, v+1, 5);
		}
		
		if((direction == 6 || typeof direction == "undefined") && checkAt(x+1, y+1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x+1, y+1, pion, v+1, 6);
		}
		
		if((direction == 7 || typeof direction == "undefined") && checkAt(x, y+1, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x, y+1, pion, v+1, 7);
		}
		
		if((direction == 8 || typeof direction == "undefined") && checkAt(x+1, y, PION_VIDE) == pion) {
			cinqAligne = cinqAligne || recursif(x+1, y, pion, v+1, 8);
		}
		
		return cinqAligne;
	}
	
	var x = dernierCoupX;
	var y = dernierCoupY;
	var pion = Plateau.pions[x][y];

	if(checkAt(x-1,y-1, pion) != pion)
		if(checkAt(x-2,y-2, pion) != pion)
			if(checkAt(x-3,y-3, PION_VIDE) == pion)
			{
				Plateau.pions[x-1][y-1] = PION_VIDE;
				Plateau.pions[x-2][y-2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
			
	if(checkAt(x-1,y, pion) != pion)
		if(checkAt(x-2,y, pion) != pion)
			if(checkAt(x-3,y, PION_VIDE) == pion)
			{
				Plateau.pions[x-1][y] = PION_VIDE;
				Plateau.pions[x-2][y] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
			
	if(checkAt(x,y-1, pion) != pion)
		if(checkAt(x,y-2, pion) != pion)
			if(checkAt(x,y-3, PION_VIDE) == pion)
			{
				Plateau.pions[x][y-1] = PION_VIDE;
				Plateau.pions[x][y-2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
		
	if(checkAt(x+1,y-1, pion) != pion)	
		if(checkAt(x+2,y-2, pion) != pion)
			if(checkAt(x+3,y-3, PION_VIDE) == pion)
			{
				Plateau.pions[x+1][y-1] = PION_VIDE;
				Plateau.pions[x+2][y-2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
			
	if(checkAt(x-1,y+1, pion) != pion)
		if(checkAt(x-2,y+2, pion) != pion)
			if(checkAt(x-3,y+3, PION_VIDE) == pion)
			{
				Plateau.pions[x-1][y+1] = PION_VIDE;
				Plateau.pions[x-2][y+2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
	
	if(checkAt(x+1,y+1, pion) != pion)
		if(checkAt(x+2,y+2, pion) != pion)
			if(checkAt(x+3,y+3, PION_VIDE) == pion)
			{
				Plateau.pions[x+1][y+1] = PION_VIDE;
				Plateau.pions[x+2][y+2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
			
	if(checkAt(x+1,y, pion) != pion)
		if(checkAt(x+2,y, pion) != pion)
			if(checkAt(x+3,y, PION_VIDE) == pion)
			{
				Plateau.pions[x+1][y] = PION_VIDE;
				Plateau.pions[x+2][y] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
			
	if(checkAt(x,y+1, pion) != pion)
		if(checkAt(x,y+2, pion) != pion)
			if(checkAt(x,y+3, PION_VIDE) == pion)
			{
				Plateau.pions[x][y+1] = PION_VIDE;
				Plateau.pions[x][y+2] = PION_VIDE;
				if(Plateau.playerTurn == 1)
					joueur2.tenaille++;
				else
					joueur1.tenaille++;
			}
		

	if(joueur1.tenaille == 5)
	{
		Plateau.finDePartie = true;
		message = "Le joueur 1 a 5 tenailles";
	}
	else if(joueur2.tenaille == 5)
	{
		Plateau.finDePartie = true;
		message = "Le joueur 2 a 5 tenailles";
	}
		
	for(var i = 0; i <= 18; ++i) {
		for(var j = 0; j <= 18; ++j) {
			if(Plateau.pions[i][j] != PION_VIDE) {
				if(recursif(i, j, Plateau.pions[i][j], 1, i, j)) {
					message = "Le joueur " + (Plateau.playerTurn == 1 ? 2 : 1) + " a gagné par pente";
					Plateau.finDePartie = true;
				}
			}
		}
	}
}

function prolongation() {
	Plateau.prolongation = true;
	if(joueur1.tenaille != joueur2.tenaille) {
		if(joueur1.tenaille > joueur2.tenaille) {
			message = "Le joueur 1 a gagné (" + joueur1.tenaille + " tenaille(s) en prolongation";
			Plateau.finDePartie = true;
		}
		else {
			message = "Le joueur 2 a gagné (" + joueur2.tenaille + " tenaille(s) en prolongation";
			Plateau.finDePartie = true;
		}
	}
}

function initPlateau() {
	Plateau.pions = [];
	for(var i = 0; i <= 18; ++i) {
		Plateau.pions[i] = [];
		for(var j = 0; j <= 18; j++) {
			Plateau.pions[i][j] = PION_VIDE;
		}
	}
}

function playerTakeTooLongTime() {
	message = "Le joueur " + Plateau.playerTurn + " n'a pas répondu dans le délai imparti";
	Plateau.finDePartie = true;
}

function createPlayer(playerName_p, idPlayer_p) {
	return {
		playerName: playerName_p,
		idPlayer: idPlayer_p,
		tenaille: 0
	};
}

router.get('/connect/:joueurName', function(req, res) {
	if(joueur1 != null && joueur2 != null) {
		res.status(401);
		return;
	}
	var playerName = req.params.joueurName;
	var idPlayer = uuidV4();
    res.json({
		idJoueur: idPlayer,
		code: 200,
		nomJoueur: playerName,
		numJoueur: (joueur1 == null ? 1 : 2)
	});
	
	if(joueur1 == null) {
		joueur1 = createPlayer(playerName, idPlayer);
		players[idPlayer] = joueur1;
	}
		
	if(joueur2 == null) {
		joueur2 = createPlayer(playerName, idPlayer);
		players[idPlayer] = joueur2;
		setTimeout(prolongation, 10*60*1000);
	}
});

router.get('/play/:x/:y/:idJoueur', function(req, res) {
	var idJoueur = req.params.idJoueur;
	var x = req.params.x;
	var y = req.params.y;
	
	if(joueur1 == null || joueur2 == null) {
		res.status(503);
		return;
	}
	else if(!idJoueur in players) {
		res.status(401);
		return;
	}
	else if(!(joueur1.idPlayer == idJoueur && Plateau.playerTurn == 1) || (joueur2.idPlayer == idJoueur && Plateau.playerTurn == 2)) {
		res.status(401);
		return;
	}
	else if(Plateau.tours == 0 && (x!= 9 || y != 9)) {
		res.status(406);
		return;
	}
	else if(Plateau.pions[x][y] != PION_VIDE) {
		res.status(406);
		return;
	}

    res.json({
		code: 200
	});
	
	Plateau.pions[x][y] = (Plateau.playerTurn == 1) ? PION_BLANC : PION_NOIR;
	Plateau.playerTurn = (Plateau.playerTurn == 1) ? PION_NOIR : PION_BLANC;
	clearTimeout(timeout);
	
	Plateau.tours++;
	dernierCoupX = x;
	dernierCoupY = Y;
	checkPlateau();
	timeout = setTimeout(playerTakeTooLongTime, 10000);
});

router.get('/turn/:idJoueur', function(req, res) {
	if(joueur1 == null || joueur2 == null) {
		res.status(503);
		return;
	}
	
	var idJoueur = req.params.idJoueur;
	if(!idJoueur in players) {
		res.status(401);
		return;
	}

    res.json({
		status: ((joueur1.idPlayer == idJoueur && Plateau.playerTurn == 1) || (joueur2.idPlayer == idJoueur && Plateau.playerTurn == 2)) ? 1 : 0,
		tableau: Plateau.pions,
		nbTenaillesJ1: joueur1.tenaille,
		nbTenaillesJ2: joueur2.tenaille,
		dernierCoupX: dernierCoupX,
		dernierCoupY: dernierCoupY,
		prolongation: Plateau.prolongation,
		finPartie: Plateau.finDePartie,
		detailFinPartie: message,
		numTour: Plateau.tours,
		code: 200
	});
});



initPlateau();
app.use('/', router);
app.listen(80);
