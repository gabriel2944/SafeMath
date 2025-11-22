export class Boss {
    constructor(name, health) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
    }

    takeDamage(dmg) {
        this.health -= dmg;
        if (this.health < 0) this.health = 0;
    }

    isAlive() {
        return this.health > 0;
    }
}