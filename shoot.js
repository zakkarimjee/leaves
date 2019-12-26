/// <reference path="./p5.global-mode.d.ts" />

class Shoot {
    constructor(strength, direction, loc = [0, 0], col = 32, oam = 35, oas = 5, dr = 0.03, oc = 0.05, depth=1, dmax=4) {
        this.strength = clone(strength)
        this.direction = clone(direction)
        this.loc = clone(loc)
        this.prev_loc = clone(loc)
        this.scol = clone(col)
        this.depth = clone(depth)
        this.max_depth = dmax
        this.decay_rate = clone(dr)
        this.offshoot_chance = clone(oc)
        this.offshoot_angle_mean = radians(oam)
        this.offshoot_angle_sd = radians(oas)
        this.offshoots = []
    }

    tick(timestep) {
        if (this.loc[0] <= width && this.loc[0] >= 0 & this.loc[1] <= height && this.loc[1] >= 0) {
            this.strength = this.strength * (1 - this.decay_rate)
            this.sprout(timestep)
            this.rotate((1 - 2 * Math.random()) * 2 * Math.PI / 180)
            this.move(timestep)
            this.draw()
        }
        this.offshoots.forEach(s => s.tick(timestep))
    }

    sprout(timestep) {
        if (this.depth < this.max_depth) {
            if (Math.random() < timestep * this.offshoot_chance * this.strength) {
                let angle = random([-1,1])*randomGaussian(this.offshoot_angle_mean,this.offshoot_angle_sd)
                let x = clone(this.direction[0])
                let y = clone(this.direction[1])
                let xnew = x * cos(angle) - y * sin(angle)
                let ynew = x * sin(angle) + y * cos(angle)
                var new_shoot = new Shoot(this.strength,[xnew,ynew],this.loc,this.depth+1,this.scol+32) // it's because these are all references
                print("Sprout",angle)
                this.offshoots.push(new_shoot)
                print(this.offshoots)

            }
        }
    }

    rotate(angle) {
        let x = clone(this.direction[0])
        let y = clone(this.direction[1])
        this.direction[0] = x * cos(angle) - y * sin(angle)
        this.direction[1] = x * sin(angle) + y * cos(angle)

    }

    move(timestep) {
        this.prev_loc = clone(this.loc)
        var ilist = [0, 1]
        ilist.forEach(i => {
            this.loc[i] = this.loc[i] + this.direction[i] * timestep
        });
    }

    draw() {
        stroke(136,128,min(this.scol,255))
        strokeWeight(3 * this.strength)
        line(this.prev_loc[0], this.prev_loc[1], this.loc[0], this.loc[1])
    }

}


function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
