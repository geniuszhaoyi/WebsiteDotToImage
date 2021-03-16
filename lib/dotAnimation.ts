
export default class Animation<T> {

    isAnimationStarted: boolean = false;

    frameQueue: T[] = [];

    callback: (t: T) => void;

    constructor(callback: (t: T) => void) {
        this.setCallback(callback);
    }

    setCallback(callback: (t: T) => void) {
        this.callback = callback;
    }

    start() {
        if (!this.isAnimationStarted) {
            this.isAnimationStarted = true;

            const looping = () => {
                if (this.isAnimationStarted) {
                    if (this.frameQueue.length > 0) {
                        const currentFrame: T = this.frameQueue.shift();
                        this.callback(currentFrame);
                    }
                    requestAnimationFrame(looping);
                }
            }

            looping();
        }
    }

    stop() {
        this.isAnimationStarted = false;
    }

    pushFrame(frame: T) {
        this.frameQueue.push(frame);
    }

    clearFrames() {
        this.frameQueue = []
    }
}