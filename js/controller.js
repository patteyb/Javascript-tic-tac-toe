var ticTacToe = new Controller.TicTacToe();

$(document).ready(function() {
    ticTacToe.name = '';
    ticTacToe.name2 = 'computer';
    ticTacToe.p1Marker = '';
    ticTacToe.p2Marker = '';
    ticTacToe.activePlayer = '';
    ticTacToe.onePlayer = true;
    ticTacToe.move = -1;
    ticTacToe.numMatchesP1Won = 0;
    ticTacToe.numMatchesP2Won = 0;
    ticTacToe.totalNumMatches = 0;
    ticTacToe.prevWinner = '';
    ticTacToe.p2WentFirst = false;
    ticTacToe.numSquaresOpen = 9;
    ticTacToe.squaresFilled = [];
    ticTacToe.showMainPage();
});

