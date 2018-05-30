var snakeGame,
    snake,
    apple;

// Prototype de jeu
function SnakeGame(canvasWidth, canvasHeight, delay, blockSize) {
    "use strict";
    
    // Création d'un canevas
    this.canvas = document.createElement("canvas");
    // Largeur du canevas
    this.canvas.width = canvasWidth;
    // Hauteur du canevas
    this.canvas.height = canvasHeight;
    // Bordures du canevas
    this.canvas.style.border = "30px solid #795C94";
    // Centrer le canevas sur la page
    this.canvas.style.margin = "50px auto";
    this.canvas.style.display = "block";
    // Modification de la couleur de fond
    this.canvas.style.backgroundColor = "#ddd";
    // Attacher le canevas au body de la page html
    document.body.appendChild(this.canvas);
    // Création du contexte de dessin
    this.ctx = this.canvas.getContext("2d");
    
    
    // Délai de rafraichissement
    this.delay = delay;
    // Dimension d'un bloc
    this.blockSize = blockSize;
    
    // Largeur du canvas en nombre de bloc
    this.widthInBlocks = this.canvas.width / this.blockSize;
    // Hauteur du canvas en nombre de bloc
    this.heightInBlocks = this.canvas.height / this.blockSize;
        
    // Vérifier s'il y a une collision
    this.checkCollision = function () {
        // Initialiser les valeur de collision
        var wallCollision = false,
            snakeCollision = false,
            i = 0,
        // Coordonnées de la tête du serpent
            head = this.snake.body[0],
        // Coordonnées du corps du serpent hors tête
            rest = this.snake.body.slice(1),
        // Coordonnées x et y de la tête du serpent
            snakeX = head[0],
            snakeY = head[1],
        // Coordonnées min et max du Canvas
            minX = 0,
            minY = 0,
            maxX = this.widthInBlocks - 1,
            maxY = this.heightInBlocks - 1,
        // Vérification de collision contre un mur
            isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX,
            isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
        if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
            wallCollision = true;
        }
    // Vérification de collision contre son corps
        for (i; i < rest.length; i += 1) {
            if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                snakeCollision = true;
            }
        }
    // Retour d'une collision si collision contre un mur ou contre son corps
        return wallCollision || snakeCollision;
    };
    
    // Jeu perdu    
    this.gameOver = function () {
        // Sauvegarder les propriétés du contexte
        this.ctx.save();
        // Définition de la police d'affichage
        this.ctx.font = "bold 70px sans-serif";
        // Couleur d'écriture
        this.ctx.fillStyle = "#000";
        // Ornement de l'écriture
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        // Centrer le texte 
        this.ctx.textAlign = "center";
        // Centrer le texte par rapport au centre du chiffre
        this.ctx.textBaseline = "middle";
        // Centrer le texte sur le canevas
        var centreX = this.canvas.width / 2,
            centreY = this.canvas.height / 2;
        // Affichage de "Game Over" avec ornement
        this.ctx.strokeText("Game Over", centreX, centreY - 180);
        this.ctx.fillText("Game Over", centreX, centreY - 180);

        // Modification de la police d'affichage
        this.ctx.font = "bold 30px sans-serif";
        // Affichage de "Appuyer sur la touche Espace pour rejouer"
        this.ctx.strokeText("Appuyer sur la touche Espace pour Rejouer", centreX, centreY - 120);
        this.ctx.fillText("Appuyer sur la touche Espace pour Rejouer", centreX, centreY - 120);
        // Restaurer les propriétés du contexte
        this.ctx.restore();
    };
    
    // Afficher le score
    this.drawScore = function () {
        // Sauvegarder les propriétés du contexte
        this.ctx.save();
        // Définition de la police d'affichage
        this.ctx.font = "bold 200px sans-serif";
        // Couleur d'écriture
        this.ctx.fillStyle = "gray";
        // Centrer le texte 
        this.ctx.textAlign = "center";
        // Centrer le texte par rapport au centre du chiffre
        this.ctx.textBaseline = "middle";
        // Centrer le texte sur le canevas
        var centreX = this.canvas.width / 2,
            centreY = this.canvas.height / 2;
        // Affichage du score
        this.ctx.fillText(this.score.toString(), centreX, centreY);
        // Restaurer les propriétés du contexte
        this.ctx.restore();
    };

    // Création d'une variable instance
    var instance = this,
        
    // Création d'une variable Timeout
        timeout,
    
    // Fonction permettant de rafraichir le canevas
        refreshCanvas = function () {
            // Avancer le serpent
            instance.snake.advance();
            // Si collision : ...
            if (instance.checkCollision()) {
                // Arrêter le jeu
                instance.gameOver();
            // Sinon : ...
            } else {
                // Si le serpent a mangé la pomme : ...
                if (instance.snake.isEatingApple(instance.apple)) {
                    // Modification de la valeur "a mangé une pomme" à true
                    instance.snake.ateApple = true;
                    // Augmenter le score de +1
                    instance.score += 1;
                    // Augmenter la vitesse du serpent
                    instance.delay -= 5;
                    console.log(instance.delay);
                    
                    do {
                        // Dessiner une nouvelle pomme tant qu'elle n'est pas sur le coprs du serpent
                        instance.apple.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);
                    } while (instance.apple.isOnSnake(instance.snake));
                }
                // Supprimer tout le canevas
                instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
                // Couleur rouge pour dessiner dans le canevas
                instance.ctx.fillStyle = "#ff0000";
                // Afficher le score   
                instance.drawScore();
                // Dessiner le serpent
                instance.snake.draw(instance.ctx, instance.blockSize);
                // Dessiner la pomme
                instance.apple.draw(instance.ctx, instance.blockSize);
                // Executer la fonction refreshCanvas toutes les "delay" millisecondes
                timeout = setTimeout(refreshCanvas, instance.delay);
            }
        };
    
    // Initialiser le jeu
    this.init = function (snake, apple) {
        // Définir le serpent du jeu
        this.snake = snake;
        // Définir la pomme du jeu
        this.apple = apple;
        // Définir le score du jeu
        this.score = 0;
        // Remettre le temps à 0
        clearTimeout(timeout);
        // Lancer le rafraichissement du canevas
        refreshCanvas();
    };  
}

