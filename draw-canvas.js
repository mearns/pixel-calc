

function drawCanvas(newCode, canvas, onError) {
        let redValue = 0;
        let greenValue = 0;
        let blueValue = 0;
        const red = (v) => {
            redValue = v;
        }
        const green = (v) => {
            greenValue = v;
        }
        const blue = (v) => {
            blueValue = v;
        }
        const gray = (v) => {
            red(v);
            green(v);
            blue(v);
        }
        const yellow = (v) => {
            red(v);
            green(v);
        }
        const purple = (v) => {
            red(v);
            blue(v);
        }
        const cyan = (v) => {
            green(v);
            blue(v);
        }
        const blend = (v1, v2) => {
            return (v1 + v2) / 2;
        }
        const roll = (v) => {
            while (v < 0) {
                v += 100;
            }
            return v % 101;
        };
        const reflect = (v) => {
            while (v < 0) {
                v += 200;
            }
            v = v % 200;
            if (v > 100) {
                const over = v - 100;
                v = 100 - over;
            }
            return v;
        }
        const dist = (ptx, pty) => {
            const dx = x - ptx;
            const dy = y - pty;
            return Math.sqrt(dx * dx + dy * dy);
        }
        const theta = (ptx, pty) => {
            const dx = x - ptx;
            const dy = y - pty;
            return 50 + (50 * Math.atan2(dy, dx) / Math.PI);
        }
        const sin = (c) => {
            return (Math.sin(c * Math.PI / 50) + 1) * 50;
        }
        const cos = (c) => {
            return (Math.cos(c * Math.PI / 50) + 1) * 50;
        }
        const poster = (c, bins) => {
            const count = 101 / (bins - 1);
            return Math.floor((101 + count) / 101 * c / count) * count;
        }
        const rainbow = (c) => {
            const d = 15;
            const o = 100 / 3;
            red(sin((c-d) + o));
            green(sin((c-d) + 0));
            blue(sin((c-d) + 2*o));
        }

        const getColor = () => {
            const [r, g, b] = [redValue, greenValue, blueValue].map(c => {
                const pct = c > 100 ? 100 : c < 0 ? 0 : c;
                const value = parseInt(Math.round(255 * (pct / 100)));
                if (value < 0) {
                    return 0;
                } else if (value > 255) {
                    return 255;
                }
                return value;
            });
            return `rgb(${r}, ${g}, ${b})`;
        }

        let i;
        let j;
        let x;
        let y;

        try {
            const func = new Function("x", "y", "red", "green", "blue", "roll", "reflect", "i", "w", "j", "h", "dist", "theta", "gray", "yellow", "purple", "cyan", "blend", "sin", "cos", "poster", "rainbow", newCode);

            const width = canvas.width;
            const height = canvas.height;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            for (i = 0; i < width; i++) {
                x = 100 * i / (width - 1);
                for (j = 0; j < height; j++) {
                    y = 100 * j / (height - 1);
                    redValue = 0;
                    blueValue = 0;
                    greenValue = 0;
                    func(x, y, red, green, blue, roll, reflect, i, width, j, height, dist, theta, gray, yellow, purple, cyan, blend, sin, cos, poster, rainbow);
                    ctx.fillStyle = getColor();
                    ctx.fillRect(i, j, 1, 1);
                }
            }
        } catch (error) {
            onError(error);
        }
}