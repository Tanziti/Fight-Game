const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({position, velocity, color}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
        this.color = color
    }
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        c.fillStyle = 'green'
        c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
            )
    }

    update() {
        this.draw()
       
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y  >= canvas.height){
            this.velocity.y = 0
        } else  this.velocity.y += gravity
    }
}

const player = new Sprite({
    position:{
        x:0,
        y:427
    },
    velocity: {
        x: 0,
        y: 0
    },
    jumping: false,
    color: 'blue'
})

const enemy = new Sprite({
    position:{
        x:400,
        y:427
    },
    velocity: {
        x: 0,
        y: 0
    },
    jumping: false,
    color: 'red'
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


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
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
   if ((player.attackBox.position.x + player.attackBox.width >= enemy.position.x) && 
   (player.attackBox.position.x <= enemy.position.x + enemy.width) &&
   (player.attackBox.position.y + player.attackBox.height >= enemy.position.y) &&
    (player.attackBox.position.y <= enemy.position.y + enemy.height)) {
    console.log("hey! stop touching me!")
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
            if (!player.jumping && player.position.y + player.height >= canvas.height) {
                player.velocity.y = -15; // You can adjust the jump velocity as needed
                player.jumping = true;
            }
            
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
            if (!enemy.jumping && enemy.position.y + enemy.height >= canvas.height) {
                enemy.velocity.y = -15; // You can adjust the jump velocity as needed
                enemy.jumping = true;
            }
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
    if (sprite.position.y + sprite.height >= canvas.height) {
        sprite.jumping = false;
    }
}