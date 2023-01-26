const perlinGradientVectors = [
    // Standard vectors
    [1, 1, 0], [-1, 1, 0],
    [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1],
    [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1],
    [0, 1, -1], [0, -1, -1],
    // Performance vectors
    [1, 1, 0], [-1, 1, 0],
    [0, -1, 1], [0, -1, -1]
]

const perlinPermutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
    103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0,
    26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
    87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55,
    46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132,
    187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109,
    198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126,
    255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183,
    170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
    246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51,
    145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
    176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24,
    72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

class Perlin {
    p;

    constructor(seed) {
        this.p = new Array(512);
        for(let x = 0; x < 512; ++x) {
            this.p[x] = (perlinPermutation[x % 256] + seed) % 256;
        }

    }

    // 3D dot function
    // https://en.wikipedia.org/wiki/Dot_product
    dot(ax, bx, ay, by, az, bz) {
        return ax * bx + ay * by + az * bz;
    }

    // 3D dot gradient vector and directional vector
    grad(hash, x, y, z) {
        let gradientVector = perlinGradientVectors[hash & 0x0f];
        return this.dot(gradientVector[0], gradientVector[1], gradientVector[2], x, y, z);
    }

    // Make a steight line a bit curved
    // https://mrl.cs.nyu.edu/~perlin/paper445.pdf
    fade(t) {
        return 6 * Math.pow(t, 5) - 15 * Math.pow(t, 4) + 10 * Math.pow(t, 3);
    }

    // Linear interpolation function
    // https://en.wikipedia.org/wiki/Linear_interpolation
    lerp(v0, v1, t) {
        return v0 + t * (v1 - v0);
    }

    perlin(x, y, z) {
        let xi = Math.floor(x) & 255;
        let yi = Math.floor(y) & 255;
        let zi = Math.floor(z) & 255;
        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);

        let aaa = this.p[this.p[this.p[xi] + yi] + zi];
        let aba = this.p[this.p[this.p[xi] + yi + 1] + zi];
        let aab = this.p[this.p[this.p[xi] + yi] + zi + 1];
        let abb = this.p[this.p[this.p[xi] + yi + 1] + zi + 1];
        let baa = this.p[this.p[this.p[xi + 1] + yi] + zi];
        let bba = this.p[this.p[this.p[xi + 1] + yi + 1] + zi];
        let bab = this.p[this.p[this.p[xi + 1] + yi] + zi + 1];
        let bbb = this.p[this.p[this.p[xi + 1] + yi + 1] + zi + 1];

        let u = this.fade(xf);
        let v = this.fade(yf);
        let w = this.fade(zf);

        let x1 = this.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
        let x2 = this.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
        let y1 = this.lerp(x1, x2, v);
        x1 = this.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
        x2 = this.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);
        let y2 = this.lerp(x1, x2, v);
    
        return (this.lerp(y1, y2, w) + 1) / 2;
    }

    octavePerlin(x, y, z, octaves, persistence) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        for(let i = 0; i < octaves; ++i) {
            total += this.perlin(x * frequency, y * frequency, z * frequency) * amplitude;
            
            maxValue += amplitude;
            
            amplitude *= persistence;
            frequency *= 2;
        }
        return total / maxValue;
    }
}

module.exports = Perlin;
