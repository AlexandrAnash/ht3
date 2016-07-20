import {Subtitle} from './Subtitle';

const SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

class SubtitlesFactory {
    loadSubtitles(stringLoad) {
        return fetch(stringLoad)
            .then((responce) => {
                return responce.text();
            })
            .then((data) => {
                let subtitles = [];
                let srt = data.replace(/\r\n|\r|\n/g, '\n');
                let count = 0;
                const arrayStringSubtitles = srt.split('\n\n');
                for (var i = 0; i < arrayStringSubtitles.length; i++) {
                    const subparts = arrayStringSubtitles[i].split('\n');
                    if(subparts.length > 2) {
                        subtitles[count] = this.formattedToSubtitle(subparts);
                    }
                    count++;
                }
                return subtitles;
            });
    }

    timeParser(timeString) {
        const chunks = timeString.split(':');
        const secondChunks = chunks[2].split(',');
        const hours = parseInt(chunks[0], 10);
        const minutes = parseInt(chunks[1], 10);
        const seconds = parseInt(secondChunks[0], 10);
        const milliSeconds = parseInt(secondChunks[1], 10);
        return HOUR * hours +
            MINUTE * minutes +
            SECOND * seconds +
            milliSeconds;
    }
    formattedToSubtitle(subparts) {
        const id = subparts[0];
        const startTime = subparts[1].split(' --> ')[0];
        const endTime = subparts[1].split(' --> ')[1];
        let message = subparts[2];
        if (subparts.length > 3) {
            for (var j = 3; j < subparts.length; j++) {
                message += '\n' + subparts[j];
            }
        }
        return new Subtitle({
            id: id,
            timerStart: this.timeParser(startTime),
            timerEnd: this.timeParser(endTime),
            message: message
        });
    }
}
export {SubtitlesFactory}