
export default class LoopingEngine {
    startTimestamp: number;
    isStarted: boolean = false;

    constructor(public cb: (timestamp: number) => void) {
    }

    start() {
        if (!this.isStarted) {
            this.startTimestamp = Date.now();
            this.isStarted = true;

            const looping = () => {
                if (this.isStarted) {
                    this.cb(Date.now());
                    requestAnimationFrame(looping);
                }
            }

            looping();
            return true;
        }
        return false;
    }

    terminate() {
        if (this.isStarted) {
            this.isStarted = false;
            return true;
        }
        return false;
    }
}