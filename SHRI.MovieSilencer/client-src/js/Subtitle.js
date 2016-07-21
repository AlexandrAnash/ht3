class Subtitle {
    constructor(params) {
        this.id = params.id;
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.delay = params.endTime - params.startTime;
        this.message = params.message;
    }
}
export {Subtitle}