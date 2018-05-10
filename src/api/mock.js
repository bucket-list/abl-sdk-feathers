import quote from './pricing-quote';
import activity from './activity';
import event from './event';
import timeslot from './timeslot'

const $ablMock = {
    activity: activity,
    event: event,
    timeslot: timeslot,
    'pricing-quote': quote
}

window.$ablMock = $ablMock;
