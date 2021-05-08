import * as fs from 'fs';
import 'mocha';
import {expect} from 'chai';
import {Database} from '../src/database';
import {Notes, colors} from '../src/notes';

const database = new Database();

describe('Database function test', () => {
  it('Exist an Database object', () => {
    expect(database).not.to.be.equal(null);
  });

  it('database.addNote() on three cases: user exist, user doesn\'t exist, note title taken', () => {
    expect(database.addNote(new Notes('test', 'My test', 'This is a green test', colors.Green))).to.be.equal(true);
    expect(database.addNote(new Notes('test', 'My test 2', 'This is a red test', colors.Red))).to.be.equal(true);
    expect(database.addNote(new Notes('daniel', 'My test', 'This is a yellow test', colors.Yellow))).to.be.equal(true);
    expect(database.addNote(new Notes('test', 'My test', 'This is a blue test', colors.Blue))).to.be.equal(false);
  });

  it('database.modifyNote() on three cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(database.modifyNote(new Notes('test', 'My test', 'This is a red test overwrited', colors.Red))).to.be.equal(true);
    expect(database.modifyNote(new Notes('test', 'Fail', 'This is a green test', colors.Green))).to.be.equal(false);
    expect(database.modifyNote(new Notes('Fail', 'My test', 'This is a green test', colors.Green))).to.be.equal(false);
  });

  it('database.removeNote() on two cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(database.removeNote('daniel', 'My test')).to.be.equal(true);
    expect(database.removeNote('Fail', 'Fail test')).to.be.equal(false);
  });

  it('database.listNotes() returns: test\nMy test\ntest\nMy test 2\n', () => {
    const note1 = new Notes('test', 'My test', 'This is a red test overwrited', colors.Red);
    const note2 = new Notes('test', 'My test 2', 'This is a red test', colors.Red);
    expect(database.listNotes('test')).to.be.eql([note1, note2]);
    expect(database.listNotes('Fail')).to.be.eql([]);
  });

  it('database.readNotes() on two cases: note found, note not found ', () => {
    const note1 = new Notes('test', 'My test', 'This is a red test overwrited', colors.Red);
    expect(database.readNote('test', 'My test')).to.be.eql(note1);
    expect(database.readNote('Fail', 'Fail test')).to.be.equal(null);
  });
});

fs.rmSync('./database', {recursive: true});
