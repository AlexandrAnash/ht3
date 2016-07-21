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
                let srt = data.replace(/\r\n|\r|\n/g, '\n');
                return srt 
                    .split('\n\n')
                    .map((subItem) => this.formattedToSubtitle(subItem));
            });
    }

    formattedToSubtitle(data) {
        const subparts = data.split('\n');
        let time = subparts[1].split(' --> ').map((t) => this.timeParser(t));
        return new Subtitle({
            id: subparts[0],
            startTime: time[0],
            endTime: time[1],
            message: subparts.slice(2).join('\n')
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
}
export {SubtitlesFactory}