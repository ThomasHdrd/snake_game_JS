window.onload = function(){ //lorsque la fenetre se lance 
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 150; //en millisecondes
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize; //largeur / taille du bloc
    var heightInBlocks = canvasHeight/blockSize; //hauteur / taille du bloc
    var score;
    var timeout;

    //execute la fonction
    init();

    //declarer les fonctions
    function init() {
    
    var canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray"; 

    //CSS
    canvas.style.margin = "50px auto"; //appliquer un style CSS
    canvas.style.display = "block"; //centrer sur la page
    canvas.style.backgroundColor = "#ddd"; //couleur du fond

    document.body.appendChild(canvas); //attacher le canvas a la page html
    ctx = canvas.getContext('2d'); //dessiner dans le canvas
    snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");//corps du serpent
    applee = new Apple([10, 10]); //creation de la pomme
    score = 0;
    refreshCanvas(); }

    function refreshCanvas(){

        snakee.advance();
        if(snakee.checkCollision()) //si le serpent se prend une collision
            {
                gameOver();//alors game over
            } else { //le jeu continue
                if(snakee.isEatingApple(applee)){ //s'il mange une pomme
                    score++; //augmente le score de 1 lorsque le serpent mange une pomme
                    snakee.ateApple = true;
                    do {
                        applee.setNewPosition();//le serpent a mangé la pomme donc la déplacer a un nouvel endroit
                    } while(applee.isOnSnake(snakee)) //est ce que la pomme est sur le serpent
                 }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight); 
                drawScore();
                snakee.draw();
                applee.draw();
                timeout = setTimeout(refreshCanvas, delay); //exécute moi une certaine fonction à chaque fois qu'un certain délai est passé.
        }
}

function gameOver() {
    ctx.save(); //sauvegarde la position
        //CSS
    ctx.font = "bold 70px sans-serif"; //style de l ecriture du game over
    ctx.fillStyle = "black"; //couleur de l ecriture
    ctx.textAlign = "center"; //aligner le texte au centre
    ctx.textBaseline = "middle"; //affiche le texte au milieu 
    ctx.strokeStyle = "white"; //bordure a l ecriture
    ctx.lineWidth = 5; //epaisseur de la bordure
    var centreX = canvasWidth / 2; //calculer le centre en fonction de la large
    var centreY = canvasHeight / 2; //calculer le centre en fonction de la hauteur
    ctx.strokeText("Game Over", centreX, centreY - 180); //affichage a l ecran du game over
    ctx.fillText("Game Over", centreX, centreY - 180); //elle ecrit a l'ecran suivi des coordonnees voulu d'affichage

    ctx.font = "bold 30px sans-serif"; //style de l ecriture du rejouer
    ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120); //elle ecrit a l'ecran suivi des coordonnees voulu d'affichage
    ctx.fillText("Appuyer sur la touche espace pour rejouer",  centreX, centreY - 120);//explique la marche a suivre pour recommencer une partie suivi des coordonnees voulu d'affichage
    
    ctx.restore(); //restore a la position initiale
}

function restart(){ //faire un nouveau serpent 
    snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout); //pour que le serpent aille a la meme vitesse quand j'appuie sur espace
    refreshCanvas();  
}

function drawScore(){ //afficher le score
    ctx.save(); //sauvegarde la position
    
    //CSS
    ctx.font = "bold 200px sans-serif"; //style de l ecriture
    ctx.fillStyle = "gray"; //couleur de l ecriture
    ctx.textAlign = "center"; //aligner le texte au centre
    ctx.textBaseline = "middle"; //affiche le texte au milieu 
    var centreX = canvasWidth / 2; //calculer le centre en fonction de la large
    var centreY = canvasHeight / 2; //calculer le centre en fonction de la hauteur

    ctx.fillText(score.toString(), centreX, canvasHeight - centreY); //elle ecrit le score a l'ecran suivi des coordonnees voulu d'affichage
    ctx.restore(); //restore a la position initiale 
}

function drawBlock(ctx, position){
    var x = position[0] * blockSize; //nombre de pixel: multiplie la position par la taille des blocks
    var y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
}

