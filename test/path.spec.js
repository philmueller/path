import { relativeToFile, join, parseQueryString, buildQueryString } from '../src/index';

describe('relativeToFile', () => {
  it('can make a dot path relative to a simple file', () => {
    var file = 'some/file.html';
    var path = './other/module';

    expect(relativeToFile(path, file)).toBe('some/other/module');
  });

  it('can make a dot path relative to an absolute file', () => {
    var file = 'http://durandal.io/some/file.html';
    var path = './other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/some/other/module');
  });

  it('can make a double dot path relative to an absolute file', () => {
    var file = 'http://durandal.io/some/file.html';
    var path = '../other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/other/module');
  });

  it('returns path if null file provided', () => {
    var file = null;
    var path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });

  it('returns path if empty file provided', () => {
    var file = '';
    var path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });
});

describe('join', () => {
  it('can combine two simple paths', () => {
    var path1 = 'one';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('can combine an absolute path and a simple path', () => {
    var path1 = '/one';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine an absolute path and a simple path with slash', () => {
    var path1 = '/one';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine a single slash and a simple path', () => {
    var path1 = '/';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine a single slash and a simple path with slash', () => {
    var path1 = '/';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine an absolute path with protocol and a simple path', () => {
    var path1 = 'http://durandal.io';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path with protocol and a simple path with slash', () => {
    var path1 = 'http://durandal.io';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path and a simple path with a dot', () => {
    var path1 = 'http://durandal.io';
    var path2 = './two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a simple path and a relative path', () => {
    var path1 = 'one';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('two');
  });

  it('can combine an absolute path and a relative path', () => {
    var path1 = 'http://durandal.io/somewhere';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path', () => {
    var path1 = '//durandal.io';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with slash', () => {
    var path1 = '//durandal.io';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with a dot', () => {
    var path1 = '//durandal.io';
    var path2 = './two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a relative path', () => {
    var path1 = '//durandal.io/somewhere';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a complex path and a relative path', () => {
    var path1 = 'one/three';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('returns path2 if path1 null', () => {
    var path1 = null;
    var path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path2 if path1 empty', () => {
    var path1 = '';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path1 if path2 null', () => {
    var path1 = 'one';
    var path2 = null;

    expect(join(path1, path2)).toBe('one');
  });

  it('returns path1 if path2 empty', () => {
    var path1 = 'one';
    var path2 = '';

    expect(join(path1, path2)).toBe('one');
  });
  it('should respect a trailing slash', () => {
    var path1 = 'one/';
    var path2 = 'two/';

    expect(join(path1, path2)).toBe('one/two/');
  });
});

describe('query strings', () => {
  it('should build query strings', () => {
    let gen = buildQueryString;

    expect(gen()).toBe('');
    expect(gen(null)).toBe('');
    expect(gen({})).toBe('');
    expect(gen({ a: null })).toBe('');

    expect(gen({ '': 'a' })).toBe('=a');
    expect(gen({ a: 'b' })).toBe('a=b');
    expect(gen({ a: 'b', c: 'd' })).toBe('a=b&c=d');
    expect(gen({ a: 'b', c: null })).toBe('a=b');

    expect(gen({ a: [ 'b', 'c' ]})).toBe('a[]=b&a[]=c');
    expect(gen({ '&': [ 'b', 'c' ]})).toBe('%26[]=b&%26[]=c');

    expect(gen({ a: '&' })).toBe('a=%26');
    expect(gen({ '&': 'a' })).toBe('%26=a');
    expect(gen({ a: true })).toBe('a=true');
    expect(gen({ '$test': true })).toBe('$test=true');
  });

  it('should parse query strings', () => {
    let parse = parseQueryString;

    expect(parse('')).toEqual({});
    expect(parse('=')).toEqual({});
    expect(parse('&')).toEqual({});
    expect(parse('?')).toEqual({});

    expect(parse('a')).toEqual({ a: true });
    expect(parse('a&b')).toEqual({ a: true, b: true });
    expect(parse('a=')).toEqual({ a: '' });
    expect(parse('a=&b=')).toEqual({ a: '', b: '' });

    expect(parse('a=b')).toEqual({ a: 'b' });
    expect(parse('a=b&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&a=c')).toEqual({ a: 'c' });

    expect(parse('a=%26')).toEqual({ a: '&' });
    expect(parse('%26=a')).toEqual({ '&': 'a' });
    expect(parse('%26[]=b&%26[]=c')).toEqual({ '&': [ 'b', 'c' ]});
  });
});