import { Animal } from './animal.js';
import { Boss } from './boss.js';
import { Player } from './player.js';
import { QuestionGenerator } from './question-generator.js';

export class Game {
    constructor(mode = 'Matematica') {
        this.animals = [
            new Animal("Coelho", 10),
            new Animal("Gato", 20),
            new Animal("Cao", 30),
            new Animal("Leão", 40),
            new Animal("Tigre", 50)
        ];
        this.currentAnimal = this.animals[0];
        this.mode = mode;
        this.player = new Player(200);
        this.qGen = new QuestionGenerator();
        this.arcadeStage = 0;
        this.isPlayerTurnFlag = true;

        this.spawnBoss();
    }

    spawnBoss() {
        let vida = 0;
        switch (this.mode) {
            case "Matematica": vida = this.currentAnimal.force * 3; break;
            case "Arcade":
                if (this.arcadeStage === 0) vida = 200;
                else if (this.arcadeStage === 1) vida = 300;
                else vida = 400;
                break;
            case "Infinito": vida = 999999; break;
        }
        this.currentBoss = new Boss("Chefe", vida);
        this.qGen.resetProgress();
    }

    togglePlayerTurn() { this.isPlayerTurnFlag = !this.isPlayerTurnFlag; }
    isPlayerTurn() { return this.isPlayerTurnFlag; }

    difficultyForMode() {
        switch (this.mode) {
            case "Matematica": return "facil";
            case "Arcade": return "medio";
            case "Infinito": return "infinito";
            default: return "facil";
        }
    }

    checkBossDefeat() {
        if (this.currentBoss && !this.currentBoss.isAlive()) {
            if (this.mode === "Matematica") {
                let index = this.animals.indexOf(this.currentAnimal);
                if (index < this.animals.length - 1) {
                    this.currentAnimal = this.animals[index + 1];
                    this.spawnBoss();
                    return "desbloqueou";
                } else {
                    return "vitoria";
                }
            } else if (this.mode === "Arcade") {
                this.arcadeStage++;
                if (this.arcadeStage < 3) {
                    this.spawnBoss();
                    return "proximo";
                } else {
                    return "vitoria";
                }
            } else if (this.mode === "Infinito") {
                this.spawnBoss();
                return "infinito";
            }
        }
        return null;
    }

    getRandomDamage(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    decrementAllCooldowns() {
        this.animals.forEach(a => a.decrementCooldown());
    }
}