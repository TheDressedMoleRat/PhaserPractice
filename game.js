class Example extends Phaser.Scene {
	preload() {
		this.load.image('cat', 'assets/cat.png');
		this.load.image('background', 'assets/background.png');
		this.load.image('platform', 'assets/platform.png');
		this.load.image('sushi', 'assets/sushi.png');
	}

	create() {
		this.add.image(640, 360, 'background');
		
		this.score = 0;
		this.score_text = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		
		this.platforms = this.physics.add.staticGroup();

		this.platforms.create(170, 223, 'platform');
		this.platforms.create(218, 553, 'platform');
		this.platforms.create(423, 387, 'platform');
		this.platforms.create(650, 530, 'platform');
		this.platforms.create(850, 380, 'platform');
		this.platforms.create(1050, 530, 'platform');
		this.platforms.create(1115, 200, 'platform');

		this.player = this.physics.add.sprite(100, 100, 'cat');

		this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, this.platforms);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.sushis = this.physics.add.group({
			key: 'sushi',
			repeat: 11,
			setXY: { x: 100, y: 0, stepX: 100 }
		});

		this.sushis.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		this.physics.add.collider(this.sushis, this.platforms);
		this.physics.add.overlap(this.player, this.sushis, this.collectStar, null, this);
	}

	collectStar(player, star) {
		star.disableBody(true, true);

		this.score += 1;
		this.score_text.setText('Score: ' + this.score);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-300);
		} else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(300);
		} else {
			this.player.body.setVelocityX(0);
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-800);
		}
	}
}

const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	scene: Example,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 2000 },
			debug: false
		}
	}
};

const game = new Phaser.Game(config);