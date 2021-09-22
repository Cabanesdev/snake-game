$(document).ready(function () {
	let canvas = $('#canvas')[0];
	let ctx = canvas.getContext('2d');
	let width = $('#canvas').width();
	let height = $('#canvas').height();
	let game_loop;
	let tail;
	let cellWidth = 20;
	let direction;
	let apple;
	let score;
	let snake_length;

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = 'yellow';
	ctx.strokeRect(0, 0, width, height);

	const popup = document.querySelector('.popup-wrapper');

	function create_snake() {
		let length = 1;
		snake_length = [];
		for (let i = length - 1; i >= 0; i--) {
			snake_length.push({ x: i, y: height / cellWidth / 2 });
		}
	}

	function fill_apple() {
		apple = {
			x: Math.round((Math.random() * (width - cellWidth)) / cellWidth),
			y: Math.round((Math.random() * (height - cellWidth)) / cellWidth),
		};
	}

	function paint() {
		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = 'yellow';
		ctx.strokeRect(0, 0, width, height);

		let positionX = snake_length[0].x;
		let positionY = snake_length[0].y;

		if (direction == 'up') positionY--;
		else if (direction == 'down') positionY++;
		else if (direction == 'right') positionX++;
		else if (direction == 'left') positionX--;

		if (
			positionY == -1 ||
			positionY == height / cellWidth ||
			positionX == -1 ||
			positionX == width / cellWidth ||
			check_crash(positionX, positionY, snake_length)
		) {
			popup.style.display = 'block';
			score = 0;
			updateScore(score);
			clearInterval(game_loop);
			return;
		}

		if (positionX == apple.x && positionY == apple.y) {
			tail = { x: positionX, y: positionY };
			score++;
			updateScore(score);
			checkWin();
			fill_apple();
		} else {
			tail = snake_length.pop();
			tail.x = positionX;
			tail.y = positionY;
		}

		snake_length.unshift(tail);

		for (let i = 0; i < snake_length.length; i++) {
			let c = snake_length[i];
			paint_cell(c.x, c.y, 'blue');
		}

		paint_cell(apple.x, apple.y, 'red');
	}

	function check_crash(x, y, array) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].x == x && array[i].y == y) return true;
		}
		return false;
	}

	function paint_cell(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		ctx.strokeStyle = 'white';
		ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	}

	$(document).keydown(function (e) {
		let key = e.which;
		if (key == '37' && direction != 'right') direction = 'left';
		else if (key == '38' && direction != 'down') direction = 'up';
		else if (key == '39' && direction != 'left') direction = 'right';
		else if (key == '40' && direction != 'up') direction = 'down';
	});

	function updateScore(newScore) {
		$('#score').text(`Score: ${newScore}`);
	}

	function checkWin() {
		let maxScore = Math.pow(width / cellWidth, 2);
		if (score == maxScore) {
			alert('Ganaste');
		}
	}

	function startGame() {
		direction = 'right';
		create_snake();
		fill_apple();

		score = 0;
		game_loop = setInterval(paint, 100);

		if (popup.style.display == 'block') {
			popup.style.display == 'none';
		}
	}

	const closeTag = document.querySelector('.popup-close');
	closeTag.addEventListener('click', () => {
		popup.style.display = 'none';
	});

	const tryagain = document.querySelector('#repeatGame');
	tryagain.addEventListener('click', () => {
		popup.style.display = 'none';
		startGame();
	});

	const button = document.getElementById('button');
	button.addEventListener('click', startGame);
});