//creation du serpent
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false; //si le serpent a manger un pomme
        this.draw = function(){ //permet de dessiner le corps sur serpent a lecran
            ctx.save(); //sauver le contexte
            ctx.fillStyle = "red";
            for(var i=0; i < this.body.length; i++){ //corps du serpent = petit bloc. chaque bloc dans un array
                drawBlock(ctx, this.body[i]); //dessiner un bloc
            }
            ctx.restore();
        };

        this.advance= function(){ //faire avancer le serpent de case en case
        
            var nextPosition = this.body[0].slice(); //slice = copier l'element
            switch(this.direction){ //direction du serpent
                case "left": nextPosition[0] -= 1; //faire reculer de 1 sur l'axe x 
                    break;
                case "right": nextPosition[0] += 1; //faire avancer de 1 sur l'axe x 
                    break;
                case "down": nextPosition[1] += 1; //faire avancer de 1 sur l'axe y
                    break;
                case "up": nextPosition[1] -= 1; //faire reculer de 1 sur l'axe y
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition); //ajouter un block
            if(!this.ateApple) //si le serpent a mangé une pomme, je ne veux pas faire la fonction pop (via le "!"). ceci n'enlevera pas le dernier bloc
            this.body.pop(); //suprrimer la derniere position du serpent
            else
                this.ateApple = false; //eteindre la propriété ateApple donc enlevera un bloc
        };
        this.setDirection = function(newDirection){
            var allowedDirections; //directions autorisé
            switch(this.direction){
                case "left": 
                case "right": allowedDirections = ["up", "down"]; //si le serpent va en a gauche ou droite alors changer de direction uniquement en haut ou bas
                    break;
                case "down": 
                case "up": allowedDirections = ["left", "right"]; //si le serpent va en a gauche ou droite alors changer de direction uniquement en haut ou bas
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1){ //demander si ma direction est permise
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){ //si le serpent sort du canvas
            var wallCollision = false; //si le serpent se prend le mur
            var snakeCollision = false; //si le serpent se prend lui même
            var head = this.body[0]; //verifier si la tete du serpent se prend un mur ou lui meme
            var rest = this.body.slice(1); //le reste du corps suit
            var snakeX = head[0]; //detailler le x de la tete
            var snakeY = head[1]; //detailler le y de la tete
            //si les coordonnes de la tete du serpent = coordonnees du bloc hors du canvas 
            var minX = 0; 
            var minY = 0;
            var maxX = widthInBlocks -1; //nombre de bloc - 1
            var maxY = heightInBlocks -1; //nombre de bloc - 1
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; //minX = mur horizontal de gauche OU minY = mur horizontal de droite
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; //minX = mur vertical du haut OU minY = mur vertical du bas
            
            //verification des murs
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){ //si l'un des 2 n'est pas dans le mur de collision
                wallCollision = true; //si l'un des 2 est vrai
            }

            //verification que le serpent ne se passent pas dessus
            for(var i = 0; i< rest.length; i++) {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1]) //si la tete et le corps on le meme x et le meme y 
                    { snakeCollision = true; //alors le serpent respawn
                    }
                }

                return wallCollision || snakeCollision; //mur collision ou snake collision = faux
        };
        this.isEatingApple = function(appleToEat){ //si le serpent mange une pomme
        
            var head = this.body[0]; 
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){ //si le x et y de la tete = au x et y de la pomme
                return true; //alors le serpent mange
            }
            else 
                return false; //sinon rien ne se passe
        }
    }

    function Apple(position){ //creer la pomme du serpent
        this.position = position;
        this.draw = function()
        {
            ctx.save(); //enregistre les parametres du canvas
            ctx.fillStyle = "green";
            ctx.beginPath();
            var radius = blockSize/2; //taille block / 2
            var x = this.position[0]*blockSize + radius; //son x * la taille du bloc + le rayon
            var y = this.position[1]*blockSize + radius; //son y * la taille du bloc + le rayon
            ctx.arc(x,y, radius, 0, Math.PI*2, true); //dessiner un cercle
            ctx.fill();//remplir le cercle
            ctx.restore(); //restore les anciens parametres du canvas
        }; 
        this.setNewPosition = function(){ //nouvelle position de spawn pour la pomme
        
            var newX = Math.round(Math.random() * (widthInBlocks -1));//random = arrondi d un chiffre. la faire de facon aleatoire dans le canvas sur l'axe X. largeur du bloc - 1
            var newY = Math.round(Math.random() * (heightInBlocks -1));//random = arrondi d un chiffre. la faire de facon aleatoire dans le canvas sur l'axe Y. largeur du bloc - 1
            this.position = [newX, newY]; //donner cette new position a la pomme
        }
        this.isOnSnake = function(snakeToCheck){ //si la pomme spawn sur le serpent
        
            var isOnSnake = false;

            for(var i = 0; i< snakeToCheck.body.length; i++){ //passer sur chacun des blocs du serpent
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){ //passage bloc par bloc et savoir si le X et Y de la pomme est sur l'un des blocs X et Y du serpent
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e){ //quand l'user appui sur la touche du clavier
    
        var key = e.keyCode; //code de la touche appuyer
        var newDirection; //prendre la direction en fonction de la touche appuyer
        switch(key){
            case 37: newDirection = "left"; //fleche de gauche
                break;
            case 38: newDirection = "up" //fleche du haut
                break;
            case 39 : newDirection = "right" //fleche de droite
                break;
            case 40 : newDirection = "down" //fleche du bas
                break;
            case 32: //touche espace pour recommencer le jeu
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}