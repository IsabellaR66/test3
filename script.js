document.addEventListener("DOMContentLoaded", () => {
    
    // Core game components
    const gameArea = document.getElementById("game-area");
    const basket = document.getElementById("basket");
    const star = document.getElementById("star");
    const scoreVal = document.getElementById("score-val");
    const timeVal = document.getElementById("time-val");
    const startBtn = document.getElementById("start-game-btn");

    // Only run if we are on the game page
    if (gameArea && basket && star && startBtn) {
        let score = 0;
        let timeLeft = 30;
        let gameInterval;
        let starInterval;
        let isPlaying = false;

        let starY = 0;
        let starX = 200;
        let starSpeed = 4;

        // 1. Mouse Controller for moving the basket
        gameArea.addEventListener("mousemove", (e) => {
            if (!isPlaying) return;
            // Calculate where the cursor is relative to the box layout
            const rect = gameArea.getBoundingClientRect();
            let relativeX = e.clientX - rect.left;
            
            // Keeps the basket completely contained inside the window boundaries
            let basketLeft = relativeX - 35; 
            if (basketLeft < 0) basketLeft = 0;
            if (basketLeft > rect.width - 70) basketLeft = rect.width - 70;

            basket.style.left = basketLeft + "px";
        });

        // 2. Main game setup activator
        startBtn.addEventListener("click", () => {
            if (isPlaying) return;
            
            // Reset Stats
            score = 0;
            timeLeft = 30;
            scoreVal.textContent = score;
            timeVal.textContent = timeLeft;
            isPlaying = true;
            startBtn.style.display = "none";
            star.style.display = "block";
            
            resetStar();

            // Game Timer Clock (runs every 1 second)
            gameInterval = setInterval(() => {
                timeLeft--;
                timeVal.textContent = timeLeft;

                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);

            // Frame Animation Loop (runs roughly every 20 milliseconds)
            starInterval = setInterval(updatePhysics, 20);
        });

        function resetStar() {
            starY = -30;
            // Choose a random position horizontally across the box grid width
            starX = Math.floor(Math.random() * (gameArea.clientWidth - 25));
            star.style.left = starX + "px";
            star.style.top = starY + "px";
            // Randomly slightly speed up items as score goes up
            starSpeed = 4 + Math.floor(score / 5); 
        }

        function updatePhysics() {
            starY += starSpeed;
            star.style.top = starY + "px";

            const basketLeft = parseInt(basket.style.left) || 215;
            const basketTop = 320; // fixed visual floor placement

            // Collision Detection Logic
            // Check if star overlaps the basket coordinates horizontally & vertically
            if (starY >= basketTop - 25 && starY <= basketTop) {
                if (starX + 25 >= basketLeft && starX <= basketLeft + 70) {
                    score++;
                    scoreVal.textContent = score;
                    resetStar();
                }
            }

            // Reset if star hits the bottom floor uncaught
            if (starY > gameArea.clientHeight) {
                resetStar();
            }
        }

        function endGame() {
            isPlaying = false;
            clearInterval(gameInterval);
            clearInterval(starInterval);
            star.style.display = "none";
            startBtn.style.display = "inline-block";
            startBtn.textContent = "Play Again";
            alert("⏰ Time's Up! You scored " + score + " points!");

            // Bonus: Dynamically append score to highscore list if saved in active environment
            localStorage.setItem("latestScore", score);
        }
    }

    // Dynamic dynamic high score injection when opening the Leaderboard link
    const leaderboardBody = document.getElementById("leaderboard-body");
    if (leaderboardBody) {
        const finalScore = localStorage.getItem("latestScore");
        if (finalScore) {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `<td><strong>Current Run</strong></td><td>You</td><td>${finalScore} pts</td>`;
            leaderboardBody.appendChild(newRow);
        }
    }
});

