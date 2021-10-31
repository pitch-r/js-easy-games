const config = {
    width: 1000,
    height: 700,
    ball_size: 30,
    ball_extent: 10,
    player_width: 150,
    ball_velocity: 10,
    player1_line: 40,
    player2_line: 1000 - 40,
    player_velocity: 20,
    keybind: {
        player1: { up: 'w', down: 's' },
        player2: { up: 'ArrowUp', down: 'ArrowDown' },
    },
};

let state;

function resetGame() {
    let center_x = config.width / 2;
    let center_y = config.height / 2;
    state = {
        ball: {
            position: { x: center_x, y: center_y },
            velocity: { x: config.ball_velocity, y: config.ball_velocity },
        },
        player1: {
            y: center_y,
            up: false, down: false,
            score: 0,
        },
        player2: {
            y: center_y,
            up: false, down: false,
            score: 0,
        },
    };
}
resetGame();


function render() {
    // Player
    let p1 = document.getElementById('p1');
    p1.style.top = (state.player1.y - config.player_width / 2) + 'px';

    let p2 = document.getElementById('p2');
    p2.style.top = (state.player2.y - config.player_width / 2) + 'px';

    // Ball
    let ball = document.getElementById('ball');
    ball.style.left = (state.ball.position.x - config.ball_size / 2) + 'px';
    ball.style.top = (state.ball.position.y - config.ball_size / 2) + 'px';

    // Score
    document.getElementById('p1-score').textContent = state.player1.score;
    document.getElementById('p2-score').textContent = state.player2.score;
}


document.onkeydown = function (event) {
    if (event.key == config.keybind.player1.up)
        state.player1.up = true;
    if (event.key == config.keybind.player1.down)
        state.player1.down = true;

    if (event.key == config.keybind.player2.up)
        state.player2.up = true;
    if (event.key == config.keybind.player2.down)
        state.player2.down = true;
}
document.onkeyup = function (event) {
    if (event.key == config.keybind.player1.up)
        state.player1.up = false;
    if (event.key == config.keybind.player1.down)
        state.player1.down = false;

    if (event.key == config.keybind.player2.up)
        state.player2.up = false;
    if (event.key == config.keybind.player2.down)
        state.player2.down = false;
}

function update() {
    // Check key press
    if (state.player1.up)
        state.player1.y -= config.player_velocity;
    if (state.player1.down)
        state.player1.y += config.player_velocity;

    if (state.player2.up)
        state.player2.y -= config.player_velocity;
    if (state.player2.down)
        state.player2.y += config.player_velocity;

    // Check player bound
    if (state.player1.y < config.player_width / 2)
        state.player1.y = config.player_width / 2;
    if (state.player1.y > config.height - config.player_width / 2)
        state.player1.y = config.height - config.player_width / 2;

    if (state.player2.y < config.player_width / 2)
        state.player2.y = config.player_width / 2;
    if (state.player2.y > config.height - config.player_width / 2)
        state.player2.y = config.height - config.player_width / 2;

    // Move ball
    state.ball.position.x += state.ball.velocity.x;
    state.ball.position.y += state.ball.velocity.y;

    // Collision / Reflect

    // Wall Top-Bottom
    if (state.ball.position.y < config.ball_size / 2 && state.ball.velocity.y < 0)
        state.ball.velocity.y *= -1;
    if (state.ball.position.y > config.height - config.ball_size / 2 && state.ball.velocity.y > 0)
        state.ball.velocity.y *= -1;

    // Player 1-2
    if (state.ball.position.x < config.player1_line + config.ball_size / 2 && state.ball.velocity.x < 0) { // Check x
        if (state.player1.y - config.player_width / 2 < state.ball.position.y + config.ball_extent &&
            state.ball.position.y - config.ball_extent < state.player1.y + config.player_width / 2) { // Check y
            state.ball.velocity.x *= -1;
        }
    }
    if (state.ball.position.x > config.player2_line - config.ball_size / 2 && state.ball.velocity.x > 0) {
        if (state.player2.y - config.player_width / 2 < state.ball.position.y + config.ball_extent &&
            state.ball.position.y - config.ball_extent < state.player2.y + config.player_width / 2) {
            state.ball.velocity.x *= -1;
        }
    }

    // Wall Left-Right
    if (state.ball.position.x < config.ball_size / 2 && state.ball.velocity.x < 0) {
        state.ball.position.x = (config.player1_line + config.width / 2) / 2;
        state.ball.position.y = config.height / 2;
        state.ball.velocity.x *= -1;
        state.player2.score += 1;
    }
    if (state.ball.position.x > config.width - config.ball_size / 2 && state.ball.velocity.x > 0) {
        state.ball.position.x = (config.player2_line + config.width / 2) / 2;
        state.ball.position.y = config.height / 2;
        state.ball.velocity.x *= -1;
        state.player1.score += 1;
    }
}

function main() {
    window.requestAnimationFrame(main);
    update();
    render();
}
main();