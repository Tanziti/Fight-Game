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



const player = new Fighter({
    position:{
        x:100,
        y:300
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
    }
})

const enemy = new Fighter({
    position:{
        x:400,
        y:300
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
   player.update()
   enemy.update()

   player.velocity.x = 0
   enemy.velocity.x = 0

   handleJumping(player);
   handleJumping(enemy);

   if (keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -5
   } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
   }

   //enemy movement
   if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5
   } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
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
    rectangle1: enemy,
    rectangle2: player
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
        case 'Alt':
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