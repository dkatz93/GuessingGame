function generateWinningNumber(){
    return Math.ceil(Math.random() * 100);
}

function shuffle(arr){
    for(var i = arr.length - 1; i > 0; i--){
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

function Game(){
    this.playersGuess = null
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess < this.winningNumber){
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function(num){
    if(typeof num !== 'number' || num < 1 || num > 100){
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        return 'You Win!'
        $('#subtitle').text('Press the reset button to play again')
        $('#submit, #hint').prop("disabled", true);
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            $('#subtitle').text("Guess Again!")
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#subtitle').text('Press the reset button to play again')
                $('#submit, #hint').prop("disabled", true);
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()){
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}



Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}


function newGame(){
    return new Game();
}

function provideHint(){
    var hintArray = [this.winningNumber, this.generateWinningNumber(), this.generateWinningNumber()];
    return shuffle(hintArray);
}

function makeAguess(game){
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess, 10));        
    $('#title').text(output);
}

$(document).ready(function(){
    var game = new Game;
    $('#submit').on('click', function(){
        makeAguess(game)
    })
    $('#player-input').keypress(function(event){
        if(event.which === 13){
            makeAguess(game);
        }
    })
    $('#reset').on('click', function(){
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);
    })
    $('#hint').on('click', function(){
        var hints = game.provideHint();
        $("#title").text("The winning number is " + hints[0] + ", " + hints[1] + ", or " +hints[2])
    })
});