// Prototype de serpent
function Snake(body, direction) {
    "use strict";
    
    // Corps du serpent
    this.body = body;
    
    // Corps du serpent
    this.direction = direction;
    
    // Initialisation de la valeur "a mangé une pomme" à false
    this.ateApple = false;
    
    // Dessiner le serpent
    this.draw = function (ctx, blockSize) {
        // Sauvegarder les propriétés du contexte
        ctx.save();
        // Couleur de dessin dans le canevas
        ctx.fillStyle = "#27ae60";
        // Dessiner un rectangle : x, y, largeur, hauteur
        var i = 0,
            x,
            y;
        for (i; i < this.body.length; i += 1) {
            x = this.body[i][0]  * blockSize;
            y = this.body[i][1] * blockSize;
            ctx.fillRect(x, y, blockSize, blockSize);
        }
        // Restaurer les propriétés du contexte
        ctx.restore();
    };
    
    // Faire avancer le serpent
    this.advance = function () {
        // Récupérer la tête du serpent [x, y] : première entrée du corps du serpent
        var nextPosition = this.body[0].slice();
        // Modifier les coordonnées de la tête du serpent en fonction de la direction
        switch (this.direction) {
        case "left":
            nextPosition[0] -= 1;
            break;
        case "right":
            nextPosition[0] += 1;
            break;
        case "up":
            nextPosition[1] -= 1;
            break;
        case "down":
            nextPosition[1] += 1;
            break;
        default:
            throw ("Invalid Direction");
        }
        // Ajouter la nouvelle tête du serpent au serpent initial
        this.body.unshift(nextPosition);
        // Si la pomme n'est pas mangée : ...
        if (!this.ateApple) {
            // Supprimer la queue du serpent
            this.body.pop();
        // Sinon : ...
        } else {
            // Réinitialisation de la valeur "a mangé une pomme" à false
            this.ateApple = false;
        }

    };
    
    // Donner une direction au serpent
    this.setDirection = function (newDirection) {
        var allowedDirections;
        switch (this.direction) {
        // Définition des directions permises
        case "left":
        case "right":
            allowedDirections = ["up", "down"];
            break;
        case "down":
        case "up":
            allowedDirections = ["left", "right"];
            break;
        default:
            throw ("Invalid Direction");
        }
        // Si la direction est permise alors la nouvelle direction est enregistrée
        if (allowedDirections.indexOf(newDirection) > -1) {
            this.direction = newDirection;
        }
    };
    
    // Vérifier si le serpent mange la pomme
    this.isEatingApple = function (appleToEat) {
        var head = this.body[0];
        if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
            return true;
        } else {
            return false;
        }
    };
}

