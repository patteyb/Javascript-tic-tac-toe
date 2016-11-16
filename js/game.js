
var Controller = {};

Controller.TicTacToe = function() {

    var ohSmall = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg>';
    
    var exSmall = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg>';

    var messages = {
        o: 'Fantastic! You selected ' + ohSmall + "'s.",
        x: 'Stupendous! You selected '+ exSmall + "'s.",
        player_o: "Remember...you're " + ohSmall + "'s.",
        player_x: "Remember...you're " + exSmall + "'s.",
        youGoFirst: "Since I'm such a nice computer, you may go first.",
        firstMessage1P: ["Good luck! You're going to need it.", 'May the best computer win!', "You haven't got a prayer!", "I'll try to take it easy on you."],
        firstMessage2P: ['Good luck!', 'May the best player win!', 'I hope your friendship survives this game.', "Don't get mad, get even."],
        turn: ['Smooth move!', "You're killing me!", "Who taught you tic-tac-toe?", "You gotta be kidding!", "Beauty of a Move.", "Holy Cow!", "You couldn't play tic-tac-toe to save your life!", "Your mother wears bunny slippers.", "Brilliant!", "Why did you go and do that for?"],
    };

    var grid = $('.box');


    //----------------------------------------------------------------------------------------------
    // FUNCTION showMainPage()
    //
    // Loads up the front page and handles the modal window asking for player name and marker selection
    // Call showGamePage() when modal is closed
    //----------------------------------------------------------------------------------------------
    this.showMainPage = function() {
        var play = this;
        var html;
        // Setup and display initial page asking for player's name
        $('body')[0].style.backgroundColor = "#3F6C45";

        // set up html asking for player's name, his chosen marker, and whether to play against computer
        html = "<input type='text' id='name' name='name' placeholder='Enter your name...' autofocus><br><br>";
        html += "<strong>What do you want to be?</strong><br><input type='radio' id='o' name='marker' value='o' checked>    " + ohSmall + "<br><input type='radio' id='x' name='marker' value='x'>    " + exSmall;
        html += "<br><br><strong><input type='checkbox' id='human' name='human'>  I want to wimp out and<br>play against another human.";
        html += "<br><br><input type='text' id='name2' name='name2' placeholder='Enter second player's name...' autofocus><br><br>";

        $('#message')[0].innerHTML = html;

        // Modal to collect the player's name and the symbol they choose to use
        $('#myModal').on('hidden.bs.modal', function (e) {
            play.name = $('#name').val();
            play.p1Marker = $('input[name="marker"]:checked').val();
            if ( $('input[name="human"]').prop("checked") ) {
                play.onePlayer = false;
                play.name2 = $('#name2').val();
            }
            initializePlayers(play);
            showGamePage(play);  
        });     
     };

    //----------------------------------------------------------------------------------------------
    // FUNCTION initializePlayers()
    //
    //  Assign the appropriate markers ('o' or 'x') to p1Marker or p2Marker.
    //  Calls switchPlayerIndicator() to activate the appropriate active-player button
    //-----------------------------------------------------------------------------------------------
    var initializePlayers = function(p) {
        if ( p.p1Marker === 'o') {
            p.p2Marker = 'x';
        } else {
            p.p2Marker = 'o';
        }
        if ( p.p2WentFirst ) {
            switchPlayerIndicator(p.p2Marker, p.p1Marker);
            p.activePlayer = p.p2Marker;
        } else {
            switchPlayerIndicator(p.p1Marker, p.p2Marker);
            p.activePlayer = p.p1Marker;
        }
    };

     //----------------------------------------------------------------------------------------------
     // FUNCTION showGamePage()
     //
     // Loads up the tic tac toe board
     //----------------------------------------------------------------------------------------------
     var showGamePage = function(p) {
        $('body')[0].style.backgroundColor = '#fff';
        $('#onload')[0].style.display = 'none';
        $('.board')[0].style.opacity= '1';
        prepareGame(p, grid);
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION prepareGame()
    //
    // If this is the first game: set up player indicators and initial message
    // If this is NOT the first game: 
    //      1. reset game variables
    //      2. Decide who shall go first in next game
    //      3. Indicate who is the active player
    //          a. If computer is the active player, get the computer move and display the board
    //          b. If human is the active player, prepare the board and wait for their move
    //-----------------------------------------------------------------------------------------------
    var prepareGame = function(p, grid) {
        //var compMove = -1;

        // Set up click event listener
        for (var i=0; i<grid.length; i++) {
            $(grid[i]).on('click', {p: p}, handler);
        } 

        if (p.totalNumMatches !== 0) { // not the first game, so reset game variables 
            purgeGrid(grid);
             
            if (p.p2WentFirst) {  // If computer/player2 went first last game, then human/player1 goes first this game
                p.p2WentFirst = false;
                p.activePlayer = p.p1Marker;
                switchPlayerIndicator(p.activePlayer, p.p2Marker);
            } else {               // else computer/player2 goes first this time
                p.p2WentFirst = true;
                p.activePlayer = p.p2Marker;
                switchPlayerIndicator(p.activePlayer, p.p1Marker);
            }
        }
        
        // refresh game-tracking variables
        p.numSquaresOpen = 9;
        p.squaresFilled = [0,0,0,0,0,0,0,0,0];

        if (p.activePlayer === p.p1Marker || !p.onePlayer) {   // If it is a human's turn, set up the grid
            prepareGrid(p, grid);
            showMessage(p, 'firstMessage');
        } else {                                // else, get the computer's move and fire the click event
            p.move = getRandomIndex(9);
             $(grid[p.move]).click();
        }  
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION handler()
    //
    // Handles the click event on the tic-tac-toe grid
    //----------------------------------------------------------------------------------------------
    var handler = function (event) {
        var p = event.data.p;           // passed argument
        $(this).off();                  // turn off event listener so that the square can't be selected again
        event.stopPropagation();
        event.preventDefault();
        if ($(event.target).is('li')) {          
            p.move = parseInt(this.id); // capture the square selected
            playGame(p, grid);          // play that square
        }
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION prepareGrid()
    //
    //  Prepare and activate the grid for the active player, showing x's or o's on hover
    //-----------------------------------------------------------------------------------------------
    var prepareGrid = function(p, grid) {

        for (var i = 0; i < 9; i++) {
            if (p.squaresFilled[i] === 0) { // if square is empty, give it a hover class
                $(grid[i]).attr('class', 'box ' + p.activePlayer);
            }
        }
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION disableGrid()
    //
    //  Removes the hover class from open squares
    //-----------------------------------------------------------------------------------------------
    var disableGrid = function(p, grid) {
        for (var i = 0; i < 9; i++ ) {
            if ( p.squaresFilled[i] === 0 ) { // not occupied
                $(grid[i]).attr('class', 'box');
            } 
        }
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION purgeGrid()
    //
    //  Removes all classes but the initial box class from squares
    //-----------------------------------------------------------------------------------------------
    var purgeGrid = function(grid) {
        for (var i=0 ; i < 9; i++) {
            $(grid[i]).attr("class", "box");
        }
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION playGame()
    //
    //  Turn on click-event listener on board (grid) 
    //      1. On a grid click
    //          a. Play the square selected by calling squarePlayed()
    //          b. Check for winner
    //              i.  If game over, call endGame()
    //              ii. Else, 
    //                  a. disable grid 
    //                  b. switch players   
    //                  c. Call prepareGrid(). If it's computer's move, need to reiterate
    //-----------------------------------------------------------------------------------------------
    var playGame = function(p, grid) {
        var winner = null;

            squarePlayed(p);

            winner = checkForWinner(p.squaresFilled, p.numSquaresOpen);

            if (isGameOver(winner, p.numSquaresOpen)) { // someone won or no squares left
               endGame(winner, p, grid);
            } else {
                if (p.numSquaresOpen > 0) {
                    // Figure out what type of message to display
                    if (p.onePlayer) {
                        if (p.activePlayer === p.p2Marker && p.numSquaresOpen === 8) {
                            showMessage(p, 'firstMessage');
                        } else if (p.activePlayer === p.p2Marker) {
                            showMessage(p, 'turn');
                        }
                    } else if (!p.onePlayer) {
                        showMessage(p, 'turn');
                    }
                    disableGrid(p, grid);
                    switchPlayers(p, grid);
                    prepareGrid(p, grid);
                }
            } 
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION squarePlayed()
    //
    // Assigns the appropriate square the proper class to "turn off" a box in the grid.
    // Updates the squaresFilled array to track the squares already played. 
    // Updates the numSquaresOpen counter variable. 
    //-----------------------------------------------------------------------------------------------
    var squarePlayed = function(p) {
        var str = '#' + p.move;

        $(str).attr("class", "box box-filled-" + p.activePlayer);
                
        p.squaresFilled[p.move] = p.activePlayer;
        p.numSquaresOpen--;
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION checkForWinner()
    //
    //  Checks to see if the last move produced a winner. Returns 'o', 'x', or tie if game is over.
    //  If more moves exist and there is no winner, it will return null.
    //-----------------------------------------------------------------------------------------------
    var checkForWinner = function(arrBox, numSquaresOpen) {

        // check rows
        for (var i = 0; i < 9; i=i+3) {
            if (arrBox[i] !== 0) {
                if (arrBox[i] === arrBox[i+1] && arrBox[i] === arrBox[i+2]) {   
                    return arrBox[i];
                }
            }
        }

        // check columns
        for (i = 0; i < 3; i++) {
            if (arrBox[i] !== 0) {
                if (arrBox[i] === arrBox[i+3] && arrBox[i] === arrBox[i+6]) {  
                    return arrBox[i];
                }
            }
        }

        // check diagonal rows
        if (arrBox[0] !== 0 && (arrBox[0] === arrBox[4] && arrBox[0] === arrBox[8])) {  
            return arrBox[0];
        }
        if (arrBox[2] !== 0 && (arrBox[2] === arrBox[4] && arrBox[2] === arrBox[6])) {  
            return arrBox[2];
        }

        // check for tie
        if (numSquaresOpen <= 0) {
            return 'tie';
        }

        return null;
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION switchPlayers()
    //
    //  Stores activePlayer into previousPlayer, moves the activePlayer's marker into activePlayer.
    //  Calls switchPlayerIndicator() to highlight the active player on screen.
    //  If it is the computer's move, calls getCompMove() and fire the click event.
    //-----------------------------------------------------------------------------------------------
    var switchPlayers = function(p, grid) {
        var previousPlayer = p.activePlayer;
        var i;

        if (p.activePlayer === 'o') {
            p.activePlayer = 'x';
        } else {
            p.activePlayer = 'o';
        }

        switchPlayerIndicator(p.activePlayer, previousPlayer);

        if (p.activePlayer === p.p2Marker && p.onePlayer) { // Computer is the active player
            p.move = getCompMove(p, grid);
            $(grid[p.move]).click();
        }    
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION switchPlayerIndicator()
    //
    //  Indicates who the active player is by activating and deactivating the appropriate indicators
    //-----------------------------------------------------------------------------------------------
    var switchPlayerIndicator = function(m1, m2) {
        $('#player_' + m1).attr('class', 'players active');
        $('#player_' + m2).attr('class', 'players players-turn');
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION getCompMove()
    //
    //  Checks first to see if there is an open square that would produce a win.
    //  If no winning combination, checks an open square for a blocking move.
    //  if no winning or blocking move exists, will randomly generate a move.
    //
    //  Returns the index of the grid selected for the computer's move.
    //-----------------------------------------------------------------------------------------------
    var getCompMove = function(p, grid) {
        var arrPossibleMove = p.squaresFilled;
        var move;
        var i;

        setTimeout(function(){  }, 10000);

        // Check for winning moves
        for (i = 0; i < 9; i++) {
            if (p.squaresFilled[i] === 0) {
                arrPossibleMove[i] = p.p2Marker;
                move = checkForWinner(arrPossibleMove);
                if (move === p.p2Marker) {
                    return i;
                } else {
                    arrPossibleMove[i] = 0;
                }
            }
        }

        // check for blocking moves 
        for (i = 0; i < 9; i++) {
            if (p.squaresFilled[i] === 0) {
                arrPossibleMove[i] = p.p1Marker;
                move = checkForWinner(arrPossibleMove);
                if (move === p.p1Marker) {
                    return i;
                } {
                    arrPossibleMove[i] = 0;
                }
            }
        }

        // Random Move Generator
        i = getRandomIndex(9);
        while (p.squaresFilled[i] !== 0) {
            i = getRandomIndex(9);
        } 
        return i; 
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION endGame()
    //
    //  1. Updates totalNumMatches played and saves the game's winner in prevWinner.
    //  2. If human/player1 is the winner, updates numMatchesP1Winner.
    //  3. Turns off click-event listeners on grid.
    //  4. Generates end-of-game screen.
    //-----------------------------------------------------------------------------------------------
    var endGame = function(w, p, grid) {
        p.totalNumMatches++;
        p.prevWinner = w;
        if (w === p.p1Marker) {
            p.numMatchesP1Won++;
        }
        if (w === p.p2Marker) {
            p.numMatchesP2Won++;
        }

        //remove event listeners 
        for (var i = 0; i < 9; i++) {
                $(grid[i]).off();
        }

        generateGameOverScreen(w, p);
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION generateGameOverScreen()
    //
    // Generates the screen overlay that indicates who won, or if the game ended in a tie. 
    // Also sets up event listener on Play Again button. 
    //-----------------------------------------------------------------------------------------------
    var generateGameOverScreen = function(w, p) {
        var cName = 'screen-win-' + w;
        var word = 'games';

        if (p.numMatchesP1Won === 1) {
            word = 'game';
        }

        $('.board')[0].style.opacity= '0';

        $('#winDiv').addClass(cName);
        $('#winDiv').css('display', 'block');

        if (w === 'tie') {
                $('#gameOverText')[0].innerHTML = "Nobody won!";
        }

        if (p.onePlayer) {
            if (w === p.p1Marker) {
                $('#gameOverText')[0].innerHTML = "You won, " + p.name + "!<br><h4> You've won " + p.numMatchesP1Won + ' ' + word + ' out of ' +
                p.totalNumMatches + ' played.</h4>';
            } else if (w === p.p2Marker) {
                $('#gameOverText')[0].innerHTML = 'Oooh, ' + p.name + ', that sucks.';
            } 
        } else {
            if (w === p.p1Marker) {
                $('#gameOverText')[0].innerHTML = p.name + " won!<br><h4> You've won " + p.numMatchesP1Won + ' ' + word + ' out of ' +
                p.totalNumMatches + ' played.</h4>';
            } else if (w === p.p2Marker) {
                $('#gameOverText')[0].innerHTML = p.name2 + " won!<br><h4> You've won " + p.numMatchesP2Won + ' ' + word + ' out of ' +
                p.totalNumMatches + ' played.</h4>';
            } 
        }

        $('#playAgainButton').one('click', function(event) {
            if ($(event.target).is('button')) {
                $('.board')[0].style.opacity= '1';
                $('#winDiv').removeClass(cName);
                $('#winDiv').css('display', 'none');
                prepareGame(p, grid);
            }
        });
    };

    //----------------------------------------------------------------------------------------------
    // FUNCTION isGameOver()
    //
    //  Returns true if there is a winner; else, returns false.
    //-----------------------------------------------------------------------------------------------
    var isGameOver = function(w, n) {
        if (w === 'x' || w === 'o' || w === 'tie') {
            return true;
        }
        if (n <= 0) {
            return true;
        }
        return false;
    };

    //----------------------------------------------------------------------------------------------
	// FUNCTION showMessage()
	//
	//  Display the argument arrHTML as a message to the human player.
	//-----------------------------------------------------------------------------------------------
    var showMessage = function(p, type) {
        console.log('type = ' + type);
        var html = '';
        var arrMessages = [];

        if (p.onePlayer) {
            if (type === 'firstMessage' && p.totalNumMatches === 0) {   // first message and first game
                arrMessages = [ messages[p.p1Marker], messages.youGoFirst ];
            } else {
                arrMessages.push( messages['player_' + p.p1Marker] );  
                if (type === 'firstMessage' ) {                         // first message, but not first game
                    arrMessages.push( messages.firstMessage1P[getRandomIndex(messages.firstMessage1P.length)] );
                } else {                                                // turn
                    arrMessages.push( messages.turn[getRandomIndex(messages.turn.length)] );
                }
            }
        } else {   
            if (type === 'firstMessage') {  
                arrMessages.push( messages.firstMessage2P[getRandomIndex(messages.firstMessage2P.length)] ); 
                if (p.p2WentFirst) {            
                    arrMessages.unshift([ p.name2 + ' goes first.' ]);
                } else {
                    arrMessages.unshift([ p.name + ' goes first.' ]);
                }
            } else {
                arrMessages.push( messages.turn[getRandomIndex(messages.turn.length)] );
                if (p.p1Marker === p.activePlayer) {
                    arrMessages.unshift( [ p.name2 + "'s turn." ] );
                } else {
                    arrMessages.unshift( [ p.name + "'s turn." ] );
                }
            }
        }

        for (var i = 0; i < arrMessages.length; i++ ) {
            html += arrMessages[i] + '<br>'; 
        }
        $('#messageArea')[0].innerHTML = html;
    };

    //----------------------------------------------------------------------------------------------
	// FUNCTION getRandomIndex()
	//-----------------------------------------------------------------------------------------------
    var getRandomIndex = function(n) {      
        var i = Math.floor((Math.random() * n) + 1) -1;
        return i;
    };

};
