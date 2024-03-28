
class CalcPixel {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._redValue = 0;
        this._greenValue = 0;
        this._blueValue = 0;
    }

    _reset(x, y) {
        this._x = x;
        this._y = y;
        this._redValue = 0;
        this._greenValue = 0;
        this._blueValue = 0;
    }

    _getColor() {
        const [r, g, b] = [this._redValue, this._greenValue, this._blueValue].map(c => {
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

    color() {
        return [this._redValue, this._greenValue, this._blueValue];
    }

    red(c) {
        this._redValue = c;
        return this.color();
    }
    green(c) {
        this._greenValue = c;
        return this.color();
    }
    blue(c) {
        this._blueValue = c;
        return this.color();
    }
    gray(v) {
        this.red(v);
        this.green(v);
        this.blue(v);
        return this.color();
    }
    yellow(v) {
        this.red(v);
        this.green(v);
        return this.color();
    }
    purple(v) {
        this.red(v);
        this.blue(v);
        return this.color();
    }
    cyan(v) {
        this.green(v);
        this.blue(v);
        return this.color();
    }
    rainbow(c) {
        const d = 15;
        const o = 100 / 3;
        this.red(this.sin((c - d) + o));
        this.green(this.sin((c - d) + 0));
        this.blue(this.sin((c - d) + 2 * o));
        return this.color();
    }
    roll(v) {
        while (v < 0) {
            v += 100;
        }
        return v % 101;
    };
    reflect(v) {
        v = v * 2;
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
    dist(ptx, pty) {
        const dx = this._x - ptx;
        const dy = this._y - pty;
        return Math.sqrt(dx * dx + dy * dy);
    }
    theta(ptx, pty) {
        const dx = this._x - ptx;
        const dy = this._y - pty;
        return 50 + (50 * Math.atan2(dy, dx) / Math.PI);
    }
    sin(c) {
        return (Math.sin(c * Math.PI / 50) + 1) * 50;
    }
    cos(c) {
        return (Math.cos(c * Math.PI / 50) + 1) * 50;
    }
    poster(c, bins) {
        const count = 101 / (bins - 1);
        return Math.floor((101 + count) / 101 * c / count) * count;
    }
}
CalcPixel.getApi = (inst) => {
    return Object.getOwnPropertyNames(CalcPixel.prototype)
        .filter(k => !k.startsWith("_"))
        .map(k => [k, inst[k].bind(inst)]);
}

function drawCanvas(newCode, canvas, onError) {
    let i;
    let j;
    let x;
    let y;

    try {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);

        const calc = new CalcPixel();
        const api = CalcPixel.getApi(calc);
        const apiNames = api.map(([k, _v]) => k);
        const apiArgs = api.map(([_k, v]) => v);
        const func = new Function("x", "y", "i", "j", "w", "h", ...apiNames, newCode);
        for (i = 0; i < width; i++) {
            x = 100 * i / (width - 1);
            for (j = 0; j < height; j++) {
                y = 100 * j / (height - 1);
                calc._reset(x, y);
                const args = [x, y, i, j, width, height, ...apiArgs];
                func(...args);
                ctx.fillStyle = calc._getColor();
                ctx.fillRect(i, j, 1, 1);
            }
        }
    } catch (error) {
        onError(error);
    }
}