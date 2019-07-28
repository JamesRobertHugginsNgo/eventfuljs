/* global eventfulPropertyDescriptors */

console.log('--- START ---');

const eventful1 = Object.defineProperties({}, eventfulPropertyDescriptors);

eventful1.on('event1', function(...args) {
	console.log('ON EVENT 1', ...args, this);
});

eventful1.on('event1', function(...args) {
	console.log('ON EVENT 1 B ONCE', ...args, this);
}, true);

const eventful1_handler = function(...args) {
	console.log('ON EVENT 1 C', ...args, this);
};
eventful1.on('event1', eventful1_handler);

eventful1.on('event2', function(...args) {
	console.log('ON EVENT 2', ...args, this);
});

eventful1.trigger('event1');
eventful1.trigger('event2');
eventful1.trigger('event1');

console.log('---');
eventful1.off('event1', eventful1_handler);
eventful1.off('event2');

eventful1.trigger('event1');
eventful1.trigger('event2');

console.log('---');
const eventful2 = Object.defineProperties({}, eventfulPropertyDescriptors);
eventful2.listenTo(eventful1, 'event1', function(...args) {
	console.log('ON EVENT 1 BY EVENTFUL 2', ...args, this);
})

eventful1.trigger('event1');
eventful1.trigger('event2');

console.log('--- END ---');
