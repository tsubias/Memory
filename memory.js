// memory.js
// ideas:
//	- shuffle tiles DONE
//	- fix reset so it also shuffles tiles
//	- programmatic creation of tiles based on user input (e.g. select 4 x 5 board)
//	- make complete tiles disappear or change tile color
//	- animate complete tiles to move into a stack
//	- replace tile # value with images

// helper functions
function updateScoreBoard(m, s) {
	$('.moves').text(m);
	$('.score').text(s);
}
// https://github.com/coolaj86/knuth-shuffle 
// moves shuffled items to end of array, randomly picking from the (relatively) unshuffled front
function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
// board setup
function setupBoard(w, h, domID) {
	var anchor = $(domID).first(),		// first() in case a non-ID selector is passed
			setup = [],
			rowObj,
			rowTile,
			rowSpan,
			classNames,
			dim = w * h,
			pairs = dim / 2;
	if (dim % 2) return(false);				// odd # of tiles not permitted, board not setup
	for (var i = 0; i < pairs; i++) {	// create an array of pairs
		setup.push(i+1);
		setup.push(i+1);
	}
	setup = shuffle(setup);
	/*for (var i = 0; i < dim; i++) {
		$('<h2>').text(setup[i]).appendTo(anchor);
	}*/
	for (var i = 0; i < h; i++) {
		classNames = "row row" + (i+1);
		rowObj = $('<div>').addClass(classNames);
		//createNode(anchor, '<div>', 'row row'+(i+1));
		for (var j = 0; j < w; j++) {
			classNames = "tile tile" + (i+1) + (j+1);
			rowTile = $('<div>').addClass(classNames);
			classNames = "face hide";
			rowSpan = $('<span>').text(setup.pop());
			rowSpan.addClass(classNames);
			rowTile.append(rowSpan);
			rowObj.append(rowTile);
		}
		anchor.append(rowObj);
	}
	return(true);	
}

// game function
var game = function() {
	var	moves = 0,
			score = 0,
			play = 0,
			boardw = 8,
			boardh = 5,
			maxscore = boardw * boardh / 2,
			hand = [];
			
	updateScoreBoard(moves, score);
	
	if (!setupBoard(boardw, boardh, '#board')) {
		$('.warn').text("You must select an even number of cards.");
		$('.warn-box').removeClass('hide');
	}
	
// handle tile click	
	$('.tile').click(function () {
		var card = $(this).children('.face')[0];		// store the face value of the tile
		
		$('.warn-box').addClass('hide');						// clean up warning box from last play
		if (play < 0) {															// clean up pair of cards from last play
			if (play < -1) {
				$(hand[0]).addClass('hide');
				$(hand[1]).addClass('hide');
			}
			play = 0;
		}
		if ($(card).hasClass('hide')) {							// show the card clicked and add to the hand
			$(card).removeClass('hide');
			hand[play] = card;
			play++;
		} else {
			$('.warn').text("Please select a different card.");
			$('.warn-box').removeClass('hide');
		}
		if (play > 1) {															// if player has made 2 plays, check hand values
			if ($(hand[0]).text() === $(hand[1]).text()) {
				$(hand[0]).addClass('complete');
				$(hand[1]).addClass('complete');
				score++;
				play = -1;
				if (score !== maxscore) {
					$('.warn').text("Matched!");
					$('.warn-box').removeClass('hide');	
				}
			} else {
				$('.warn').text("Please try again.");
				$('.warn-box').removeClass('hide');	
				play = -2;
			}
			moves++;
		}
		updateScoreBoard(moves, score);
		if (score === maxscore) {
			$('.warn').text("Congratulations! You finished in " + moves + " moves.");
			$('.warn-box').removeClass('hide');				
		}
	});
	
// reset functionality
	$('.reset').mousedown(function () {
		/*while (hand.length > 0) {									// buggy and unnecessary
			$(hand[0]).addClass('hide');
			hand.shift();
		}*/
		//$(this).addClass('press');
		$('.face').removeClass('complete');
		$('.face').addClass('hide');
		/*$('#board').empty();											// buggy, removes event handlers
		setupBoard(boardw, boardh, '#board');*/
		$('.warn').text("");
		$('.warn-box').addClass('hide');	
		moves = 0;
		score = 0;
		play = 0;
		hand.length = 0;
		updateScoreBoard(moves, score);
	});
};

/*
function playCard() {
	$('.tile').click(function () {
		var card = $(this).children('.face')[0];
		if ($(card).hasClass('hide')) {
			$(card).removeClass('hide');
		}
	}
}*/

$(document).ready(game);