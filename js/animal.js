export class Animal {
    constructor(name, force) {
        this.name = name;
        this.force = force;
        this.cooldown = 0;
    }

    canAttack() {
        return this.cooldown === 0;
    }

    decrementCooldown() {
        if (this.cooldown > 0) this.cooldown--;
        else this.cooldown = 0;
    }
}