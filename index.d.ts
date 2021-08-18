interface ReadableStreamIteratorOptions {
    preventCancel?: boolean;
}
interface ReadableStream<R = any> {
    [Symbol.asyncIterator](): AsyncGenerator<R>;
    values(options?: ReadableStreamIteratorOptions): AsyncGenerator<R>;
}
