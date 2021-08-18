interface ReadableStreamIteratorOptions {
  preventCancel?: boolean;
}

interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): ReadableStreamAsyncIterator<R>;
  values(options?: ReadableStreamIteratorOptions): ReadableStreamAsyncIterator<R>;
}

interface ReadableStreamAsyncIterator<R> extends AsyncIterableIterator<R> {
  [Symbol.asyncIterator](): ReadableStreamAsyncIterator<R>;
}
