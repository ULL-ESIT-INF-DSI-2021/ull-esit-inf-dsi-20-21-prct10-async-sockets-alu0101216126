import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/eventEmitterClient';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const emitter = new EventEmitter();
    const client = new MessageEventEmitterClient(emitter);

    client.on('message', (message) => {
      expect(message).to.be.eql({"title": "Red note ", "body": "This is a red note overwrited", "color": "red"});
      done();
    });

    emitter.emit('data', '{"title": "Red note ", "body": "This is a red note overwrited"');
    emitter.emit('data', ', "color": "red"}');
    emitter.emit('end');
  });
});
