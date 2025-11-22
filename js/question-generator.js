import { Question } from './question.js';

export class QuestionGenerator {
    constructor() {
        this.consecutiveCorrects = 0;
    }

    generate(difficultyBase) {
        const base = (difficultyBase || "facil").toLowerCase();
        let q = null, attempts = 0;
        do {
            q = this.generateForBase(base);
            attempts++;
            if (attempts > 200) break;
        } while (this.isMultiplicationQuestion(q) && Math.abs(q.answer) > 100);
        return q;
    }

    generateForBase(base) {
        if (base === "infinito") {
            if (this.consecutiveCorrects < 5) return this.generateMedium();
            else if (this.consecutiveCorrects < 10) return this.generateHard();
            else return this.generateInsane();
        }
        switch (base) {
            case "facil":
                if (this.consecutiveCorrects < 3) return this.generateEasy();
                else if (this.consecutiveCorrects < 7) return this.generateMedium();
                else if (this.consecutiveCorrects < 12) return this.generateHard();
                else return this.generateInsane();
            case "medio":
                if (this.consecutiveCorrects < 2) return this.generateMedium();
                else if (this.consecutiveCorrects < 6) return this.generateHard();
                else return this.generateInsane();
            case "dificil":
                if (this.consecutiveCorrects < 3) return this.generateHard();
                else return this.generateInsane();
            default:
                return this.generateEasy();
        }
    }

    recordAnswer(correct) {
        if (correct) this.consecutiveCorrects++;
        else this.consecutiveCorrects = 0;
    }
    resetProgress() { this.consecutiveCorrects = 0; }

    generateEasy() {
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        if (Math.random() < 0.5) {
            return new Question(`${a} + ${b} ?`, a + b);
        } else {
            if (a < b) [a, b] = [b, a];
            return new Question(`${a} - ${b} ?`, a - b);
        }
    }
    generateMedium() {
        let op = Math.floor(Math.random() * 3);
        if (op === 0) {
            let a = Math.floor(Math.random() * 50) + 1;
            let b = Math.floor(Math.random() * 50) + 1;
            return new Question(`${a} + ${b} ?`, a + b);
        } else if (op === 1) {
            let a = Math.floor(Math.random() * 50) + 1;
            let b = Math.floor(Math.random() * 50) + 1;
            if (a < b) [a, b] = [b, a];
            return new Question(`${a} - ${b} ?`, a - b);
        } else {
            let a = Math.floor(Math.random() * 12) + 1;
            let b = Math.floor(Math.random() * 10) + 1;
            let attempts = 0;
            while (a * b > 100 && attempts < 50) {
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                attempts++;
            }
            return new Question(`${a} × ${b} ?`, a * b);
        }
    }
    generateHard() {
        let op = Math.floor(Math.random() * 3);
        if (op === 0) {
            let a = Math.floor(Math.random() * 120) + 1;
            let b = Math.floor(Math.random() * 120) + 1;
            if (Math.random() < 0.5) return new Question(`${a} + ${b} ?`, a + b);
            if (a < b) [a, b] = [b, a];
            return new Question(`${a} - ${b} ?`, a - b);
        } else if (op === 1) {
            let d = Math.floor(Math.random() * 12) + 1;
            let q = Math.floor(Math.random() * 12) + 1;
            let a = q * d;
            return new Question(`${a} ÷ ${d} ?`, q);
        } else {
            let attempts = 0, a, b;
            do {
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                attempts++;
            } while ((a * b > 100) && attempts < 200);
            return new Question(`${a} × ${b} ?`, a * b);
        }
    }
    generateInsane() {
        let op = Math.floor(Math.random() * 3);
        if (op === 0) {
            let a = Math.floor(Math.random() * 200) + 1;
            let b = Math.floor(Math.random() * 200) + 1;
            return new Question(`${a} + ${b} ?`, a + b);
        } else if (op === 1) {
            let d = Math.floor(Math.random() * 15) + 1;
            let q = Math.floor(Math.random() * 20) + 1;
            let a = q * d;
            return new Question(`${a} ÷ ${d} ?`, q);
        } else {
            let attempts = 0, a, b;
            do {
                a = Math.floor(Math.random() * 15) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                attempts++;
            } while ((a * b > 100) && attempts < 300);
            return new Question(`${a} × ${b} ?`, a * b);
        }
    }
    isMultiplicationQuestion(q) {
        if (!q || !q.text) return false;
        const t = q.text.toLowerCase();
        return t.includes("x") || t.includes("×") || t.includes("*") || t.includes("multiplic");
    }
}