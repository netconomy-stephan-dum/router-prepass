import { createBrotliCompress, createGzip, createDeflate, constants } from 'node:zlib';
import { Readable } from 'stream';
import { Http2ServerResponse } from 'node:http2';

const { Z_PARTIAL_FLUSH } = constants;

const compressOptions = {
  flush: Z_PARTIAL_FLUSH,
};

const compress = (
  rawAcceptEncoding: string | string[],
  stream: Readable,
  response: Http2ServerResponse,
) => {
  const acceptEncoding = Array.isArray(rawAcceptEncoding)
    ? rawAcceptEncoding
    : rawAcceptEncoding.split(/,\s*/);

  // this simply takes to long in dev mode
  if (acceptEncoding.includes('br')) {
    response.setHeader('Content-Encoding', 'br');
    return stream.pipe(createBrotliCompress(compressOptions)).pipe(response);
  }
  if (acceptEncoding.includes('gzip')) {
    response.setHeader('Content-Encoding', 'gzip');
    return stream.pipe(createGzip(compressOptions)).pipe(response);
  }
  if (acceptEncoding.includes('deflate')) {
    response.setHeader('Content-Encoding', 'deflate');
    return stream.pipe(createDeflate(compressOptions)).pipe(response);
  }

  return stream.pipe(response);
};

export default compress;
