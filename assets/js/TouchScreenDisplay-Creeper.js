var isTouchCreeper = false;
var creeper;
var bomNum = 0;
var canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
const particleSize = 8;
const explosionSpeed = 2;
var creeperImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAakAAAGrCAYAAAB65GhQAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAkjSURBVHic7d2/i+R3Hcfxz8xOfuxdbHIbDDHHgaRIHQxGsVFbwc7C3tI/xz/AxsbWIo2tIAFRMAhBIwinFy73K7nc7l1u52sTJIVC3Gzm89ydx+MveM0U8xze34FZXf/x9WUAQMjNt29+uH28fWlz9J2j2VsA4D+e3Hsybr59c4wxxnryFgD4n0QKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADIEikAskQKgCyRAiBLpADI2swe8GXceefO7An8F4evHI4r37gyewZwCVzoSH3814/Hg788mD2Dz1mtV+O1n702ewZwSVzoSI0xxvbJdvYEPufg+YPZE4BL5MJHCti9e3+6N27/7vbsGXvr6NtH48U3Xpw9YydECjiT41vHY/vYJWPX1s/t1+/d9uvVAnChiBQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIFQJZIAZAlUgBkiRQAWSIF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";
var creeperBomingImg = "data:image/png;base64,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";
window.onload = function() {
	document.addEventListener('touchstart',
	function(event) {
		if (isTouchCreeper == false) {
			isTouchCreeper = true;
			let touch = event.touches[0];
			let x = touch.clientX;
			let y = touch.clientY;
			creeper = document.createElement("img");
			creeper.src = creeperImg;
			creeper.width = "30";
			creeper.height = "30";
			creeper.style.position = "absolute";
			creeper.style.top = y + "px";
			creeper.style.left = x + "px";
			creeper.style.pointerEvents = "none";
			document.body.appendChild(creeper);
			boom();
		}
	});
}
function boom() {
	if (bomNum <= 6) {
		setTimeout(function() {
			creeper.width = "35";
			creeper.height = "35";
			creeper.src = creeperBomingImg;
			setTimeout(function() {
				creeper.width = "30";
				creeper.height = "30";
				creeper.src = creeperImg;
				bomNum++;
				boom();
			},
			125);
		},
		125);
	} else {
		bomNum = 0;
		creeper.src = creeperBomingImg;
		setTimeout(function() {
			creeper.width = "35";
			creeper.height = "35";
			creeper.src = creeperBomingImg;
			setTimeout(function() {
				creeper.width = "40";
				creeper.height = "40";
				creeper.src = creeperImg;
				setTimeout(function() {
					creeper.src = creeperBomingImg;
					setTimeout(function() {
						document.body.removeChild(creeper);
						canvas.width = "40";
						canvas.height = "40";
                        canvas.style.position = "absolute";
						canvas.style.top = creeper.style.top;
						canvas.style.left = creeper.style.left;
						canvas.style.pointerEvents = "none";
						document.body.appendChild(canvas);
						createParticles(20, 20);
						setTimeout(function() {
							document.body.removeChild(canvas);
							isTouchCreeper = false;
						},
						500);
					},
					500);
				},
				125);
			},
			125);
		},
		125);
	}
}
function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.size = particleSize;
	this.speedX = Math.random() * explosionSpeed - explosionSpeed / 2;
	this.speedY = Math.random() * explosionSpeed - explosionSpeed / 2;
}
Particle.prototype.update = function() {
	this.x += this.speedX;
	this.y += this.speedY;
	this.size -= 0.1;
}
Particle.prototype.draw = function() {
	ctx.fillStyle = 'rgba(211, 211, 211, 0.8)';
	ctx.fillRect(this.x, this.y, this.size, this.size);
}
const particles = [];
function createParticles(x, y) {
	for (let i = 0; i < 20; i++) {
		particles.push(new Particle(x, y));
	}
}
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
		if (particles[i].size <= 0) {
			particles.splice(i, 1);
			i--;
		}
	}
	requestAnimationFrame(animate);
}
animate();
