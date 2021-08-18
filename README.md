# iterable-readablestream-polyfill

Minimal iterable `ReadableStream` polyfill.

For full stream-api polyfill, you may need https://github.com/MattiasBuelens/web-streams-polyfill

# Spec

https://streams.spec.whatwg.org/#rs-asynciterator

# Usage

```ts
const stream = new ReadableStream<number>({
  async start(controller) {
    for (let i = 0; i < 5; ++i) {
      controller.enqueue(i)
    }
  }
});

for await (const x of stream) {
  console.log(x);
}
```

# License

MIT
