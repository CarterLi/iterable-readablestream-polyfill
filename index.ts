interface ReadableStreamIteratorOptions {
  preventCancel?: boolean;
}

interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncGenerator<R>;
  values(options?: ReadableStreamIteratorOptions): AsyncGenerator<R>;
}

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
      value<R>(this: ReadableStream<R>, options: ReadableStreamIteratorOptions = {}) {
        let reader: ReadableStreamDefaultReader<R> | null = this.getReader();

        return {
          next() {
            if (!reader) return Promise.resolve({ done: true, value: undefined });
            return reader.read();
          },
          async return(value) {
            if (reader) {
              if (!options.preventCancel) await reader.cancel(value);
              reader = null;
            }
            return { done: true, value: undefined };
          },
          [Symbol.asyncIterator]() { return this; },
        } as AsyncGenerator<R>;
      },
    }
  })
}
