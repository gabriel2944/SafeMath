export class Player {
    constructor(maxHealth) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    getHealth() { return this.health; }
    getMaxHealth() { return this.maxHealth; }

    takeDamage(dmg) {
        this.health -= dmg;
        if (this.health < 0) this.health = 0;
    }

    isAlive() { return this.health > 0; }
    healFull() { this.health = this.maxHealth; }
}