// Protoype de pomme
function Apple(position) {
    "use strict";
    
    // Position de la pomme
    this.position = position;
    
    // Dessiner la pomme
    this.draw = function (ctx, blockSize) {
        // Sauvegarder les propriétés du contexte
        ctx.save();
        // Couleur de dessin dans le canevas
        ctx.fillStyle = "#c0392b";
        // Ouvre le dessin d'un trajet
        ctx.beginPath();
        // Définition du rayon
        var radius = blockSize / 2,
        // Définition des coordonnées du centre de la pomme
            x = this.position[0] * blockSize + radius,
            y = this.position[1] * blockSize + radius;
        // Dessiner la pomme (x, y, rayon, 0, longueur de l'arc : 2*Pi, sens horaire) 
        ctx.arc(x, y, radius,  0, Math.PI * 2, true);
        // Ferme le dessin d'un trajet
        ctx.closePath();
        // Forme pleine en remplissant la zone de contenu du trajet
        ctx.fill();
        // Restaurer les propriétés du contexte
        ctx.restore();
    };
    
    //Donner une nouvelle position à la pomme
    this.setNewPosition = function (widthInBlocks, heightInBlocks) {
        var newX,
            newY;
        newX = Math.round(Math.random() * (widthInBlocks - 1));
        newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
    };
    
    // Vérifier que la nouvelle position de pomme n'est pas sur le serpent
    this.isOnSnake = function (snakeToCheck) {
        var isOnSnake = false,
            i = 0;
        for (i; i < snakeToCheck.body.length; i += 1) {
            if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                isOnSnake = true;
            }
        }
        return isOnSnake;
    };
}

// Définition des touches
document.onkeydown = function handleKeyDown(e) {
    "use strict";
    
    var key = e.keyCode,
        newDirection;
    
    // Donne une direction en fonction de la touche appuyée
    switch (key) {
    case 37:
        newDirection = "left";
        break;
    case 38:
        newDirection = "up";
        break;
    case 39:
        newDirection = "right";
        break;
    case 40:
        newDirection = "down";
        break;
    case 32:
        // Définir un serpent
        snake = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        // Définir une pomme
        apple = new Apple([10, 10]);
        // Initialisation du jeu
        snakeGame.init(snake, apple);
        return;
    default:
        return;
    
    }
    snakeGame.snake.setDirection(newDirection);
};

// Lancement du jeu
window.onload = function () {
    "use strict";
    
    // Créer un jeu
    snakeGame = new SnakeGame(900, 600, 100, 30);
    
    // Définir un serpent
    snake = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    
    // Définir une pomme
    apple = new Apple([10, 10]);
    
    // Initialiser le jeu
    snakeGame.init(snake, apple);
};