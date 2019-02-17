/** 
 * Set global variables and constants which we will use further in our script
 * Giphs taken from https://giphy.com/victoriajustice/  
 */
const card = document.querySelectorAll(".card");
const cards = [...card];
let openCards = [];
const giph = ['3ohhwnns2kIeSHQxQk', 'l1J9FJzyrQwYZvo9q', '3ohhwpEkAfzIL6gkSs', 'l1J9GDblbfPsJC3iU'];
const giphs = [...giph];
const timer = document.querySelector('#timer');
let interval;
let timerStarted;
const body = document.querySelector('body');
const stats = document.querySelector('#stats');

/** 
 * On window load initiate the game by shuffling all cards and add EventListeners to all cards 
 */
window.onload = function() {
    // Start the game by shuffling
    startGame();

    // Add EventListener to restart button
    const startButton = document.querySelector("#restart-game");
    startButton.addEventListener('click', function(e){
        e.preventDefault();
        startGame();
    });

    // Now add a greeting popup message
    Swal({
        type: 'info',
        imageUrl: 'https://media.giphy.com/media/3ohhwLTZWnCYKwkBnW/giphy.gif',
        title: 'Well hello there hun',
        html: 'Give me your name and make me proud!',
        input: 'text',
        inputValidator: (value) => {
            return !value && 'Please hun, give me your name.'
        },
        confirmButtonText: 'Oh I will',
        footer: 'Let us play',
    }).then((result) => {
        if(result.value){
            var p = document.createElement('p');
            p.insertAdjacentHTML('beforeend', 'Welcome <strong>' + result.value + '</strong>, your stats will be listed here hun, may the force be with you.');
            stats.appendChild(p);
            body.classList.add('stats-visible');
        }
    });
};

/** 
 *  Start the game by shuffling and initiating start fase
 */
function startGame(){
    // Start by resetting the timer
    timerStarted = false;
    timer.innerHTML = '0 min 0 sec';
    clearInterval(interval);

    // Remove classes that we do not need (Used when restarting game goes in affect)
    for(var i = 0; i < cards.length; i++){
        cards[i].classList.remove('disabled', 'displayed', 'match');
    }

    // Shuffle cards
    const shuffledCards = shuffleCards(cards);
    const deck = document.querySelector('#cards-container');
    [...shuffledCards].forEach(function(item){
        deck.appendChild(item);
    });

    // Add EventListener to the cards
    for(var i = 0; i < cards.length; i++){
        cards[i].addEventListener('click', displayCard);
    }
}

/** 
 * Shuffle all cards so they are random positioned and return
 * (Fisher-Yates (aka Knuth) Shuffle)
 */
function shuffleCards(cards){
    var currentIndex = cards.length, temporaryValue, randomIndex;

    while(currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

    return cards;
}

/** 
 * Display a card when clicked and perform checks
 */
function displayCard(){
    // Add the clicked card to an array for checking matching later
    openCards.push(this);

    // Add classes to the clicked card
    this.classList.toggle('displayed'); 

    // Check the open cards to see if we have a match or not
    checkOpenCards();
}

/**  
 * Check opened cards added to openCards list and check if cards are match or not
 */
function checkOpenCards(){
    const len = openCards.length;
    
    // Do all the checking when we have 2 cards opened and start timer
    if(len === 2){
        startTimer();
        timerStarted = true;
        disableCards();

        // Match FA classes of icons
        if(openCards[0].children[0].classList[1] === openCards[1].children[0].classList[1]){
            openCards[0].classList.add('match');
            openCards[1].classList.add('match');
            openCards = [];

            enableCards();
            successMessage();
        }
        else{
            openCards[0].classList.add('unmatched');
            openCards[1].classList.add('unmatched');

            setTimeout(function(){
                openCards[0].classList.remove('displayed', 'unmatched');
                openCards[1].classList.remove('displayed', 'unmatched');
                openCards = [];

                enableCards();
            }, 1500);
        }
    }
}

/** 
 * Disable all cards so we cannot click and open any other cards except the two already opened 
 */
function disableCards(){
    for(var i = 0; i < cards.length; i++){
        cards[i].classList.add('disabled');
    }
}

/** 
 * Enable all cards so every card can be choosable and opened 
 */
function enableCards(){
    for(var i = 0; i < cards.length; i++){
        cards[i].classList.remove('disabled');
    }
}

/** 
 * Start the timer function 
 */
function startTimer(){
    var sec = 0;
    var min = 0;

    // Check if the timer has not started to start it
    if(!timerStarted){
        interval = setInterval(function(){
            timer.innerHTML = min + ' min ' + sec + ' sec';
            sec++;

            if(sec == 60){
                min++;
                sec = 0;
            }
        }, 1000);
    } 
}

/** 
 * Display a Sweet Alert Popup success message if everything is green and restart the game
 */
function successMessage(){
    const matchedCards = document.querySelectorAll('.match');

    if(matchedCards.length == 16){
        clearInterval(interval);
        var i = Math.floor((Math.random() * giphs.length));
        var image = 'https://media.giphy.com/media/' + giph[i] + '/giphy.gif';

        Swal({
            type: 'success',
            imageUrl: image,
            title: 'Congrats, YOU did it!',
            html: 'You beat the Game in <strong>' + timer.innerHTML + '</strong>. Be proud and happy!',
            confirmButtonText: 'Awesome',
            footer: 'Thanks for playing',
        }).then((result) => {
            if(result.value){
                var span = document.createElement('span');
                span.insertAdjacentHTML('beforeend', '<img src="' + image + '" width="48" height="27"> ' + timer.innerHTML);
                stats.appendChild(span);
                startGame();
            }
        });
    }
}