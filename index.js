const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 130 
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position:{
        x:0,
        y:0
    },
    velocity: {
        x: 0,
        y: 0
    },
    jumping: false,
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 130
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        }

    }
})

const enemy = new Fighter({
    position:{
        x:400,
        y:100
    },
    velocity: {
        x: 0,
        y: 0
    },
    jumping: false,
    color: 'red',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 145
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        }
    }
})

player.draw()
enemy.draw()

console.log(player)

const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
   player.update()
   enemy.update()

   player.velocity.x = 0
   enemy.velocity.x = 0

   handleJumping(player);
   handleJumping(enemy);

    //player movement
    
   if (keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -5
    player.switchSprite('run')
   } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
    player.switchSprite('run')
    console.log(player.image)
   } else {
    player.switchSprite('idle')
   }
   //player jumping
   if (player.velocity.y < 0){
    player.switchSprite('jump')
   } else if (player.velocity.y > 0){
    player.switchSprite('fall')
   }

   //enemy movement
   if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5
    enemy.switchSprite('run')
    console.log(enemy.image)
   } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
    enemy.switchSprite('run')
   } else {
    enemy.switchSprite('idle')
   }
   //enemy jumping
   if (enemy.velocity.y < 0){
    enemy.switchSprite('jump')
   } else if (enemy.velocity.y > 0){
    enemy.switchSprite('fall')
   }else {
    enemy.switchSprite('idle')
   }

   //collision
   if ( rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
   }) &&
    player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"
    console.log("DIE EVIL MONSTER!")
   }
   if ( rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
   }) &&
    enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + "%"
    console.log("DIE MEDDLING RECTANGLE!")
   }
   //end game based on health
   if ( enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
   }
}

animate()

window.addEventListener('keydown', (event) =>{
    console.log(event.key)
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (!player.jumping && player.position.y + player.height >= canvas.height - 96) {
                player.velocity.y = -15; // You can adjust the jump velocity as needed
                player.jumping = true;
            }
            break
        case ' ':
            player.attack()
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (!enemy.jumping && enemy.position.y + enemy.height >= canvas.height - 96) {
                enemy.velocity.y = -15; // You can adjust the jump velocity as needed
                enemy.jumping = true;
            }
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) =>{
    
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

function handleJumping(sprite) {
    if (sprite.position.y + sprite.height >= canvas.height -96) {
        sprite.jumping = false;
    }
}