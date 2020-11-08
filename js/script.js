'use strict'
let game = {
    score: 0,
    scoreElem: document.querySelector('.score__count'),
    level: 1,
    levelElem: document.querySelector('.level__count'),
    lives: 5,
    livesElem: document.querySelector('.lives__count'),
    balloonInterval: null, 
    balloonTick: 1000,
    balloonTimeout: null,
    bombTick : 3000,
    bombTimeout: null,
    heartTick: 10000,
    heartTimeout: null,
    balloonSpeed: 8000 + Math.floor(Math.random() * 2000),

    start() {
        game.setScore(0);
        game.setLives(5);
        game.createNewBallon(); 
        game.createNewBomb();
        game.createNewHeart();
    },
    createNewBallon() {
        createBallon(game.balloonSpeed);
        game.balloonTimeout = setTimeout(() => {
            game.createNewBallon();
        }, game.balloonTick);
    },

    createNewBomb() {
        createBomb();
        game.bombTimeout = setTimeout(() => {
            game.createNewBomb();
        }, game.bombTick);
    },

    createNewHeart() {
        createHeart();
        game.heartTimeout = setTimeout(() => {
            game.createNewHeart();
        }, game.heartTick);
    },
    stop() {
        clearTimeout(game.balloonTimeout);
        clearTimeout(game.bombTimeout);
        clearTimeout(game.heartTimeout);
        $('.game__main').html('');
        
    },
    addScore(amount) {
        if(amount < 0 || amount > 1000) {
            amount = 0;
        }
        game.score += amount;
        game.scoreElem.textContent = game.score; 
        game.setLevel(Math.floor(game.score/1000 +1));
        if(game.score >= 10000) {
            game.win();
        }

        
    },
    setScore(amount) {
        if(amount < 0) {
            amount = 0;
        }
        game.score = amount;
        game.scoreElem.textContent = game.score; 
    },
    lostLive(amount) {
        if(game.lives < 1) {
            game.lose();
            return;
        }
        game.lives -= amount;
        game.livesElem.textContent = game.lives; 

        // if(game.lives > 0) {
        //     
        // }
        // else {
        //     game.lose();  
        // }
    },
    setLives(amount) {
        if(amount < 0) {
            amount = 0;
        }
        game.lives = amount;
        game.livesElem.textContent = game.lives;
    },
    addLevel() {
        game.level++;
        game.levelElem.textContent = game.level;
    },
    setLevel(level) {
        if(level < 1) return;
        game.level = level;
        game.levelElem.textContent = game.level;
        game.balloonTick = 1000 - game.level*100;
        game.balloonSpeed = (8000 - game.level * 500) + Math.floor(Math.random() * 2000);
    },
    win() {
        alert('win!!');
        game.stop();
    },
    lose() {
        alert('game over');
        $('.game__main').html('');
        game.stop();
    }
}    

let startBtn = document.querySelector('.button--start');
let restartBtn = document.querySelector('.button--restart');
startBtn.onclick = () => {return game.start()};
restartBtn.onclick = () => game.stop();

function createBallon(balloonSpeed) {
    let balloonSourses = [
        './img/blueballoon.png',
        './img/greenballoon.png',
        './img/orangeballoon.png',
        './img/pinkballoon.png',
    ]
    let randomSourceIndex = Math.floor(Math.random() * balloonSourses.length);

    let mainWidth =$ ('.game__main').width() -50;
    let randomWidth = Math.floor(Math.random() * mainWidth);

    let balloon = document.createElement('img');
    $(balloon).css({
                'width' : '50px',
                'position' : 'absolute',
                'left' : randomWidth + 'px',
                'cursor' : 'pointer',
                'top' : '100vh',
                'transition' : 'top ' + balloonSpeed +'ms linear',
                'z-index' : 1,
                'user-select' : 'none',
                 })
                 .attr({
                     'src' : balloonSourses[randomSourceIndex],
                 })
                 .appendTo( $('.game__main'))
                //  .animate({'top' : '-300px'}, 10000);
                setTimeout(() => {
                    $(balloon).css('top', '-300px');
                }, 10)
    $(balloon).on('transitionend', () => {
        $(balloon).remove();
        game.lostLive(1);
    })
    $(balloon).click(() => {
        popBalloon(balloon);
    })
}

function popBalloon(balloon) {
    game.addScore(100);
    let popSound = new Audio('./img/pop.wav');
    popSound.play();
    let balloonY = balloon.getBoundingClientRect().y;
    let balloonX = balloon.getBoundingClientRect().x;
    console.log([balloonY, balloonX]);
    $(balloon).remove();
    let confetti = document.createElement('img');
    $(confetti).css({
                'width' : '200px',
                'position' : 'absolute',
                'top' : balloonY + 'px',
                'left' : balloonX + 'px',
                'opacity' : 1,
                'transition' : 'opacity 5s',
                'user-select' : 'none',
                })
                .attr({
                    'src' : './img/confetti.gif',
                })
                .appendTo( $('.game__main'))
    setTimeout(() => {
        $(confetti).css('opacity', 0);
    }, 10)
    $(confetti).on('transitionend', () => {
        confetti.remove();
    })
};

function createBomb() {
    let mainWidth = $('.game__main').width() - 100;
    let randomWidth = Math.floor(Math.random() * mainWidth);
    let bomb = document.createElement('img');
    $(bomb).attr({'src' : './img/bomb.png'})
            .css({
                'width' : '100px',
                'position' : 'absolute',
                'left' : randomWidth + 'px',
                'top' : '-20vh',
                'transition' : 'top 10s ease-in',
                'z-index' : 20,
            })
            .appendTo($('.game__main'))
    setTimeout(() => {
        $(bomb).css({'top' : '100vh'})        
    }, 10)
    $(bomb).on('transitionend', () => {
        $(bomb).remove();
    }) 
    $(bomb).click(() => {
        bombBoom(bomb);
    })       
}

function bombBoom(bomb) {
    game.lostLive(1);
    let boomSound = new Audio('./img/boom.wav');
    boomSound.play();
    let bombX = bomb.getBoundingClientRect().x;
    let bombY = bomb.getBoundingClientRect().y;
    $(bomb).remove();
    let boom = document.createElement('img');
    $(boom).css({
                'width' : '100px',
                'position' : 'absolute',
                'left' : bombX +'px',
                'top' : bombY + 'px',
                'opacity' : 1,
                'transition' : 'opacity 5s',
            })
            .attr({'src' : './img/boom.gif'})
            .appendTo($('.game__main'));
    setTimeout(() => {
        $(boom).remove();
    }, 1000);
}

function createHeart() {
    let mainWidth = $('.game__main').width() - 100;
    let randomWidth = Math.floor(Math.random() * mainWidth);
    let heart = document.createElement('img');
    $(heart).attr({'src' : './img/heart.png'})
            .css({
                'width' : '100px',
                'position' : 'absolute',
                'left' : randomWidth + 'px',
                'top' : '-20vh',
                'transition' : 'top 10s ease-in',
                'z-index' : 20,
            })
            .appendTo($('.game__main'))
    setTimeout(() => {
        $(heart).css({'top' : '100vh'})        
    }, 10)
    $(heart).on('transitionend', () => {
        $(heart).remove();
    }) 
    $(heart).click(() => {
        game.lostLive(-1);
        $(heart).remove();
    })   
}