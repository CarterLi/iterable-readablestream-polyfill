if (!ReadableStream.prototype[Symbol.asyncIterator]) {
  function ReadableStreamAsyncIterator(reader, options) {
    this._reader = reader;
    this._preventCancel = !!options.preventCancel;
  }

  ReadableStreamAsyncIterator.prototype = {
    __proto__: Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype),
    next() {
      /** @type {ReadableStreamDefaultReader} */
      const reader = this._reader;
      if (!reader) return Promise.resolve({ done: true, value: undefined });
      return this._readRequest = reader.read().then(result => {
        if (result.done) {
          reader.releaseLock();
          this._reader = null;
        }
        return result;
      }, e => {
        reader.releaseLock();
        this._reader = null;
        return Promise.reject(e);
      });
    },
    async return(value) {
      /** @type {ReadableStreamDefaultReader} */
      const reader = this._reader;
      if (reader) {
        this._reader = null;
        if (this._readRequest) await this._readRequest.catch(Boolean);
        if (!this._preventCancel) {
          const result = reader.cancel(value);
          reader.releaseLock();
          await result;
        } else {
          reader.releaseLock();
        }
      }
      return { done: true, value };
    },
    [Symbol.asyncIterator]() { return this; },
  };

  Object.defineProperties(ReadableStream.prototype, {
    [Symbol.asyncIterator]: {
      enumerable: false,
      configurable: true,
      value() {
        return new ReadableStreamAsyncIterator(this.getReader(), {});
      },
    },
    values: {
      enumerable: false,
      configurable: true,
      value(options = {}) {
        return new ReadableStreamAsyncIterator(this.getReader(), options);
      },
    },
  });
}
