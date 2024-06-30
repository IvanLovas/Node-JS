const https = require('https');

class EventEmitter {
    constructor() {
        this.listeners = {};  // key-value pair
    }

    addListener(eventName, fn) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(fn);
    }

    on(eventName, fn) {
        this.addListener(eventName, fn);
    }

    removeListener(eventName, fn) {
        if (!this.listeners[eventName]) return;

        this.listeners[eventName] = this.listeners[eventName].filter(listener => listener !== fn);
    }

    off(eventName, fn) {
        this.removeListener(eventName, fn);
    }

    once(eventName, fn) {
        const onceWrapper = (...args) => {
            fn(...args);
            this.off(eventName, onceWrapper);
        };
        this.on(eventName, onceWrapper);
    }

    emit(eventName, ...args) {
        if (!this.listeners[eventName]) return;

        this.listeners[eventName].forEach(listener => {
            listener(...args);
        });
    }

    listenerCount(eventName) {
        return this.listeners[eventName] ? this.listeners[eventName].length : 0;
    }

    rawListeners(eventName) {
        return this.listeners[eventName] || [];
    }
}

class WithTime extends EventEmitter {
    execute(asyncFunc, ...args) {
        this.emit('begin');
        const start = Date.now();
        asyncFunc(...args, (error, data) => {
            if (error) {
                this.emit('error', error);
                return;
            }
            const end = Date.now();
            const duration = end - start;
            this.emit('end', data);
            console.log(`Execution time: ${duration}ms`);
        });
    }
}

const fetchFromUrl = (url, cb) => {
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            cb(null, JSON.parse(data));
        });
    }).on('error', (error) => {
        cb(error, null);
    });
};

// Test code for Task 2
const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', (data) => console.log('Done with execute', data));
withTime.on('error', (error) => console.log('Error occurred:', error));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners('end'));