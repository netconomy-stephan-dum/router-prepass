import { Http2ServerRequest } from 'node:http2';
import { text } from 'node:stream/consumers';
import { parse } from 'node:querystring';

const multipart = 'multipart/form-data';

const getPostData = async (request: Http2ServerRequest) => {
  if (request.method.toUpperCase() === 'POST') {
    const data = await text(request);
    if (request.headers['content-type'] === multipart) {
      return JSON.parse(data);
    } else {
      return parse(data);
    }
  }

  return null;
};

export default getPostData;
