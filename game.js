class CatGame extends Phaser.Scene {
	preload() {
		this.load.image('cat', 'assets/cat.png');
		this.load.image('background', 'assets/background.png');
		this.load.image('platform', 'assets/platform.png');
		this.load.image('sushi', 'assets/sushi.png');
		this.load.image('wasabi', 'assets/wasabi.png');
	}

	create() {
		////////////////// setup
		this.keys = this.input.keyboard.addKeys({ 
			'restart': Phaser.Input.Keyboard.KeyCodes.R,
			'w': Phaser.Input.Keyboard.KeyCodes.W, 
			's': Phaser.Input.Keyboard.KeyCodes.S,
			'a': Phaser.Input.Keyboard.KeyCodes.A,
			'd': Phaser.Input.Keyboard.KeyCodes.D,
			'up': Phaser.Input.Keyboard.KeyCodes.UP,
			'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
			'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
			'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
			'space': Phaser.Input.Keyboard.KeyCodes.SPACE
		});

		this.add.image(640, 360, 'background');
		
		this.score = 0;
		this.level = 1;
		this.score_text = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
		this.updateText();
		
		////////////////// platforms
		this.platforms = this.physics.add.staticGroup();

		this.platforms.create(218, 553, 'platform');
		this.platforms.create(380, 300, 'platform');
		this.platforms.create(650, 500, 'platform');
		this.platforms.create(890, 300, 'platform');
		this.platforms.create(1050, 530, 'platform');

		let floor = this.platforms.create(640, 690);
		floor.setScale(100, 1);
		floor.refreshBody();
		floor.setVisible(false);

		////////////////// player
		this.player = this.physics.add.sprite(100, 100, 'cat');
		this.player.setSize(90, 60);
		this.player.setOffset(40, 30);
		
		this.player.setCollideWorldBounds(true);
		this.physics.add.collider(this.player, this.platforms);

		////////////////// sushis
		this.spawnSushis();

		////////////////// wasabis
		this.wasabis = this.physics.add.group();
		this.physics.add.collider(this.wasabis, this.platforms);
		this.physics.add.collider(this.player, this.wasabis, this.hitwasabi, null, this);
	}

	update() {
		if (this.keys['restart'].isDown) {
			this.scene.restart();
		}

		if (this.keys['a'].isDown || this.keys['left'].isDown) {
			this.player.body.setVelocityX(-300);
		} else if (this.keys['d'].isDown || this.keys['right'].isDown) {
			this.player.body.setVelocityX(300);
		} else {
			this.player.body.setVelocityX(0);
		}

		if (this.keys['w'].isDown || this.keys['space'].isDown || this.keys['up'].isDown) {
			if (this.player.body.touching.down) {
				this.player.setVelocityY(-1000);
			}
		}
	}

	spawnSushis() {
		this.sushis = this.physics.add.group({
			key: 'sushi',
			repeat: 7,
			setXY: { x: 100, y: 0, stepX: 150 }
		});

		this.sushis.children.iterate(function(sushi) {
			let max_speed = 100
			sushi.setBounceY(0.8);
			sushi.setVelocity(Phaser.Math.Between(-max_speed, max_speed), Phaser.Math.Between(-max_speed, max_speed));
			sushi.setCollideWorldBounds(true);
		});

		this.physics.add.collider(this.sushis, this.platforms);
		this.physics.add.overlap(this.player, this.sushis, this.eatSushi, null, this);
	}

	eatSushi(player, sushi) {
		sushi.disableBody(true, true);

		this.score += 1;
		this.updateText();

		if (this.sushis.countActive(true) != 0) return;
		
		// if all sushis are eaten:
		
		this.level += 1;
		this.updateText();

		this.spawnSushis();

		let wasabi_x = 0;
		if (player.x > 640) {
			wasabi_x = Phaser.Math.Between(0, 640);
		} else {
			wasabi_x = Phaser.Math.Between(640, 1280);
		}

		let wasabi = this.wasabis.create(wasabi_x, 20, 'wasabi');

		wasabi.setBounce(1);
		wasabi.setCollideWorldBounds(true);
		wasabi.setVelocity((Math.random() > .5) ? -200 : 200, 20);
	}

	hitwasabi(player, wasabi) {
		this.physics.pause();
		player.setTint(0xff0000);
		
		this.score_text.setText(`You accidentally ate the wasabi and it was too spicy!\n[press R to play again]\nSushis: ${this.score}  Level: ${this.level}`);
	}

	updateText() {
		this.score_text.setText(`Sushis: ${this.score}\nLevel: ${this.level}`);
	}
}

const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	scene: CatGame,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 2000 },
			debug: false
		}
	}
};

const game = new Phaser.Game(config);