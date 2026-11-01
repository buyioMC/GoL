const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;
const CELL_ROW = 32;
const CELL_COL = 32;
const CELL_WIDTH = Math.floor(SCREEN_WIDTH / CELL_ROW);
const CELL_HEIGHT = Math.floor(SCREEN_HEIGHT / CELL_COL);

let screen = document.getElementById("screen");
screen.width = SCREEN_WIDTH;
screen.height = SCREEN_HEIGHT;
let ctx = screen.getContext("2d");
ctx.fillStyle = "red";
ctx.lineWidth = 0.1;
let next_button = document.getElementById("next");
let start_button = document.getElementById("start");
let started = false;
let stop_button = document.getElementById("stop");
let reset_button = document.getElementById("reset");
let interval_input = document.getElementById("interval");
let random_button = document.getElementById("random");

function new_board() {
	let board = new Array(CELL_ROW);
	for (let i = 0; i < CELL_ROW; i++) {
		board[i] = new Array(CELL_COL).fill(0);
	}
	return board;
}

let current = new_board();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function render() {
	ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	for (let i = 0; i < CELL_ROW; i++) {
		for (let j = 0; j < CELL_COL; j++) {
			if (current[i][j] == 1) {
				ctx.fillRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			}
			ctx.strokeRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
		}
	}
}

function count_nbors(i, j) {
	let res = 0;
	for (let m = -1; m < 2; m++) {
		for (let n = -1; n < 2; n++) {
			if (m != 0 || n != 0) {
				let p = i + m;
				let q = j + n;
				if (p > -1 && p < CELL_ROW) {
					if (q > -1 && q < CELL_COL) {
						res += current[p][q];
					}
				}
			}
		}
	}
	return res;
}

function next() {
	let next = new_board();
	for (let i = 0; i < CELL_ROW; i++) {
		for (let j = 0; j < CELL_COL; j++) {
			let n = count_nbors(i, j);
			switch (current[i][j]) {
				case 0: {
					if (n == 3) {
						next[i][j] = 1;
					}
				} break;
				case 1: {
					next[i][j] = 1;
					if (n < 2) {
						next[i][j] = 0;
					} else if (n > 3) {
						next[i][j] = 0;
					}
				} break;
			}
		}
	}
	current = next;
}

screen.addEventListener("click", (e) => {
	let i = Math.floor(e.offsetX / CELL_WIDTH);
	let j = Math.floor(e.offsetY / CELL_HEIGHT);
	let now = current[i][j];
	current[i][j] = (now == 1 ? 0 : 1);
	render();
});

next_button.addEventListener("click", () => {
	next();
	render();
});

start_button.addEventListener("click", async () => {
	next_button.disabled = true;
	interval_input.disabled = true;
	started = true;
	let interval = interval_input.value ? interval_input.value : 200;
	while (started) {
		next();
		render();
		await sleep(interval);
	}
});

stop_button.addEventListener("click", () => {
	started = false;
	interval_input.disabled = false;
	next_button.disabled = false;
});

reset_button.addEventListener("click", () => {
	for (let i = 0; i < CELL_ROW; i++) {
		for (let j = 0; j < CELL_COL; j++) {
			current[i][j] = 0;
		}
	}
	render();
});

random_button.addEventListener("click", () => {
	for (let i = 0; i < CELL_ROW; i++) {
		for (let j = 0; j < CELL_COL; j++) {
			current[i][j] = Math.round(Math.random());
		}
	}
	render();
});

render();
