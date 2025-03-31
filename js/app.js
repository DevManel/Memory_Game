document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    // Liste de fruits pour créer des paires
    let allEmojis = ["🍎", "🍌", "🍒", "🍇", "🍉", "🥝", "🍍", "🍑", "🍓", "🍊", "🍈", "🍋"];
    let cardsArray = [];
    let flippedCards = [];
    let score = 0;
    let timeLeft = 60;
    let timer;

    // Fonction de mélange des cartes
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
        }
        return array; // Retourne le tableau mélangé
    }

    // Sélectionner un sous-ensemble d'emojis pour chaque partie
    function getRandomCards() {
        let selectedEmojis = [];
        
        // Choisir 6 fruits au hasard pour créer des paires
        while (selectedEmojis.length < 6) {
            let randomIndex = Math.floor(Math.random() * allEmojis.length);
            let emoji = allEmojis[randomIndex];
            if (!selectedEmojis.includes(emoji)) {
                selectedEmojis.push(emoji);
            }
        }

        // Dupliquer les fruits pour en faire des paires
        let pairedCards = [...selectedEmojis, ...selectedEmojis];

        // Mélanger les cartes
        return shuffle(pairedCards);
    }

    // Afficher un message au-dessus du plateau
    function showMessage(message) {
        document.getElementById("game-message").innerText = message;
    }

    // Initialiser le jeu
    function startGame() {
        cardsArray = getRandomCards();
        score = 0;
        timeLeft = 60;
        flippedCards = [];
        document.getElementById("score-value").innerText = score;
        document.getElementById("time").innerText = timeLeft;

        displayCards();

        clearInterval(timer);
        timer = setInterval(updateTimer, 1000);

        showMessage(""); // Réinitialise le message au début
    }

    // Afficher les cartes sur le plateau
    function displayCards() {
        let gameBoard = document.getElementById("game-board");
        gameBoard.innerHTML = ""; // Réinitialiser le plateau à chaque début de jeu

        cardsArray.forEach(card => {
            let cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.value = card;
            cardElement.innerText = "?"; // Affichage initial

            cardElement.addEventListener("click", flipCard);

            gameBoard.appendChild(cardElement);
        });
    }

    // Retourner une carte lorsqu'elle est cliquée
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            this.innerText = this.dataset.value;
            this.classList.add("flipped");
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    // Vérifier si les cartes retournées sont identiques
    function checkMatch() {
        let [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            flippedCards = [];
            score++;
            document.getElementById("score-value").innerText = score;

            if (score === cardsArray.length / 2) {
                clearInterval(timer);
                setTimeout(() => showMessage("Bravo, vous avez gagné !"), 300);
            }
        } else {
            setTimeout(() => {
                card1.innerText = "?";
                card2.innerText = "?";
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                flippedCards = [];
            }, 1000);
        }
    }

    // Mettre à jour le timer chaque seconde
    function updateTimer() {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            showMessage("Temps écoulé !");
            document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", flipCard));
        }
    }

    // Démarrer une nouvelle partie lorsque le bouton est cliqué
    document.getElementById("restart").addEventListener("click", startGame);

    startGame();
});
