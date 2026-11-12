
class LCG {
    constructor(seed, params) {
        this.params = params;
        this.state = BigInt(seed) & params.mask;
    }

    nextState() {
        const p = this.params;

        this.state = (
            this.state * p.multiplier + p.addend
        ) & p.mask;

        return this.state;
    }

    next() {
        const state = this.nextState();

        return state >> BigInt(
            this.params.stateBits - this.params.outputBits
        );
    }

    getState() {
        return this.state;
    }
}
