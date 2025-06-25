document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Carregar imagens das engrenagens/rolamentos
    const gearImage = new Image();
    gearImage.src = 'https://www.svgrepo.com/show/9955/gear.svg'; // Exemplo de SVG de engrenagem
    const bearingImage = new Image();
    bearingImage.src = 'https://www.svgrepo.com/show/2755/bearing.svg'; // Exemplo de SVG de rolamento

    const images = [gearImage, bearingImage];

    // Criar classe de partículas
    class Particle {
        constructor(x, y, directionX, directionY, size, image) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.image = image;
            this.angle = Math.random() * 360;
            this.spin = Math.random() < 0.5 ? -1 : 1; // Direção da rotação
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.angle += this.spin * 0.1; // Velocidade da rotação
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 25000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 25) + 20;
            let x = Math.random() * (innerWidth - size * 2) + size;
            let y = Math.random() * (innerHeight - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let image = images[Math.floor(Math.random() * images.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, image));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }
    
    // Garantir que as imagens carreguem antes de iniciar a animação
    let imagesLoaded = 0;
    images.forEach(img => {
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                init();
                animate();
            }
        };
    });
    
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
});
