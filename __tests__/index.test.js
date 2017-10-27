/** @flow */

import greeter from '../src/main';

describe('greeter function', () => {
  // Read more: https://facebook.github.io/jest/docs/api.html#jestusefaketimers
  jest.useFakeTimers();

  let hello;

  // Act before assertions
  beforeAll(async () => {
    const p = greeter('John');
    jest.runOnlyPendingTimers();
    hello = await p;
  });

  // Assert if setTimeout was called properly
  it('delays the greeting by 2 seconds', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(2000);
  });

  // Assert greeter result
  it('greets a user with `Hello, {name}` message', () => {
    expect(hello).toBe('Hello, John');
  });
});
