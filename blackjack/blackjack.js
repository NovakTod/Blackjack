//BLACKJACK

//Globalne promenjive
var dealerSum = 0; // Ukupan zbir karata dilera
var yourSum = 0; // Ukupan zbir igračevih karata

var dealerAceCount  = 0; // Koliko aseva ima diler
var yourAceCount  = 0; // Koliko aseva ima igrač

var hidden; // Dilerova skrivena karta
var deck; // Špil karata

var canHit = true; // dozvoljava igracu da izvuce kartu dokle god je yourSum <= 21

//Pokretanje igre
window.onload = function(){
    buildDeck(); // Kreira špil
    shuffleDeck(); // Meša špil
    startGame(); // Započinje igru
}

//Kreiranje špila
function buildDeck(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"]; // C=Clubs, D=Diamonds, H=Hearts, S=Spades
    deck = [];

    for (let i = 0; i < types.length; i++){ // C D H S
        for (let j = 0; j < values.length; j++){ // A 2 3...
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D (Meša value i type)
        }
    }

}

//Mešanje špila
//Množi nasumični broj sa 52 i dobija se broj između 0 i 51.99... pa ga floor() smanji na 51 (52-out of bounds)
function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){ //(0 <= x < 1)
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 -> (0-51.9999) 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp; //swap (zamena mesta 2 vrednosti) temp cuva vrednost pre pre mešanja
        //Nakon izvlačenja ponovo meša karte u zavisnosti od vrednosti izvučene karte
    }
    console.log(deck); // console log je samo zbog provere na ispitu, da li su karte promešane
}

//Fisher-Yates algoritam za mešanje:

//Za svaku kartu i, bira random poziciju j (0-51)

//Menja mesta kartama i i j

//Početak igre
function startGame(){
    hidden = deck.pop(); // Diler dobija skrivenu kartu. Uzima poslednju kartu iz špila
    dealerSum += getValue(hidden); // Dodaje vrednost skrivene karte
    dealerAceCount += checkAce(hidden); // Proverava da li je as
    // Diler vuče dok ne dobije >= 17
    while (dealerSum < 17){
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    // Igrač dobija 2 karte
    for (let i = 0; i < 2; i++){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    // Dodavanje event listener-a za dugmiće(event listener-funkcija koja čeka klik na elementu koji je povezan sa HTML)
    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}
//Console log je dodat samo zbog provere na ispitu 


//Funkcija hit 
function hit(){
    if(!canHit){  // Ako igrač ne može da vuče, izađi iz funkcije
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    // Provera da li je igrač premašio 21
    if (reduceAce(yourSum, yourAceCount) > 21){ //A, J, K -> 1 + 10 + 10
        canHit = false; // Igrač ne može više da vuče
    }

}


//Funkcija stand 
function stand(){
    // Prilagodjava aseve za oba igrača
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false; // Igrač ne može više da vuče
    // Prikazuje skrivenu kartu dilera
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    // Određivanje pobednika
    let message = "";
    if (yourSum > 21){
        message = "You Lose!";
    }
    else if (dealerSum > 21){
        message = "You Win!";
    }
    // ako i igrac i diler <= 21
    else if (yourSum == dealerSum) {
        message = "It's a Tie!";
    }
    else if (yourSum > dealerSum){
        message = "You Win!";
    }
    else if (yourSum < dealerSum){
        message = "You Lose!";
    }

    // Prikaz rezultata
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

}

// Određivanje vrednosti karte
function getValue(card){
    let data = card.split("-"); // "4-C" -> ["4", "C"] (deli string)
    let value = data[0]; // data [1] se ignoriše jer boja nije bitna 

    if (isNaN(value)){ // Ako nije broj (A, J, Q, K)
        if (value == "A"){
            return 11; // As počinje kao 11
        }
        return 10; // J, Q, K vrede 10
    }

    return parseInt(value); // Brojevi 2-10 (pretvara string u ceo broj)
}

function checkAce(card){
    if (card[0] == "A") { // Proverava samo prvi karakter ("A" iz "A-C")
        return 1;
    }
    return 0;
}

function reduceAce(yourSum, yourAceCount){
    while (yourSum > 21 && yourAceCount > 0){
        yourSum -= 10; // Menja as iz 11 u 1
        yourAceCount -= 1;
    }
    return yourSum;
}