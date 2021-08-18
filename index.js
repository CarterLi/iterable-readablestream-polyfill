"use strict";
if (!ReadableStream.prototype[Symbol.asyncIterator]) {
    Object.defineProperties(ReadableStream.prototype, {
        [Symbol.asyncIterator]: {
            enumerable: false,
            configurable: true,
            value() { return this.values(); },
        },
        values: {
            enumerable: false,
            configurable: true,
            value(options = {}) {
                let reader = this.getReader();
                return {
                    next() {
                        if (!reader)
                            return Promise.resolve({ done: true, value: undefined });
                        return reader.read();
                    },
                    async return(value) {
                        if (reader) {
                            if (!options.preventCancel)
                                await reader.cancel(value);
                            reader = null;
                        }
                        return { done: true, value: undefined };
                    },
                    [Symbol.asyncIterator]() { return this; },
                };
            },
        }
    });
}
//# sourceMappingURL=index.js.map