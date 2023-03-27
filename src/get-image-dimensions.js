import fs from 'node:fs';

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
export function getImageDimensions(imagePath) {
  const data = fs.readFileSync(imagePath);
  const header = data.toString('hex', 0, 12);
  const type = getImageType(header);

  let width, height;
  switch (type) {
    case 'jpeg':
      const dimensions = getJpegDimensions(data);
      width = dimensions.width;
      height = dimensions.height;
      break;
    case 'png':
      width = data.readUInt32BE(16);
      height = data.readUInt32BE(20);
      break;
    case 'gif':
      width = data.readUInt16LE(6);
      height = data.readUInt16LE(8);
      break;
    case 'webp':
      const vp8Header = data.slice(12, 16).toString('hex');
      if (vp8Header === '9d012a') {
        width = data.readUIntLE(26, 2);
        height = data.readUIntLE(28, 2);
      } else if (vp8Header === '2a012a') {
        const alphaOffset = data.indexOf('414c4641', 20, 'hex');
        if (alphaOffset !== -1) {
          width = data.readUIntLE(26, 2);
          height = data.readUIntLE(alphaOffset + 16, 2);
        }
      }
      break;
    default:
      throw new Error('Unsupported image type');
  }

  return { width, height, type };
}

function getImageType(header) {
  if (header.startsWith('ffd8')) {
    return 'jpeg';
  } else if (header.startsWith('89504e470d0a1a0a')) {
    return 'png';
  } else if (header.startsWith('47494638')) {
    return 'gif';
  } else if (header.startsWith('52494646') && header.endsWith('57454250')) {
    return 'webp';
  } else {
    throw new Error('Unsupported image type');
  }
}

// Copyright (c) 2015 Vitaly Puzrin.

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// Following is extract from probe-image-size library
function getJpegDimensions(data) {
  if (data.length < 2) return;

  // first marker of the file MUST be 0xFFD8,
  // following by either 0xFFE0, 0xFFE2 or 0xFFE3
  if (data[0] !== 0xFF || data[1] !== 0xD8 || data[2] !== 0xFF) return;

  var offset = 2;

  for (;;) {
    // skip until we see 0xFF, see https://github.com/nodeca/probe-image-size/issues/68
    for (;;) {
      if (data.length - offset < 2) return;
      if (data[offset++] === 0xFF) break;
    }

    var code = data[offset++];
    var length;

    // skip padding bytes
    while (code === 0xFF) code = data[offset++];

    // standalone markers, according to JPEG 1992,
    // http://www.w3.org/Graphics/JPEG/itu-t81.pdf, see Table B.1
    if ((0xD0 <= code && code <= 0xD9) || code === 0x01) {
      length = 0;
    } else if (0xC0 <= code && code <= 0xFE) {
      // the rest of the unreserved markers
      if (data.length - offset < 2) return;

      length = readUInt16BE(data, offset) - 2;
      offset += 2;
    } else {
      // unknown markers
      return;
    }

    if (code === 0xD9 /* EOI */ || code === 0xDA /* SOS */) {
      // end of the datastream
      return;
    }

    if (length >= 5 &&
        (0xC0 <= code && code <= 0xCF) &&
        code !== 0xC4 && code !== 0xC8 && code !== 0xCC) {

      if (data.length - offset < length) return;

      var result = {
        width:  readUInt16BE(data, offset + 3),
        height: readUInt16BE(data, offset + 1),
      };

      return result;
    }

    offset += length;
  }
}

function readUInt16BE(data, offset) {
  return data[offset + 1] | (data[offset] << 8);
};