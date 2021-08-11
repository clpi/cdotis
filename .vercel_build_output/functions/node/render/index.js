var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil("");
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil("");
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = (h["content-type"] || "").split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding = h["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding).decode(data));
      }
      fulfil(data);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page: page2
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
var css$g = {
  code: "#svelte-announcer.svelte-10znh1w{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\nimport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n// stores\\nexport let stores;\\nexport let page;\\n\\nexport let components;\\nexport let props_0 = null;\\nexport let props_1 = null;\\nexport let props_2 = null;\\n\\nsetContext('__svelte__', stores);\\n\\n$: stores.page.set(page);\\nafterUpdate(stores.page.notify);\\n\\nlet mounted = false;\\nlet navigated = false;\\nlet title = null;\\n\\nonMount(() => {\\n\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\tif (mounted) {\\n\\t\\t\\tnavigated = true;\\n\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t}\\n\\t});\\n\\n\\tmounted = true;\\n\\treturn unsubscribe;\\n});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n#svelte-announcer {\\n\\tposition: absolute;\\n\\tleft: 0;\\n\\ttop: 0;\\n\\tclip: rect(0 0 0 0);\\n\\tclip-path: inset(50%);\\n\\toverflow: hidden;\\n\\twhite-space: nowrap;\\n\\twidth: 1px;\\n\\theight: 1px;\\n}\\n</style>"],"names":[],"mappings":"AAsDA,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$g);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-10znh1w"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y7J10NG6D1"><\/script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Y7J10NG6D1');
<\/script>
		` + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-8e8a8f62.js",
      css: ["/./_app/assets/start-c550a47d.css"],
      js: ["/./_app/start-8e8a8f62.js", "/./_app/chunks/vendor-0540047a.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "swappy-20210729_134838.png", "size": 488459, "type": "image/png" }, { "file": "swappy-20210729_135416.png", "size": 556530, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/resources\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/resources/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/links\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/links/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/posts/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/tag\/([^/]+?)\/?$/,
      params: (m) => ({ tag: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/posts/tag/[tag].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/posts/[slug].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/login\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/login.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/uses\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/uses.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/frontend\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/frontend/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/laptops\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/laptops.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/updates\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/updates.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/plangs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/plangs.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/lab\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/lab/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/p/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/recollection\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/p/recollection/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/iz\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/p/iz/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/iz\/docs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/p/iz/docs.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$b;
  }),
  "src/routes/resources/index.svelte": () => Promise.resolve().then(function() {
    return index$a;
  }),
  "src/routes/about/index.svelte": () => Promise.resolve().then(function() {
    return index$9;
  }),
  "src/routes/links/index.svelte": () => Promise.resolve().then(function() {
    return index$8;
  }),
  "src/routes/posts/index.svelte": () => Promise.resolve().then(function() {
    return index$7;
  }),
  "src/routes/posts/tag/[tag].svelte": () => Promise.resolve().then(function() {
    return _tag_;
  }),
  "src/routes/posts/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  }),
  "src/routes/auth/index.svelte": () => Promise.resolve().then(function() {
    return index$6;
  }),
  "src/routes/auth/login.svelte": () => Promise.resolve().then(function() {
    return login;
  }),
  "src/routes/uses.svelte": () => Promise.resolve().then(function() {
    return uses;
  }),
  "src/routes/etc/index.svelte": () => Promise.resolve().then(function() {
    return index$5;
  }),
  "src/routes/etc/frontend/index.svelte": () => Promise.resolve().then(function() {
    return index$4;
  }),
  "src/routes/etc/laptops.svelte": () => Promise.resolve().then(function() {
    return laptops;
  }),
  "src/routes/etc/updates.svelte": () => Promise.resolve().then(function() {
    return updates;
  }),
  "src/routes/etc/plangs.svelte": () => Promise.resolve().then(function() {
    return plangs;
  }),
  "src/routes/lab/index.svelte": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/p/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/p/recollection/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/p/iz/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/p/iz/docs.svelte": () => Promise.resolve().then(function() {
    return docs;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-ca9d4127.js", "css": ["/./_app/assets/pages/__layout.svelte-250fb46f.css"], "js": ["/./_app/pages/__layout.svelte-ca9d4127.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-498a627c.js", "css": [], "js": ["/./_app/error.svelte-498a627c.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-226788b4.js", "css": ["/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/index.svelte-226788b4.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/resources/index.svelte": { "entry": "/./_app/pages/resources/index.svelte-ff8a283a.js", "css": [], "js": ["/./_app/pages/resources/index.svelte-ff8a283a.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/about/index.svelte": { "entry": "/./_app/pages/about/index.svelte-892a24c7.js", "css": ["/./_app/assets/pages/about/index.svelte-851b180a.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/about/index.svelte-892a24c7.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/links/index.svelte": { "entry": "/./_app/pages/links/index.svelte-8eca67a3.js", "css": [], "js": ["/./_app/pages/links/index.svelte-8eca67a3.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/posts/index.svelte": { "entry": "/./_app/pages/posts/index.svelte-3db33c1c.js", "css": [], "js": ["/./_app/pages/posts/index.svelte-3db33c1c.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/posts/tag/[tag].svelte": { "entry": "/./_app/pages/posts/tag/[tag].svelte-5c0a95cc.js", "css": [], "js": ["/./_app/pages/posts/tag/[tag].svelte-5c0a95cc.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/posts/[slug].svelte": { "entry": "/./_app/pages/posts/[slug].svelte-d08320fe.js", "css": [], "js": ["/./_app/pages/posts/[slug].svelte-d08320fe.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/auth/index.svelte": { "entry": "/./_app/pages/auth/index.svelte-4795e83d.js", "css": ["/./_app/assets/pages/auth/index.svelte-70e10166.css"], "js": ["/./_app/pages/auth/index.svelte-4795e83d.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/auth/login.svelte": { "entry": "/./_app/pages/auth/login.svelte-3b86fcf8.js", "css": [], "js": ["/./_app/pages/auth/login.svelte-3b86fcf8.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/uses.svelte": { "entry": "/./_app/pages/uses.svelte-114777c6.js", "css": ["/./_app/assets/pages/uses.svelte-09104085.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/uses.svelte-114777c6.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/etc/index.svelte": { "entry": "/./_app/pages/etc/index.svelte-f8586fcd.js", "css": ["/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/etc/index.svelte-f8586fcd.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/etc/frontend/index.svelte": { "entry": "/./_app/pages/etc/frontend/index.svelte-ad1e36af.js", "css": ["/./_app/assets/pages/etc/frontend/index.svelte-1716761b.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/etc/frontend/index.svelte-ad1e36af.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/etc/laptops.svelte": { "entry": "/./_app/pages/etc/laptops.svelte-11712c0f.js", "css": ["/./_app/assets/pages/etc/laptops.svelte-d46d2292.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/etc/laptops.svelte-11712c0f.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/etc/updates.svelte": { "entry": "/./_app/pages/etc/updates.svelte-ecffe26c.js", "css": ["/./_app/assets/pages/etc/frontend/index.svelte-1716761b.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/etc/updates.svelte-ecffe26c.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/etc/plangs.svelte": { "entry": "/./_app/pages/etc/plangs.svelte-7c9f9d16.js", "css": ["/./_app/assets/pages/etc/laptops.svelte-d46d2292.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/etc/plangs.svelte-7c9f9d16.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/lab/index.svelte": { "entry": "/./_app/pages/lab/index.svelte-c5020887.js", "css": ["/./_app/assets/pages/lab/index.svelte-c2f25261.css"], "js": ["/./_app/pages/lab/index.svelte-c5020887.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] }, "src/routes/p/index.svelte": { "entry": "/./_app/pages/p/index.svelte-ce96dcb5.js", "css": ["/./_app/assets/pages/p/index.svelte-ccb2e8be.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/p/index.svelte-ce96dcb5.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/p/recollection/index.svelte": { "entry": "/./_app/pages/p/recollection/index.svelte-aea3dba9.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/p/recollection/index.svelte-aea3dba9.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/p/iz/index.svelte": { "entry": "/./_app/pages/p/iz/index.svelte-4de6deeb.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/p/iz/index.svelte-4de6deeb.js", "/./_app/chunks/vendor-0540047a.js", "/./_app/chunks/date-b6038655.js"], "styles": [] }, "src/routes/p/iz/docs.svelte": { "entry": "/./_app/pages/p/iz/docs.svelte-9b4906d0.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-0c391dfb.css"], "js": ["/./_app/pages/p/iz/docs.svelte-9b4906d0.js", "/./_app/chunks/vendor-0540047a.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender2 });
}
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var css$f = {
  code: 'body{border:5px solid black;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:2% 4% 2% 4%;font-weight:300;font-family:monospace}a.svelte-58y1mf.svelte-58y1mf{text-decoration:none}#title.svelte-58y1mf.svelte-58y1mf{border-radius:4px;font-family:monospace;padding:18px 17px 18px 17px;font-size:1.9rem;margin-right:2.5%;color:rgba(0,0,0,0.99);margin-left:2%;transition:all 0.05s;color:rgba(0,0,0,1);font-weight:400;letter-spacing:-1px;position:relative;display:inline-flex;text-shadow:0px 0px 8px rgba(0,0,0,0.10)}#title.svelte-58y1mf.svelte-58y1mf::after{content:".is ";color:rgba(0,0,0,0.25);text-shadow:0px 0px 8px rgba(0,0,0,0.10)}li.svelte-58y1mf a.svelte-58y1mf::before{content:"/";color:rgba(0,0,0,0.17)}#title.svelte-58y1mf.svelte-58y1mf:active{transform:scale(0.75);transition:0.15s all ease-in-out}#title.svelte-58y1mf.svelte-58y1mf:hover{transform:scale(1.15);transition:all 0.05s;opacity:0.8}li.svelte-58y1mf a.svelte-58y1mf{color:rgba(0,0,0,0.42);text-decoration:none;padding:7px 8px;border-radius:0px;letter-spacing:-0px;display:inline-flex;text-shadow:0px 0px 7px rgba(0,0,0,0.04)}.active.svelte-58y1mf.svelte-58y1mf{transform:scale(1.35);transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.09);color:rgba(0,0,0,0.95)}a.active.svelte-58y1mf.svelte-58y1mf::before{content:"> ";padding-right:5px;color:rgba(0,0,0,0.30)}nav.svelte-58y1mf ul li a.svelte-58y1mf{font-size:0.95rem;margin-right:1.5vw}nav.svelte-58y1mf.svelte-58y1mf{color:var(--fg-light);margin-bottom:0%;padding:0% 0%;display:block;height:90px}ul.svelte-58y1mf.svelte-58y1mf{margin-top:0%;display:inline-flex}ul.svelte-58y1mf li.svelte-58y1mf{display:inline-block;position:relative}.right.svelte-58y1mf.svelte-58y1mf{position:relative;display:inline-block}.right.svelte-58y1mf.svelte-58y1mf{float:right;margin-top:1%}.right.svelte-58y1mf a.svelte-58y1mf{padding:3px 5px;color:rgba(0,0,0,0.2);border-radius:2px;transition:all 0.2s linear;font-size:0.9rem}#etc.svelte-58y1mf.svelte-58y1mf{padding:3px;letter-spacing:-1px;padding-right:5px}.right.svelte-58y1mf a.svelte-58y1mf:hover{color:rgba(0,0,0,0.4);background:#fffdfc;transition:all 0.05s}.right.svelte-58y1mf .active.svelte-58y1mf{color:rgba(0,0,0,0.85)}.right.svelte-58y1mf .active.svelte-58y1mf::before{content:"!"}.tabl.svelte-58y1mf.svelte-58y1mf{clear:both;padding:0px;margin:0px;display:inline-block}li.svelte-58y1mf.svelte-58y1mf{padding:0px}li.svelte-58y1mf.svelte-58y1mf:hover{transform:scale(1.15);transition:all 0.1s ease-in-out}li.svelte-58y1mf:hover a.svelte-58y1mf{color:black;border-radius:0px;transition:all 0.03s ease-in-out}li.svelte-58y1mf.svelte-58y1mf:active{transform:scale(0.95);transition:all 0.03s ease-in-out}li.svelte-58y1mf:active a.svelte-58y1mf{transition:all 0.03s ease-in-out}',
  map: `{"version":3,"file":"nav.svelte","sources":["nav.svelte"],"sourcesContent":["<script>\\nexport let section = \\"Home\\";\\nimport { page} from '$app/stores'\\n<\/script>\\n\\n<style>\\n\\t:global(body) {\\n\\t\\tborder: 5px solid black;\\n\\t\\theight: 100vh;\\n\\t\\tmin-height: 100vh;\\n\\t\\tmargin: 0;\\n\\t\\tmax-width: 100%;\\n\\t\\toverflow-x: hidden;\\n\\t\\tpadding: 2% 4% 2% 4%;\\n\\t\\tfont-weight: 300;\\n\\t\\tfont-family:\\n\\t\\t\\tmonospace;\\n\\t}\\n\\ta { text-decoration:none; }\\n\\t#title {\\n\\t\\tborder-radius: 4px;\\n\\t\\tfont-family: monospace;\\n\\t\\tpadding: 18px 17px 18px 17px;\\n\\t\\tfont-size: 1.9rem;\\n\\t\\tmargin-right: 2.5%;\\n\\t\\tcolor: rgba(0,0,0,0.99);\\n\\t\\tmargin-left:2%;\\n\\t\\t/* border: 2px solid rgba(0,0,0,0.6); */\\n\\t\\ttransition: all 0.05s;\\n\\t\\tcolor: rgba(0,0,0,1);\\n\\t\\t/* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */\\n\\t\\tfont-weight: 400;\\n\\t\\tletter-spacing: -1px;\\n\\t\\tposition: relative;\\n\\t\\tdisplay:inline-flex;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.10);\\n\\t}\\n\\t#title::after {\\n\\t\\tcontent: \\".is \\";\\n\\t\\tcolor: rgba(0,0,0,0.25);\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.10);\\n\\t}\\n\\tspan {\\n\\t\\tdisplay:inline-flex;\\n\\t}\\n\\tli a::before {\\n\\t\\tcontent: \\"/\\";\\n\\t\\tcolor: rgba(0,0,0,0.17);\\n\\n\\t}\\n#title:active {\\n\\ttransform:scale(0.75);\\n\\ttransition:0.15s all ease-in-out;\\n\\t}\\n\\t#title:hover {\\n\\t\\ttransform: scale(1.15);\\n\\n\\n\\t\\t/* border: 2px solid black; */\\n\\t\\t/* box-shadow: 0px 2px 8px rgba(0,0,0,0.15); */\\n\\t\\ttransition: all 0.05s;\\n\\t\\topacity: 0.8;\\n\\t}\\n\\tli a {\\n\\t\\tcolor:rgba(0,0,0,0.42);\\n\\t\\ttext-decoration: none;\\n\\t\\tpadding: 7px 8px;\\n\\t\\t/* border-bottom-color: rgba(0,0,0,0.4); */\\n\\t\\tborder-radius: 0px;\\n\\t\\tletter-spacing: -0px;\\n\\t\\tdisplay:inline-flex;\\n\\n\\t\\ttext-shadow: 0px 0px 7px rgba(0,0,0,0.04);\\n\\t}\\n\\t.active {\\n\\t\\ttransform: scale(1.35);\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.09);\\n\\t\\tcolor: rgba(0,0,0,0.95);\\n\\t    }\\n\\t    a.active::before {\\n\\t\\t    content: \\"> \\";\\n\\t\\t    padding-right: 5px;\\n\\t\\t    color: rgba(0,0,0,0.30);\\n\\t\\t}\\n\\tnav ul li a {\\n\\t\\tfont-size: 0.95rem;\\n\\t\\tmargin-right: 1.5vw;\\n\\t}\\n\\tnav {\\n\\t\\tcolor: var(--fg-light);\\n\\t\\tmargin-bottom: 0%;\\n\\t\\tpadding: 0% 0%;\\n\\t\\tdisplay: block;\\n\\t\\theight: 90px;\\n\\t}\\n\\tul {\\n\\t\\tmargin-top: 0%;\\n\\t\\tdisplay: inline-flex;\\n\\t}\\n\\tul li {\\n\\t\\tdisplay: inline-block;\\n\\t\\tposition:relative;\\n\\t}\\n\\t.left, .right {\\n\\t\\tposition: relative;\\n\\t\\tdisplay: inline-block;\\n\\t}\\n\\t.right {\\n\\t\\tfloat:right;\\n\\t\\tmargin-top: 1%;\\n\\t}\\n\\t.left {\\n\\t\\tfloat: left;\\n\\t\\tdisplay: inline-flex;\\n\\t}\\n\\t.right a {\\n\\t\\t/* color: #fffdfc; */\\n\\t\\tpadding: 3px 5px;\\n\\t\\t/* border: 2px solid rgba(0,0,0,0.2); */\\n\\t\\tcolor: rgba(0,0,0,0.2);\\n\\t\\tborder-radius: 2px;\\n\\t\\ttransition:all 0.2s linear;\\n\\t\\tfont-size: 0.9rem;\\n\\t}\\n\\t#etc{\\n\\t\\tpadding: 3px;\\n\\t\\tletter-spacing: -1px;\\n\\t\\tpadding-right: 5px;\\n\\t}\\n\\t#lititle {\\n\\t\\tmargin-right: 10%;\\n\\t}\\n\\t.right a:hover{\\n\\t\\tcolor: rgba(0,0,0,0.4);\\n\\t\\t/* border: 2px solid rgba(0,0,0,0.4); */\\n\\t\\tbackground: #fffdfc;\\n\\t\\ttransition: all 0.05s;\\n\\t\\t/* box-shadow: 0px 0px 4px rgba(0,0,0,0.1); */\\n\\t\\t/* transform:scale(1.1); */\\n\\n\\t}\\n\\t.right .active {\\n\\t    color: rgba(0,0,0,0.85);\\n\\t    }\\n\\t    .right .active::before {\\n\\t\\tcontent: \\"!\\";\\n\\n\\t\\t}\\n\\t.tabl {\\n\\t\\tclear: both;\\n\\t\\tpadding:0px;\\n\\t\\tmargin:0px;\\n\\t\\tdisplay:inline-block;\\n\\t}\\n\\tli {\\n\\t\\tpadding: 0px;\\n\\t}\\n\\tli:hover {\\n\\t\\ttransform:scale(1.15);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t}\\n\\tli:hover a {\\n\\t\\tcolor: black;\\n\\t\\tborder-radius: 0px;\\n\\t\\t/* background-color: #fffdfc; */\\n\\t\\t/* border-bottom: 2px ridge black; */\\n\\t\\t/* transition: all 0.05s ease-in-out; */\\n\\t\\t/* padding: 4px 4px; */\\n\\t\\t/* box-shadow: 0px 1px 9px rgba(0,0,0,0.25); */\\n\\t\\ttransition: all 0.03s ease-in-out;\\n\\t}\\n\\t#sect {\\n\\t\\tfont-size: 1.0rem;\\n\\t\\tmargin-left: 4%;\\n\\t}\\n\\tli:active {\\n\\t\\ttransform: scale(0.95);\\n\\t\\ttransition: all 0.03s ease-in-out;\\n\\t}\\n\\tli:active a {\\n\\t\\ttransition: all 0.03s ease-in-out;\\n\\t}\\n\\n\\n</style>\\n\\n<nav>\\n\\t<a href=\\"/\\"><div id=\\"title\\">clp</div></a>\\n\\t\\t\\t <div class=\\"tabl\\">\\n\\t\\t<ul class=\\"navbar\\">\\n\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/\\">home</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/about\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/about\\">about</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/posts\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/posts\\">posts</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/p\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/p\\">projects</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/etc\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/etc\\">etc</a></li>\\n\\n\\t\\t</ul>\\n\\t\\t\\t </div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class:active={ $page.path == \\"/lab\\" } class=\\"nav\\" id=\\"etc\\" href=\\"/lab\\">/lab</a>\\n\\t\\t\\t<a class:active={ $page.path == \\"/auth\\" } class=\\"nav\\" id=\\"etc\\" href=\\"/auth\\">/auth</a>\\n\\n\\t\\t</div>\\n</nav>\\n"],"names":[],"mappings":"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"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { section = "Home" } = $$props;
  if ($$props.section === void 0 && $$bindings.section && section !== void 0)
    $$bindings.section(section);
  $$result.css.add(css$f);
  $$unsubscribe_page();
  return `<nav class="${"svelte-58y1mf"}"><a href="${"/"}" class="${"svelte-58y1mf"}"><div id="${"title"}" class="${"svelte-58y1mf"}">clp</div></a>
			 <div class="${"tabl svelte-58y1mf"}"><ul class="${"navbar svelte-58y1mf"}"><li class="${"svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/"}">home</a></li>
			<li class="${"svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/about" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/about"}">about</a></li>
			<li class="${"svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/posts" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/posts"}">posts</a></li>
			<li class="${"svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/p" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/p"}">projects</a></li>
			<li class="${"svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/etc" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/etc"}">etc</a></li></ul></div>
		<div class="${"right svelte-58y1mf"}"><a class="${["nav svelte-58y1mf", $page.path == "/lab" ? "active" : ""].join(" ").trim()}" id="${"etc"}" href="${"/lab"}">/lab</a>
			<a class="${["nav svelte-58y1mf", $page.path == "/auth" ? "active" : ""].join(" ").trim()}" id="${"etc"}" href="${"/auth"}">/auth</a></div></nav>`;
});
var css$e = {
  code: "p.svelte-10omry2.svelte-10omry2{color:rgba(0,0,0,0.3);font-size:0.9rem}a.svelte-10omry2.svelte-10omry2{text-decoration:none;font-size:0.9rem;color:rgba(130,130,70,0.7)}.nav.svelte-10omry2.svelte-10omry2:hover{padding:8px 5px;transition:all 0.25s ease-in-out}footer.svelte-10omry2.svelte-10omry2{color:rgba(0,0,0,0.3);font-size:0.8rem;padding:24px;margin-top:0%;position:sticky;bottom:0;display:block}.right.svelte-10omry2 a.svelte-10omry2:hover{color:rgba(0,0,0,0.4);background:#fffdfc;transition:all 0.05s;transition:scale(1.2);box-shadow:0px 0px 4px rgba(0,0,0,0.15)}.right.svelte-10omry2 a.svelte-10omry2{padding:3px 5px;color:rgba(0,0,0,0.2);border-radius:2px;font-size:0.8rem}.left.svelte-10omry2.svelte-10omry2,.right.svelte-10omry2.svelte-10omry2{position:relative;display:inline-block}.right.svelte-10omry2.svelte-10omry2{float:right;margin-top:1%}.left.svelte-10omry2.svelte-10omry2{float:left;display:inline-flex}",
  map: '{"version":3,"file":"footer.svelte","sources":["footer.svelte"],"sourcesContent":["<footer>\\n\\t<div class=\\"left\\">\\n\\t<p class=\\"foot\\">Last updated July 29, 2021</p>\\n\\t<p class=\\"foot\\"><a href=\\"mailto:clp@clp.is\\">Email</a> me</p>\\n\\t</div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gl\\" href=\\"https://gitlab.com/clpi\\">gitlab</a>\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gh\\" href=\\"https://github.com/clpi\\">github</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://github.com/clpi\\">twitter</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://github.com/clpi\\">linkedin</a>\\n\\n\\t\\t</div>\\n\\n</footer>\\n<style>\\np {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.9rem;\\n\\n}\\na {\\n\\ttext-decoration:none;\\n\\tfont-size: 0.9rem;\\n\\tcolor: rgba(130,130,70,0.7);\\n}\\n.nav:hover {\\n\\tpadding: 8px 5px;\\n\\ttransition: all 0.25s ease-in-out;\\n}\\nfooter {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.8rem;\\n\\tpadding: 24px;\\n\\tmargin-top: 0%;\\n\\tposition:sticky;\\n\\tbottom:0;\\n\\tdisplay: block;\\n}\\n.right a:hover{\\n\\tcolor: rgba(0,0,0,0.4);\\n\\t/* border: 2px solid rgba(0,0,0,0.4); */\\n\\tbackground: #fffdfc;\\n\\ttransition: all 0.05s;\\n\\ttransition:scale(1.2);\\n\\tbox-shadow: 0px 0px 4px rgba(0,0,0,0.15);\\n\\n}\\n.right a {\\n\\t/* color: #fffdfc; */\\n\\tpadding: 3px 5px;\\n\\t/* border: 2px solid rgba(0,0,0,0.2); */\\n\\tcolor: rgba(0,0,0,0.2);\\n\\tborder-radius: 2px;\\n\\tfont-size: 0.8rem;\\n}\\n.left, .right {\\n\\tposition: relative;\\n\\tdisplay: inline-block;\\n}\\n.right {\\n\\tfloat:right;\\n\\tmargin-top: 1%;\\n}\\n.left {\\n\\tfloat: left;\\n\\tdisplay: inline-flex;\\n}\\n</style>\\n"],"names":[],"mappings":"AAeA,CAAC,8BAAC,CAAC,AACF,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,MAAM,AAElB,CAAC,AACD,CAAC,8BAAC,CAAC,AACF,gBAAgB,IAAI,CACpB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,CAAC,AAC5B,CAAC,AACD,kCAAI,MAAM,AAAC,CAAC,AACX,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AAClC,CAAC,AACD,MAAM,8BAAC,CAAC,AACP,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,EAAE,CACd,SAAS,MAAM,CACf,OAAO,CAAC,CACR,OAAO,CAAE,KAAK,AACf,CAAC,AACD,qBAAM,CAAC,gBAAC,MAAM,CAAC,AACd,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAEtB,UAAU,CAAE,OAAO,CACnB,UAAU,CAAE,GAAG,CAAC,KAAK,CACrB,WAAW,MAAM,GAAG,CAAC,CACrB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAEzC,CAAC,AACD,qBAAM,CAAC,CAAC,eAAC,CAAC,AAET,OAAO,CAAE,GAAG,CAAC,GAAG,CAEhB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,MAAM,AAClB,CAAC,AACD,mCAAK,CAAE,MAAM,8BAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,AACtB,CAAC,AACD,MAAM,8BAAC,CAAC,AACP,MAAM,KAAK,CACX,UAAU,CAAE,EAAE,AACf,CAAC,AACD,KAAK,8BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,WAAW,AACrB,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<footer class="${"svelte-10omry2"}"><div class="${"left svelte-10omry2"}"><p class="${"foot svelte-10omry2"}">Last updated July 29, 2021</p>
	<p class="${"foot svelte-10omry2"}"><a href="${"mailto:clp@clp.is"}" class="${"svelte-10omry2"}">Email</a> me</p></div>
		<div class="${"right svelte-10omry2"}"><a class="${"nav svelte-10omry2"}" id="${"gl"}" href="${"https://gitlab.com/clpi"}">gitlab</a>
			<a class="${"nav svelte-10omry2"}" id="${"gh"}" href="${"https://github.com/clpi"}">github</a>
			<a class="${"nav svelte-10omry2"}" href="${"https://github.com/clpi"}">twitter</a>
			<a class="${"nav svelte-10omry2"}" href="${"https://github.com/clpi"}">linkedin</a></div>

</footer>`;
});
var Google = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  {
    {
      if (typeof gtag !== "undefined") {
        gtag("config", "G-Y7J10NG6D1", { page_path: $page.path });
      }
    }
  }
  $$unsubscribe_page();
  return ``;
});
var css$d = {
  code: `ul:not(.navbar){margin-left:3.5%;list-style:decimal;padding-top:2.5%;border-top:1px solid rgba(0,0,0,0.02);border-radius:7px;padding-bottom:2.5%;background-color:rgba(0,0,0,0.01);border-top:1px solid rgba(0,0,0,0.085);border-bottom:1px solid rgba(0,0,0,0.045);margin-top:25px}ul:not(.navbar):hover{background-color:rgba(0,0,0,0.025);transition:all 0.2s ease-in-out;background-color:rgba(0,0,0,0.02);border-top:1px solid rgba(0,0,0,0.175);border-bottom:1px solid rgba(0,0,0,0.095)}li:not(.nav){margin-bottom:4px}li:not(.nav){padding-left:1%}body{border:2px ridge transparent;background-color:#fffefd;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:2% 8% 2% 8%;font-weight:300}h1,h2,h3,h4{font-weight:300;font-family:monospace;letter-spacing:-2px;border-left:2px solid rgba(0,0,0,0.00)}h1{font-size:2.4rem;padding-left:32px}h2{font-size:2.0rem;padding-left:28px;color:rgba(0,0,0,0.7)}h3{font-size:1.8rem;padding-left:21px;color:rgba(0,0,0,0.64)}h4{font-size:1.6rem;padding-left:16px;color:rgba(0,0,0,0.6)}h1::before{content:"#";color:rgba(0,0,0,0.25);padding-right:16px}h2::before{content:"##";color:rgba(0,0,0,0.20);padding-right:12px}h3::before{content:"###";color:rgba(0,0,0,0.15);padding-right:10px}h4::before{content:"####";color:rgba(0,0,0,0.10);padding-right:8px}h1:hover::after{color:rgba(0,0,0,0.15);padding-left:8px;font-size:1.2rem;content:"[.]" }h2:hover::after{color:rgba(0,0,0,0.12);padding-left:6px;font-size:1.0rem;content:"[..]" }h3:hover::after{color:rgba(0,0,0,0.09);padding-left:4px;font-size:0.9rem;content:"[...]" }h4:hover::after{color:rgba(0,0,0,0.09);padding-left:4px;font-size:0.7rem;content:"[....]" }h1:hover{color:black;border-left:2px solid rgba(0,0,0,0.15);padding-left:34px;transition:all 0.2s ease-in-out}h2:hover{color:rgba(0,0,0,0.8);border-left:2px solid rgba(0,0,0,0.12);padding-left:30px;transition:all 0.2s ease-in-out}h3:hover{color:rgba(0,0,0,0.74);border-left:2px solid rgba(0,0,0,0.09);padding-left:23px;transition:all 0.2s ease-in-out}h4:hover{color:rgba(0,0,0,0.7);border-left:2px solid rgba(0,0,0,0.06);padding-left:18px;transition:all 0.2s ease-in-out}p{padding-left:32px;font-size:1.1rem}.content.svelte-2fspwr{font-size:1.1rem;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-weight:400}#head{padding-bottom:8px;border-left:2px solid rgba(0,0,0,0.00);text-shadow:0px 0px 8px rgba(0,0,0,0.06)}#head:hover::after{color:rgba(0,0,0,0.15);padding-left:8px;font-size:1.2rem;content:"[~]" }#head:hover{color:rgba(0,0,0,0.95);border-left:2px solid rgba(0,0,0,0.15);padding-left:37px;transition:all 0.2s ease-in-out}.link:not(.nav):hover{transition:all 0.1s;border-radius:2px;background-color:rgba(0,0,0,0.8);font-weight:500;color:rgba(255,255,255,0.95);text-decoration:underline;text-underline-offset:6px;text-decoration:none}.link:not(.nav){font-family:monospace;border-radius:1px;text-decoration:none;text-decoration:underline;text-underline-offset:6px;font-size:1rem;color:rgba(0,0,0,0.95);letter-spacing:-1px}p{transition:all 0.2s ease-in-out;border-left:2px solid rgba(0,0,0,0.0)}p:hover:not(.foot){border-left:2px solid rgba(0,0,0,0.1);transition:all 0.2s ease-in-out}.content.svelte-2fspwr{padding:12px;height:100%;min-height:45vh;background-color:rgba(0,0,0,0.02);border-left:4px dashed rgba(0,0,0,0.02);border-right:4px dashed rgba(0,0,0,0.02);border-top:1px solid rgba(0,0,0,0.06);border-bottom:2px solid rgba(0,0,0,0.12);box-shadow:0px 0px 22px rgba(0,0,0,0.04);display:block}li a :not(.nav){text-decoration:underline;text-underline-offset:5px;text-shadow:0px 0px 5px rgba(0,0,0,0.01)} .link.ext :not(.nav){color:rgba(0,0,0,0.5)}li a:active:not(.nav){transform:scale(1.3)}li a:hover:not(.nav){background-color:rgba(0,0,0,0.83);font-weight:300;color:rgba(255,255,255,0.98);border-radius:4px;box-shadow:0px 0px 8px rgba(0,0,0,0.1);transition:all 0.2s ease-in-out}li:hover a:not(.nav){transition:all 0.2s ease-in-out;transform:scale(1.2)}form{padding-left:3%;padding-right:1%;padding-top:2%;padding-bottom:2%;background-color:rgba(0,0,0,0.02);box-shadow:0px 0px 7px rgba(0,0,0,0.00);width:50%;display:block;position:relative;align-content:center;justify-content:center;transition:all 0.15s ease-in-out;align-items:center;box-shadow:0px 0px 5px rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.02);border-radius:6px;border-bottom:3px solid rgba(0,0,0,0.09);margin:auto}`,
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Nav from '../lib/nav.svelte';\\nimport Footer from '../lib/footer.svelte';\\nimport { page, navigating } from '$app/stores';\\nimport GoogleAnalytics from '$lib/google.svelte';\\n$: section = $page.path.split('/')[1];\\n<\/script>\\n\\n<style>\\n:global(ul:not(.navbar)) {\\n\\tmargin-left: 3.5%;\\n\\t    list-style: decimal;\\n\\tpadding-top: 2.5%;\\n\\tborder-top: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 7px;\\n\\tpadding-bottom: 2.5%;\\n\\tbackground-color: rgba(0,0,0,0.01);\\n\\tborder-top:1px solid rgba(0,0,0,0.085);\\n\\tborder-bottom:1px solid rgba(0,0,0,0.045);\\n\\tmargin-top: 25px;\\n    }\\n:global(ul:not(.navbar):hover) {\\n    background-color: rgba(0,0,0,0.025);\\n    transition: all 0.2s ease-in-out;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tborder-top:1px solid rgba(0,0,0,0.175);\\n\\tborder-bottom:1px solid rgba(0,0,0,0.095);\\n}\\n:global(li:not(.nav)) {\\n\\tmargin-bottom: 4px;\\n    }\\n    :global(li:not(.nav)) {\\n\\tpadding-left: 1%;\\n\\n\\t}\\n\\t:global(body) {\\n\\t\\tborder: 2px ridge transparent;\\n\\t\\tbackground-color: #fffefd;\\n\\t\\theight: 100vh;\\n\\t\\tmin-height: 100vh;\\n\\t\\tmargin: 0;\\n\\t\\tmax-width: 100%;\\n\\t\\toverflow-x: hidden;\\n\\t\\tpadding: 2% 8% 2% 8%;\\n\\t\\tfont-weight: 300;\\n\\t}\\n\\t:global(h1),:global(h2),:global(h3),:global(h4) {\\n\\n\\t\\tfont-weight: 300;\\n\\t\\tfont-family: monospace;\\n\\t\\tletter-spacing: -2px;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.00);\\n\\t\\t/* border-bottom: 0px solid rgba(0,0,0,0.25); */\\n\\t\\t/* padding: 0px 16px 4px 4px; */\\n\\t}\\n\\t:global(h1) { font-size: 2.4rem; padding-left: 32px;}\\n\\t:global(h2) { font-size: 2.0rem; padding-left: 28px; color: rgba(0,0,0,0.7)}\\n\\t:global(h3) { font-size: 1.8rem; padding-left: 21px; color: rgba(0,0,0,0.64)}\\n\\t:global(h4) { font-size: 1.6rem; padding-left: 16px; color: rgba(0,0,0,0.6)}\\n\\t:global(h1::before) { content: \\"#\\"; color: rgba(0,0,0,0.25); padding-right: 16px; }\\n\\t:global(h2::before) { content: \\"##\\"; color: rgba(0,0,0,0.20); padding-right: 12px; }\\n\\t:global(h3::before) { content: \\"###\\"; color: rgba(0,0,0,0.15); padding-right: 10px; }\\n\\t:global(h4::before) { content: \\"####\\"; color: rgba(0,0,0,0.10); padding-right: 8px; }\\n\\t:global(h1:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: \\"[.]\\" }\\n\\t:global(h2:hover::after) { color: rgba(0,0,0,0.12); padding-left: 6px; font-size: 1.0rem; content: \\"[..]\\" }\\n\\t:global(h3:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.9rem; content: \\"[...]\\" }\\n\\t:global(h4:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.7rem; content: \\"[....]\\" }\\n\\t:global(h1:hover) { color: black;border-left: 2px solid rgba(0,0,0,0.15); padding-left: 34px; transition: all 0.2s ease-in-out}\\n\\t:global(h2:hover) { color:rgba(0,0,0,0.8);border-left: 2px solid rgba(0,0,0,0.12); padding-left: 30px; transition: all 0.2s ease-in-out}\\n\\t:global(h3:hover) { color:rgba(0,0,0,0.74);border-left: 2px solid rgba(0,0,0,0.09); padding-left: 23px; transition: all 0.2s ease-in-out}\\n\\t:global(h4:hover) { color:rgba(0,0,0,0.7);border-left: 2px solid rgba(0,0,0,0.06); padding-left: 18px; transition: all 0.2s ease-in-out}\\n\\t:global(p) {\\n\\t\\tpadding-left: 32px;\\n\\t\\tfont-size: 1.1rem;\\n\\t}\\n\\t.content {\\n\\t\\tfont-size: 1.1rem;\\n\\t\\tfont-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\\n\\t\\tfont-weight: 400;\\n\\t\\t}\\n\\t:global(#head) {\\n\\t\\tpadding-bottom: 8px;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.00);\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.06);\\n\\t}\\n\\t:global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: \\"[~]\\" }\\n\\t:global(#head:hover) {\\n\\t\\tcolor: rgba(0,0,0,0.95);\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.15);\\n\\t\\tpadding-left: 37px;\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\n\\t}\\n\\t:global(.link:not(.nav):hover) {\\n\\t\\ttransition: all 0.1s;\\n\\t\\tborder-radius: 2px;\\n\\t\\tbackground-color: rgba(0,0,0,0.8);\\n\\t\\tfont-weight: 500;\\n\\t\\tcolor: rgba(255,255,255,0.95);\\n\\t\\ttext-decoration: underline;\\n\\t\\ttext-underline-offset: 6px;\\n\\t\\ttext-decoration:none;\\n\\t}\\n\\t:global(.link:not(.nav)) {\\n\\t\\tfont-family: monospace;\\n\\t\\tborder-radius: 1px;\\n\\t\\ttext-decoration:none;\\n\\ttext-decoration: underline;\\n\\ttext-underline-offset: 6px;\\n\\t\\tfont-size:1rem;\\n\\t\\tcolor: rgba(0,0,0,0.95);\\n\\t\\tletter-spacing:-1px;\\n\\t}\\n\\t/* :global(a:not(.nav):hover::before){\\n\\t\\tcontent: \\"[\\"\\n\\t}\\n\\t:global(a:not(.nav):hover::after){\\n\\t\\tcontent: \\"]\\"\\n\\t} */\\n\\t:global(p) {\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.0);\\n\\t}\\n\\t:global(p:hover:not(.foot)) {\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.1);\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\t}\\n\\t/* :global(p::before) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-right: 4px;\\n\\t}\\n\\t:global(p:hover::before),:global(p:hover::after) {\\n\\t\\tcolor: rgba(0,0,0,0.1);\\n\\t}\\n\\t:global(p::after) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-left: 4px;\\n\\t} */\\n\\n.content {\\n\\tpadding: 12px;\\n\\theight: 100%;\\n\\tmin-height: 45vh;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tborder-left: 4px dashed rgba(0,0,0,0.02);\\n\\tborder-right: 4px dashed rgba(0,0,0,0.02);\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.06);\\n\\t\\tborder-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\tbox-shadow: 0px 0px 22px rgba(0,0,0,0.04);\\n\\tdisplay:block;\\n}\\n:global(li a ):not(.nav) {\\n\\ttext-decoration: underline;\\n\\ttext-underline-offset: 5px;\\n\\ttext-shadow: 0px 0px 5px rgba(0,0,0,0.01);\\n    }\\n    :global( .link.ext ):not(.nav) {\\n\\t    color: rgba(0,0,0,0.5);\\n\\t}\\n\\t:global(li a:active):not(.nav) {\\n\\t\\ttransform: scale(1.3);\\n\\t}\\n\\t:global(li a:hover):not(.nav) {\\n\\t\\tbackground-color: rgba(0,0,0,0.83);\\n\\t\\tfont-weight: 300;\\n\\t\\tcolor: rgba(255,255,255,0.98);\\n\\t\\tborder-radius: 4px;\\n\\t\\tbox-shadow:  0px 0px 8px rgba(0,0,0,0.1);\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\n\\t    }\\n\\t    :global(li:hover a):not(.nav) {\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttransform: scale(1.2);\\n\\n\\t\\t}\\n    :global(form) {\\n\\tpadding-left: 3%;\\n\\tpadding-right: 1%;\\n\\tpadding-top: 2%;\\n\\tpadding-bottom: 2%;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tbox-shadow: 0px 0px 7px rgba(0,0,0,0.00);\\n\\twidth: 50%;\\n\\tdisplay: block;\\n\\tposition:relative;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\ttransition: all 0.15s ease-in-out;\\n\\talign-items: center;\\n\\tbox-shadow: 0px 0px 5px rgba(0,0,0,0.03);\\n\\tborder: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 6px;\\n\\tborder-bottom: 3px solid rgba(0,0,0,0.09);\\n\\tmargin: auto;\\n    }\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\n\\n\\t\\t}\\n\\t\\t.formtitle {\\n\\t\\t    font-family:monospace;\\n\\t\\t    padding-bottom: 12px;\\n\\t\\t    padding-left: 8px;\\n\\t\\t\\tdisplay:block;\\n\\t\\t    }\\n\\t\\t    .gray {\\n\\t\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t\\t}\\n</style>\\n\\n<GoogleAnalytics/>\\n<div>\\n\\t<Nav/>\\n\\t<div class=\\"content\\">\\n\\t\\t<slot></slot>\\n\\t</div>\\n\\t<Footer/>\\n</div>\\n"],"names":[],"mappings":"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"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$d);
  $page.path.split("/")[1];
  $$unsubscribe_page();
  return `${validate_component(Google, "GoogleAnalytics").$$render($$result, {}, {}, {})}
<div>${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}
	<div class="${"content svelte-2fspwr"}">${slots.default ? slots.default({}) : ``}</div>
	${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var css$c = {
  code: '.date.svelte-1u5v2uq{color:rgba(0,0,0,0.35);font-family:monospace;font-size:1rem;letter-spacing:-1px;padding-right:4px;letter-spacing:-2px}.date.svelte-1u5v2uq::before{content:"[";color:rgba(0,0,0,0.2)}.date.svelte-1u5v2uq::after{content:"]";color:rgba(0,0,0,0.2)}',
  map: '{"version":3,"file":"date.svelte","sources":["date.svelte"],"sourcesContent":["<script>\\nlet dt = Date.now().toLocaleString();\\nexport let date = dt;\\n\\n\\n<\/script>\\n<style>\\n\\n.date {\\n\\tcolor: rgba(0,0,0,0.35);\\n\\tfont-family:monospace;\\n\\tfont-size: 1rem;\\n\\tletter-spacing:-1px;\\n\\tpadding-right: 4px;\\n\\tletter-spacing:-2px;\\n}\\n.date::before { content: \\"[\\"; color: rgba(0,0,0,0.2); }\\n.date::after { content: \\"]\\";color: rgba(0,0,0,0.2);  }\\n</style>\\n\\n<span class=\\"date\\">{ date }</span>\\n"],"names":[],"mappings":"AAQA,KAAK,eAAC,CAAC,AACN,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,SAAS,CACrB,SAAS,CAAE,IAAI,CACf,eAAe,IAAI,CACnB,aAAa,CAAE,GAAG,CAClB,eAAe,IAAI,AACpB,CAAC,AACD,oBAAK,QAAQ,AAAC,CAAC,AAAC,OAAO,CAAE,GAAG,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAE,CAAC,AACvD,oBAAK,OAAO,AAAC,CAAC,AAAC,OAAO,CAAE,GAAG,CAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAG,CAAC"}'
};
var Date_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let dt = Date.now().toLocaleString();
  let { date = dt } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  $$result.css.add(css$c);
  return `<span class="${"date svelte-1u5v2uq"}">${escape2(date)}</span>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>home \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">index</h1>

<p>${validate_component(Date_1, "Date").$$render($$result, { date: "08-10-21" }, {}, {})} I&#39;m a recent graduate from the University of Washington Seattle&#39;s Materials Science &amp; Engineering program, currently working in the IT domain, especially in cloud infrastructure &amp; engineering. Have spent most of my time in Seattle, WA but now reside in Denver, CO.</p>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07-14-21" }, {}, {})} welcome to clp.is. feel free to check out my <a class="${"link ext"}" href="${"https://github.com/clpi"}">github</a>/<a class="${"link ext"}" href="${"https://gitlab.com/clpi"}">gitlab</a> for any projects i might be working on. for now site is under construction! to reach me, email me <a class="${"link ext"}" href="${"mailto:clp@clp.is"}">here</a>. thanks!</p>`;
});
var index$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Resources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$a = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Resources
});
var css$b = {
  code: 'form{padding-left:3%;padding-right:1%;padding-top:2%;padding-bottom:2%;background-color:rgba(0,0,0,0.02);box-shadow:0px 0px 7px rgba(0,0,0,0.00);width:50%;display:block;position:relative;align-content:center;justify-content:center;align-items:center;box-shadow:0px 0px 5px rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.02);border-radius:6px;border-bottom:3px solid rgba(0,0,0,0.09);margin:auto}label.svelte-18wpjbr.svelte-18wpjbr::before{content:"$   ";font-size:0.8rem;color:rgba(0,0,0,0.2)}input.svelte-18wpjbr.svelte-18wpjbr{padding:10px;margin-top:4px;width:80%;border-radius:5px;border:1px transparent;border-top:1px solid rgba(0,0,0,0.1);background:rgba(0,0,0,0.05)}textarea.svelte-18wpjbr.svelte-18wpjbr{padding:10px;margin-top:4px;border-radius:5px;width:80%;border:1px transparent;border-top:1px solid rgba(0,0,0,0.1);background:rgba(0,0,0,0.05)}label.svelte-18wpjbr.svelte-18wpjbr{font-size:0.9rem;padding-left:02px;color:rgba(0,0,0,0.6);text-shadow:0px 0px 4px rgba(0,0,0,0.05)}button.svelte-18wpjbr.svelte-18wpjbr{border:2px solid transparent;border-bottom:2px solid rgba(0,0,0,0.1);border-top:1px solid rgba(0,0,0,0.025);border-left:1px solid rgba(0,0,0,0.025);border-right:1px solid rgba(0,0,0,0.025);color:rgba(0,0,0,0.6);background-color:rgba(255,255,255,1);padding:8px;border-radius:3px}input.svelte-18wpjbr.svelte-18wpjbr:active{background-color:rgba(0,0,0,0.2)}input.svelte-18wpjbr.svelte-18wpjbr:focus{background-color:rgba(0,0,0,0.12);border-top:1px solid rgba(0,0,0,0.2);outline:none;transform:scale(1.1);transition:all 0.1s ease-in-out}textarea.svelte-18wpjbr.svelte-18wpjbr:active{background-color:rgba(0,0,0,0.2);transform:scale(0.9)}textarea.svelte-18wpjbr.svelte-18wpjbr:focus{background-color:rgba(0,0,0,0.12);border-top:1px solid rgba(0,0,0,0.2);outline:none;transform:scale(1.05);transition:all 0.1s ease-in-out}form.svelte-18wpjbr button.svelte-18wpjbr:hover{background-color:rbga(0,0,0,0.25);border-bottom:2px solid rgba(0,0,0,0.25);border-radius:5px;transform:scale(1.05);transition:all 0.1s ease-in-out}.form.svelte-18wpjbr.svelte-18wpjbr{align-content:center;align-content:center;justify-content:center}.form.svelte-18wpjbr.svelte-18wpjbr{align-content:center;align-content:center;justify-content:center}.formtitle.svelte-18wpjbr.svelte-18wpjbr{font-family:monospace;padding-bottom:12px;padding-left:8px;display:block}.gray.svelte-18wpjbr.svelte-18wpjbr{color:rgba(0,0,0,0.5)}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\nimport Date from '$lib/date.svelte'\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>about \u2022 clp.is</title>\\n</svelte:head>\\n<style>\\n    :global(form) {\\n\\tpadding-left: 3%;\\n\\tpadding-right: 1%;\\n\\tpadding-top: 2%;\\n\\tpadding-bottom: 2%;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tbox-shadow: 0px 0px 7px rgba(0,0,0,0.00);\\n\\twidth: 50%;\\n\\tdisplay: block;\\n\\tposition:relative;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\talign-items: center;\\n\\tbox-shadow: 0px 0px 5px rgba(0,0,0,0.03);\\n\\tborder: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 6px;\\n\\tborder-bottom: 3px solid rgba(0,0,0,0.09);\\n\\tmargin: auto;\\n    }\\n    label::before {\\n\\t    content: \\"$   \\";\\n\\t    font-size: 0.8rem;\\n\\t    color: rgba(0,0,0,0.2);\\n\\t}\\n    input { \\n\\tpadding: 10px; \\n\\tmargin-top: 4px;\\n\\twidth: 80%;\\n\\tborder-radius:5px; \\n\\tborder: 1px transparent; \\n\\tborder-top: 1px solid rgba(0,0,0,0.1);\\n\\tbackground: rgba(0,0,0,0.05);\\n\\t}\\n    textarea { \\n\\tpadding: 10px; \\n\\tmargin-top: 4px;\\n\\tborder-radius:5px; \\n\\twidth: 80%;\\n\\tborder: 1px transparent; \\n\\tborder-top: 1px solid rgba(0,0,0,0.1);\\n\\tbackground: rgba(0,0,0,0.05);\\n\\t}\\n\\tlabel {\\n\\t\\tfont-size: 0.9rem;\\n\\t\\tpadding-left: 02px;\\n\\t\\tcolor: rgba(0,0,0,0.6);\\n\\t\\ttext-shadow: 0px 0px 4px rgba(0,0,0,0.05);\\n\\t    }\\n    button {\\n\\tborder: 2px solid transparent;\\n\\tborder-bottom: 2px solid rgba(0,0,0,0.1);\\n\\tborder-top: 1px solid rgba(0,0,0,0.025);\\n\\tborder-left: 1px solid rgba(0,0,0,0.025);\\n\\tborder-right: 1px solid rgba(0,0,0,0.025);\\n\\tcolor: rgba(0,0,0,0.6);\\n\\tbackground-color: rgba(255,255,255,1);\\n\\tpadding: 8px;\\n\\tborder-radius: 3px;\\n\\n\\t}\\n\\tinput:active {\\n\\t\\tbackground-color: rgba(0,0,0,0.2);\\n\\t    }\\n\\tinput:focus {\\n\\t\\tbackground-color: rgba(0,0,0,0.12);\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\t\\toutline:none;\\n\\t\\ttransform:scale(1.1);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t    }\\n\\ttextarea:active {\\n\\t\\tbackground-color: rgba(0,0,0,0.2);\\n\\t\\ttransform:scale(0.9);\\n\\t    }\\n\\ttextarea:focus {\\n\\t\\tbackground-color: rgba(0,0,0,0.12);\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\t\\toutline:none;\\n\\t\\ttransform:scale(1.05);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t    }\\n\\tform button:hover {\\n\\t    background-color: rbga(0,0,0,0.25);\\n\\t    border-bottom: 2px solid rgba(0,0,0,0.25);\\n\\t    border-radius: 5px;\\n\\t    transform:scale(1.05);\\n\\t    transition:all 0.1s ease-in-out;\\n\\t}\\n\\tform button:active {\\n\\n\\t    }\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\n\\n\\t\\t}\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\t}\\n\\n\\n\\t\\t.formtitle {\\n\\t\\t    font-family:monospace;\\n\\t\\t    padding-bottom: 12px;\\n\\t\\t    padding-left: 8px;\\n\\t\\t\\tdisplay:block;\\n\\t\\t    }\\n\\t\\t    .gray {\\n\\t\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t\\t}\\n\\n/* .walloftext { width: 80%; margin: auto; display:block; } */\\n</style>\\n\\n<h1 id=\\"head\\">about</h1>\\n<h3>about a dude...</h3>\\n<p class=\\"walloftext\\">Hi there! And <i>welcome</i> to Chris P's internet property. I'm a budding engineer, a few years out of the University of Washington Materials science & engineering program in Seattle.</p>\\n<p class=\\"walloftext\\">I'm currenlty most practiced in backend software development + cloud infrastructure architecture & engineering. Coming from a physical engineering background, I've had to learn quite a lot in my IT endeavours, both on my own and from the gracious assistance of others, whose patience I am grateful for eternally. I envision that with my multifaceted background and cross-disciplinary engineering cultivation, I can really bring a new perspective to the table in backend development and architecture.</p>\\n\\n<p class=\\"walloftext\\">I'm also working to build <a class=\\"link\\" href=\\"https://devisa.io\\">devisa</a> and <a class=\\"link\\" href=\\"https://idlets.com\\">idlets</a>. Keep in touch with me through real means or quietly stalk my <a class=\\"link\\" href=\\"/etc/updates\\">activity</a> <a class=\\"link\\" href=\\"/posts\\">feeds</a> if you're into that. If you wanna talk, email me at <a href=\\"mailto:clp@clp.is\\" class=\\"link\\">clp@clp.is</a> or message me on LinkedIn. Thank you, sincerely!</p>\\n\\n<p class=\\"walloftext\\">- Chris P<Date date=\\"07-29-21\\"/> </p>\\n<br/><br/>\\n<h3>show yourself!</h3>\\n<div class=\\"form\\">\\n<form class=\\"login\\">\\n    <span class=\\"formtitle\\">contact <span class=\\"gray\\">me</span></span>\\n\\n    <label for=\\"msg\\">message</label><br/>\\n    <textarea name=\\"msg\\" rows=8/>\\n\\n\\n    <br/><br/>\\n    <label for=\\"email\\">email</label><br/>\\n    <input name=\\"email\\" type=\\"email\\"/>\\n\\n<br/>\\n<br/>\\n    <button label=\\"login\\" type=\\"submit\\">login</button>\\n</form>\\n</div>\\n"],"names":[],"mappings":"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"}`
};
var hydrate$9 = false;
var prerender$9 = true;
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$b);
  return `${$$result.head += `${$$result.title = `<title>about \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">about</h1>
<h3>about a dude...</h3>
<p class="${"walloftext"}">Hi there! And <i>welcome</i> to Chris P&#39;s internet property. I&#39;m a budding engineer, a few years out of the University of Washington Materials science &amp; engineering program in Seattle.</p>
<p class="${"walloftext"}">I&#39;m currenlty most practiced in backend software development + cloud infrastructure architecture &amp; engineering. Coming from a physical engineering background, I&#39;ve had to learn quite a lot in my IT endeavours, both on my own and from the gracious assistance of others, whose patience I am grateful for eternally. I envision that with my multifaceted background and cross-disciplinary engineering cultivation, I can really bring a new perspective to the table in backend development and architecture.</p>

<p class="${"walloftext"}">I&#39;m also working to build <a class="${"link"}" href="${"https://devisa.io"}">devisa</a> and <a class="${"link"}" href="${"https://idlets.com"}">idlets</a>. Keep in touch with me through real means or quietly stalk my <a class="${"link"}" href="${"/etc/updates"}">activity</a> <a class="${"link"}" href="${"/posts"}">feeds</a> if you&#39;re into that. If you wanna talk, email me at <a href="${"mailto:clp@clp.is"}" class="${"link"}">clp@clp.is</a> or message me on LinkedIn. Thank you, sincerely!</p>

<p class="${"walloftext"}">- Chris P${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</p>
<br><br>
<h3>show yourself!</h3>
<div class="${"form svelte-18wpjbr"}"><form class="${"login svelte-18wpjbr"}"><span class="${"formtitle svelte-18wpjbr"}">contact <span class="${"gray svelte-18wpjbr"}">me</span></span>

    <label for="${"msg"}" class="${"svelte-18wpjbr"}">message</label><br>
    <textarea name="${"msg"}" rows="${"8"}" class="${"svelte-18wpjbr"}"></textarea>


    <br><br>
    <label for="${"email"}" class="${"svelte-18wpjbr"}">email</label><br>
    <input name="${"email"}" type="${"email"}" class="${"svelte-18wpjbr"}">

<br>
<br>
    <button label="${"login"}" type="${"submit"}" class="${"svelte-18wpjbr"}">login</button></form></div>`;
});
var index$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About,
  hydrate: hydrate$9,
  prerender: prerender$9
});
var hydrate$8 = false;
var prerender$8 = true;
var Links = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>links \u2022 clp.is</title>`, ""}`, ""}
<h1 id="${"head"}">links</h1>`;
});
var index$8 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Links,
  hydrate: hydrate$8,
  prerender: prerender$8
});
var hydrate$7 = false;
var prerender$7 = true;
var Posts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>posts \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">posts</h1>
<p>this is where posts will be</p>

<h2>list</h2>
<p>oof</p>`;
});
var index$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Posts,
  hydrate: hydrate$7,
  prerender: prerender$7
});
var U5Btagu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var _tag_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Btagu5D
});
var U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D
});
var css$a = {
  code: 'form{padding-left:2%;padding-right:2%;background-color:rgba(0,0,0,0.02);box-shadow:0px 0px 7px rgba(0,0,0,0.00);display:inline-flex;transition:all 0.15s ease-in-out;align-self:center;margin:10px 15px;border:1px solid rgba(0,0,0,0.0025);border-radius:6px;border-bottom:3px solid rgba(0,0,0,0.09);place-self:center;place-items:center;width:10%}label.svelte-hvaqce.svelte-hvaqce::before{content:"$   ";font-size:0.8rem;color:rgba(0,0,0,0.2)}input.svelte-hvaqce.svelte-hvaqce{padding:10px;margin-top:4px;border-radius:5px;width:90%;border:1px transparent;border-top:1px solid rgba(0,0,0,0.1);background:rgba(0,0,0,0.05)}label.svelte-hvaqce.svelte-hvaqce{font-size:0.9rem;padding-left:02px;color:rgba(0,0,0,0.6);text-shadow:0px 0px 4px rgba(0,0,0,0.05)}button.svelte-hvaqce.svelte-hvaqce{border:2px solid transparent;border-bottom:2px solid rgba(0,0,0,0.1);border-top:1px solid rgba(0,0,0,0.025);border-left:1px solid rgba(0,0,0,0.025);border-right:1px solid rgba(0,0,0,0.025);color:rgba(0,0,0,0.6);background-color:rgba(255,255,255,1);padding:8px;border-radius:3px;transition:all 0.15s ease-in-out}input.svelte-hvaqce.svelte-hvaqce:active{background-color:rgba(0,0,0,0.2)}input.svelte-hvaqce.svelte-hvaqce:focus{background-color:rgba(0,0,0,0.12);border-top:1px solid rgba(0,0,0,0.2);outline:none;transform:scale(1.1);transition:all 0.1s ease-in-out}form.svelte-hvaqce button.svelte-hvaqce:hover{background-color:rbga(0,0,0,0.25);border-bottom:2px solid rgba(0,0,0,0.25);border-radius:5px;transform:scale(1.1);transition:all 0.1s ease-in-out}.formtitle.svelte-hvaqce.svelte-hvaqce{font-family:monospace;padding-bottom:12px;padding-left:8px;display:block}.gray.svelte-hvaqce.svelte-hvaqce{color:rgba(0,0,0,0.5)}',
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<style>\\n   :global(form) {\\npadding-left: 2%;\\npadding-right: 2%;\\nbackground-color: rgba(0,0,0,0.02);\\nbox-shadow: 0px 0px 7px rgba(0,0,0,0.00);\\ndisplay: inline-flex;\\ntransition: all 0.15s ease-in-out;\\nalign-self: center;\\nmargin: 10px 15px;\\nborder: 1px solid rgba(0,0,0,0.0025);\\nborder-radius: 6px;\\nborder-bottom: 3px solid rgba(0,0,0,0.09);\\nplace-self: center;\\nplace-items: center;\\nwidth: 10%;\\n   }\\n   label::before {\\n    content: \\"$   \\";\\n    font-size: 0.8rem;\\n    color: rgba(0,0,0,0.2);\\n}\\n   input { \\npadding: 10px; \\nmargin-top: 4px;\\nborder-radius:5px; \\nwidth: 90%;\\nborder: 1px transparent; \\nborder-top: 1px solid rgba(0,0,0,0.1);\\nbackground: rgba(0,0,0,0.05);\\n}\\nlabel {\\n\\tfont-size: 0.9rem;\\n\\tpadding-left: 02px;\\n\\tcolor: rgba(0,0,0,0.6);\\n\\ttext-shadow: 0px 0px 4px rgba(0,0,0,0.05);\\n    }\\n   button {\\nborder: 2px solid transparent;\\nborder-bottom: 2px solid rgba(0,0,0,0.1);\\nborder-top: 1px solid rgba(0,0,0,0.025);\\nborder-left: 1px solid rgba(0,0,0,0.025);\\nborder-right: 1px solid rgba(0,0,0,0.025);\\ncolor: rgba(0,0,0,0.6);\\nbackground-color: rgba(255,255,255,1);\\npadding: 8px;\\nborder-radius: 3px;\\ntransition: all 0.15s ease-in-out;\\n\\n}\\ninput:active {\\n\\tbackground-color: rgba(0,0,0,0.2);\\n    }\\ninput:focus {\\n\\tbackground-color: rgba(0,0,0,0.12);\\n\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\toutline:none;\\n\\ttransform:scale(1.1);\\n\\ttransition: all 0.1s ease-in-out;\\n    }\\nform button:hover {\\n    background-color: rbga(0,0,0,0.25);\\n    border-bottom: 2px solid rgba(0,0,0,0.25);\\n    border-radius: 5px;\\n    transform:scale(1.1);\\n    transition:all 0.1s ease-in-out;\\n}\\nform button:active {\\n\\n    }\\n\\t.formtitle {\\n\\t    font-family:monospace;\\n\\t    padding-bottom: 12px;\\n\\t    padding-left: 8px;\\n\\t\\tdisplay:block;\\n\\t    }\\n\\t    .gray {\\n\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t}\\n</style>\\n<h1>auth</h1>\\n\\n<div class=\\"form\\">\\n<form class=\\"login\\">\\n    <span class=\\"formtitle\\">log <span class=\\"gray\\">in</span></span>\\n\\n    <label for=\\"user\\">user</label><br/>\\n    <input name=\\"user\\" placeholder=\\"user\\"/>\\n\\n\\n    <br/><br/>\\n    <label for=\\"passwor\\">pass</label><br/>\\n    <input name=\\"password\\" type=\\"password\\" placeholder=\\"password\\"/>\\n\\n<br/>\\n<br/>\\n    <button label=\\"login\\">login</button>\\n</form>\\n</div>\\n"],"names":[],"mappings":"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"}'
};
var Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$a);
  return `<h1>auth</h1>

<div class="${"form"}"><form class="${"login svelte-hvaqce"}"><span class="${"formtitle svelte-hvaqce"}">log <span class="${"gray svelte-hvaqce"}">in</span></span>

    <label for="${"user"}" class="${"svelte-hvaqce"}">user</label><br>
    <input name="${"user"}" placeholder="${"user"}" class="${"svelte-hvaqce"}">


    <br><br>
    <label for="${"passwor"}" class="${"svelte-hvaqce"}">pass</label><br>
    <input name="${"password"}" type="${"password"}" placeholder="${"password"}" class="${"svelte-hvaqce"}">

<br>
<br>
    <button label="${"login"}" class="${"svelte-hvaqce"}">login</button></form></div>`;
});
var index$6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Auth
});
var Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var login = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Login
});
var css$9 = {
  code: ".p.svelte-lvhre9{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-lvhre9:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-lvhre9{text-decoration:none;color:rgba(0,0,0,0.78);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-lvhre9:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-lvhre9:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }.cap.svelte-lvhre9{color:rgba(0,0,0,0.5);margin:auto;width:60%}",
  map: `{"version":3,"file":"uses.svelte","sources":["uses.svelte"],"sourcesContent":["\\n<svelte:head>\\n\\t<title>uses \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\ncolor: rgba(0,0,0,0.55);  \\nfont-size: 1.9rem;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n}\\n.p:hover{\\n\\tcolor: rgba(0,0,0,0.85);\\n\\tpadding-left: 8px;\\n\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n    }\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.78);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n\\t\\t    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}\\n</style>\\n\\n<h1 id=\\"head\\"><a href=\\"/etc\\" class=\\"crumb\\">etc</a><small class=\\"p\\"> &nbsp;\u2022 /uses </small></h1>\\n<p>\\n\\n <Date date=\\"07/29/21\\"/>clp.is uses...  (table of contents?)\\n <ul>\\n    <li><a href=\\"#\\" class=\\"link\\">text editing (nvim)</a></li>\\n    <li><a href=\\"#\\" class=\\"link\\">virtual workspace (tmux)</a></li>\\n    <li><a href=\\"#\\" class=\\"link\\">window mgr/destkop env (sway/gnome)</a></li>\\n    <li><a href=\\"#\\" class=\\"link\\">operating system (fedora linux)</a></li>\\n    <li><a href=\\"#\\" class=\\"link\\">personal planning (vimwiki)</a></li>\\n    <li><a href=\\"#\\" class=\\"link\\">email / calendar</a></li>\\n </ul>\\n\\n<br/>\\n<h2>picks</h2>\\n <h3>text editing</h3>\\n\\n <h3>virtual workspace</h3>\\n\\n <h3>operating system</h3>\\n\\n <h3>personal planning</h3>\\n <p><Date date=\\"08-10-21\\"/>I nearly exclusively use stream-of-thought note-taking in <a href=\\"https://github.com/vimwiki/vimwiki\\" class=\\"link\\">vimwiki</a> to keep track of my thoughts. When potentially useful or otherwise significant thoughts pop into your head, the right tool for the job of recording them should be whatever is the most accessible and comfortable for you in the Eureka moment. In real life, this might be a sticky note which perpetually lives on your working desk. For someone who does just about everything else in their text editing software of choice (Neovim for me), it's a new Vimwiki diary note. Over time, I've developed my Vimwiki \\"sticky note\\" system into a complex and hierarchical knowledge base that I refer to all the time for any piece of pertinent info. </p>\\n\\n <h3>email/calendar</h3>\\n\\n <h3>honorable nominations</h3>\\n\\n<br/>\\n<h2>Images</h2>\\n<!--<img src=\\"./static/swappy-20210729_135416.png\\" width=90% alt=\\"sway screenshot\\"/>-->\\n<br/><i class=\\"cap\\">A pic of Sway WM setup running alongside waybar & a few alacritty instances w/ ranger and neovim. excuse the old oofy owwy code I pulled up quickly for the screenshot. tmux also running w/ old config (all dotfiles can be found <a href=\\"https://github.com/clpi/dotfiles\\" class=\\"link ext\\">here</a>)</i>\\n<br/><br/>\\n<!--<img src=\\"./static/swappy-20210729_134838.png\\" width=90% alt=\\"sway screenshot\\"/>-->\\n<br/><i class=\\"cap\\">Sway WM running with waybar, neovim running in tmux running in alacritty. and way in the distance you can catch me still running late for ENGR 231.</i>\\n"],"names":[],"mappings":"AAcA,EAAE,cAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,gBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACvC,CAAC,AACA,MAAM,cAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,oBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AAEL,oBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC,AACD,IAAI,cAAC,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAE,MAAM,CAAE,IAAI,CAAE,KAAK,CAAE,GAAG,AAAC,CAAC"}`
};
var hydrate$6 = false;
var prerender$6 = true;
var Uses = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$9);
  return `${$$result.head += `${$$result.title = `<title>uses \u2022 clp.is</title>`, ""}`, ""}





<h1 id="${"head"}"><a href="${"/etc"}" class="${"crumb svelte-lvhre9"}">etc</a><small class="${"p svelte-lvhre9"}">\xA0\u2022 /uses </small></h1>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})}clp.is uses...  (table of contents?)
 </p><ul><li><a href="${"#"}" class="${"link"}">text editing (nvim)</a></li>
    <li><a href="${"#"}" class="${"link"}">virtual workspace (tmux)</a></li>
    <li><a href="${"#"}" class="${"link"}">window mgr/destkop env (sway/gnome)</a></li>
    <li><a href="${"#"}" class="${"link"}">operating system (fedora linux)</a></li>
    <li><a href="${"#"}" class="${"link"}">personal planning (vimwiki)</a></li>
    <li><a href="${"#"}" class="${"link"}">email / calendar</a></li></ul>

<br>
<h2>picks</h2>
 <h3>text editing</h3>

 <h3>virtual workspace</h3>

 <h3>operating system</h3>

 <h3>personal planning</h3>
 <p>${validate_component(Date_1, "Date").$$render($$result, { date: "08-10-21" }, {}, {})}I nearly exclusively use stream-of-thought note-taking in <a href="${"https://github.com/vimwiki/vimwiki"}" class="${"link"}">vimwiki</a> to keep track of my thoughts. When potentially useful or otherwise significant thoughts pop into your head, the right tool for the job of recording them should be whatever is the most accessible and comfortable for you in the Eureka moment. In real life, this might be a sticky note which perpetually lives on your working desk. For someone who does just about everything else in their text editing software of choice (Neovim for me), it&#39;s a new Vimwiki diary note. Over time, I&#39;ve developed my Vimwiki &quot;sticky note&quot; system into a complex and hierarchical knowledge base that I refer to all the time for any piece of pertinent info. </p>

 <h3>email/calendar</h3>

 <h3>honorable nominations</h3>

<br>
<h2>Images</h2>

<br><i class="${"cap svelte-lvhre9"}">A pic of Sway WM setup running alongside waybar &amp; a few alacritty instances w/ ranger and neovim. excuse the old oofy owwy code I pulled up quickly for the screenshot. tmux also running w/ old config (all dotfiles can be found <a href="${"https://github.com/clpi/dotfiles"}" class="${"link ext"}">here</a>)</i>
<br><br>

<br><i class="${"cap svelte-lvhre9"}">Sway WM running with waybar, neovim running in tmux running in alacritty. and way in the distance you can catch me still running late for ENGR 231.</i>`;
});
var uses = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Uses,
  hydrate: hydrate$6,
  prerender: prerender$6
});
var hydrate$5 = false;
var prerender$5 = true;
var Etc = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>etc \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">etc</h1>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/14/21" }, {}, {})}welcome to the attic of my site</p>
<h3>cool and great info</h3>
<ul><li><a class="${"link"}" href="${"/etc/updates"}">updates</a>:  \xA0\xA0updates${validate_component(Date_1, "Date").$$render($$result, { date: "08-10-21" }, {}, {})}</li>
	<li><a class="${"link"}" href="${"/etc/frontend"}">frontend thoughts</a>:  \xA0\xA0web dev and frontend musings${validate_component(Date_1, "Date").$$render($$result, { date: "08-10-21" }, {}, {})}</li>
	<li><a class="${"link"}" href="${"/uses"}">dev setup</a>:  \xA0\xA0dev setup${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</li>
	<li><a class="${"link"}" href="${"/etc/laptops"}">&#39;tops ive used and loved</a>:  \xA0\xA0thinkpad pokedex${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</li>
	<li><a class="${"link"}" href="${"/etc/plangs"}">programming langs that make me sang</a>:  \xA0\xA0plangs${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</li>
	<li><a class="${"link ext svelte-1xutv7d"}" href="${"https://github.com/clpi/dotfiles"}">dotfiles</a>:  \xA0\xA0dotfiles${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</li></ul>


<h3>miscellaneous profiles</h3>
<ul><li><a class="${"link"}" href="${"https://last.fm/user/ooohm"}">last.fm</a> profile</li>
    <li><a class="${"link"}" href="${"https://github.com/clpi"}">github</a>dev profile</li></ul>`;
});
var index$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Etc,
  hydrate: hydrate$5,
  prerender: prerender$5
});
var css$8 = {
  code: ".p.svelte-1s7mnym{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-1s7mnym:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-1s7mnym{text-decoration:none;color:rgba(0,0,0,0.78);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-1s7mnym:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-1s7mnym:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>home \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script>\\nimport  Date  from '$lib/date.svelte'\\n<\/script>\\n<style>\\n.p { \\ncolor: rgba(0,0,0,0.55);  \\nfont-size: 1.9rem;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n}\\n.p:hover{\\n\\tcolor: rgba(0,0,0,0.85);\\n\\tpadding-left: 8px;\\n\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n    }\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.78);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n\\t\\t    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}\\n\\n    /* :global(.ext::after) {\\n\\tcontent: \\" [->]\\";\\n\\tfont-size: 0.6rem;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(0,0,0,0.4);\\n    }\\n    :global(.ext:hover::after) {\\n\\tcontent: \\" [->]\\";\\n\\ttransition: all 0.15s ease-in-out;\\n    } */\\n</style>\\n<h1 id=\\"head\\"><a href=\\"/etc\\" class=\\"crumb\\">etc</a><small class=\\"p\\"> &nbsp;\u2022 frontend </small></h1>\\n\\n<p> <Date date=\\"08-11-21\\"/> fun fact this site was built in svelte, my previous webpage was built with next.js, the one before that was built with WebAssembly and Rust, and the one before that was built with Svelte (...and the one before that was built with React).</p>\\n\\n"],"names":[],"mappings":"AAQA,EAAE,eAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACvC,CAAC,AACA,MAAM,eAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AAEL,qBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var Frontend = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$8);
  return `${$$result.head += `${$$result.title = `<title>home \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}"><a href="${"/etc"}" class="${"crumb svelte-1s7mnym"}">etc</a><small class="${"p svelte-1s7mnym"}">\xA0\u2022 frontend </small></h1>

<p>${validate_component(Date_1, "Date").$$render($$result, { date: "08-11-21" }, {}, {})} fun fact this site was built in svelte, my previous webpage was built with next.js, the one before that was built with WebAssembly and Rust, and the one before that was built with Svelte (...and the one before that was built with React).</p>`;
});
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Frontend
});
var css$7 = {
  code: ".p.svelte-lvhre9{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-lvhre9:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-lvhre9{text-decoration:none;color:rgba(0,0,0,0.78);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-lvhre9:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-lvhre9:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"laptops.svelte","sources":["laptops.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>uses \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\ncolor: rgba(0,0,0,0.55);  \\nfont-size: 1.9rem;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n}\\n.p:hover{\\n\\tcolor: rgba(0,0,0,0.85);\\n\\tpadding-left: 8px;\\n\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n    }\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.78);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n\\t\\t    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}\\n</style>\\n\\n<h1 id=\\"head\\"><a href=\\"/etc/\\" class=\\"crumb\\">etc</a><small class=\\"p\\"> &nbsp;\u2022 laptops i've used & loved </small></h1>\\n<p>\\n\\n <Date date=\\"07/29/21\\"/>laptop time!\\n </p>\\n"],"names":[],"mappings":"AAaA,EAAE,cAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,gBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACvC,CAAC,AACA,MAAM,cAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,oBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AAEL,oBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var hydrate$4 = false;
var prerender$4 = true;
var Laptops = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$7);
  return `${$$result.head += `${$$result.title = `<title>uses \u2022 clp.is</title>`, ""}`, ""}





<h1 id="${"head"}"><a href="${"/etc/"}" class="${"crumb svelte-lvhre9"}">etc</a><small class="${"p svelte-lvhre9"}">\xA0\u2022 laptops i&#39;ve used &amp; loved </small></h1>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})}laptop time!
 </p>`;
});
var laptops = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Laptops,
  hydrate: hydrate$4,
  prerender: prerender$4
});
var css$6 = {
  code: ".p.svelte-1s7mnym{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-1s7mnym:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-1s7mnym{text-decoration:none;color:rgba(0,0,0,0.78);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-1s7mnym:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-1s7mnym:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"updates.svelte","sources":["updates.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>home \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script>\\nimport  Date  from '$lib/date.svelte'\\n<\/script>\\n<style>\\n.p { \\ncolor: rgba(0,0,0,0.55);  \\nfont-size: 1.9rem;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n}\\n.p:hover{\\n\\tcolor: rgba(0,0,0,0.85);\\n\\tpadding-left: 8px;\\n\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n    }\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.78);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n\\t\\t    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}\\n\\n    /* :global(.ext::after) {\\n\\tcontent: \\" [->]\\";\\n\\tfont-size: 0.6rem;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(0,0,0,0.4);\\n    }\\n    :global(.ext:hover::after) {\\n\\tcontent: \\" [->]\\";\\n\\ttransition: all 0.15s ease-in-out;\\n    } */\\n</style>\\n<h1 id=\\"head\\"><a href=\\"/etc\\" class=\\"crumb\\">etc</a><small class=\\"p\\"> &nbsp;\u2022 updates </small></h1>\\n\\n<p> <Date date=\\"08-11-21\\"/> Starting move from Seattle, WA to Denver, CO.</p>\\n\\n"],"names":[],"mappings":"AAQA,EAAE,eAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACvC,CAAC,AACA,MAAM,eAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AAEL,qBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var Updates = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `${$$result.head += `${$$result.title = `<title>home \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}"><a href="${"/etc"}" class="${"crumb svelte-1s7mnym"}">etc</a><small class="${"p svelte-1s7mnym"}">\xA0\u2022 updates </small></h1>

<p>${validate_component(Date_1, "Date").$$render($$result, { date: "08-11-21" }, {}, {})} Starting move from Seattle, WA to Denver, CO.</p>`;
});
var updates = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Updates
});
var css$5 = {
  code: ".p.svelte-lvhre9{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-lvhre9:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-lvhre9{text-decoration:none;color:rgba(0,0,0,0.78);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-lvhre9:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-lvhre9:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"plangs.svelte","sources":["plangs.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>programming langs \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\ncolor: rgba(0,0,0,0.55);  \\nfont-size: 1.9rem;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n}\\n.p:hover{\\n\\tcolor: rgba(0,0,0,0.85);\\n\\tpadding-left: 8px;\\n\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n    }\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.78);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n\\t\\t    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}\\n</style>\\n\\n<h1 id=\\"head\\"><a href=\\"/etc/\\" class=\\"crumb\\">etc</a><small class=\\"p\\"> &nbsp;\u2022 programming languagess</small></h1>\\n... or\\n<h2>programming langs that really bangs</h2>\\n<p>\\n...to write.\\n <Date date=\\"07/29/21\\"/>\\n </p>\\n\\n<h3>rustlang</h3>\\n<p>rust.</p>\\n\\n<h3>ziglang</h3>\\n<p>zig.</p>\\n\\n<h3>nim</h3>\\n<p>nim.</p>\\n\\n<h3>golang</h3>\\n<p>go.</p>\\n\\n<h3>python</h3>\\n<p>py.</p>\\n\\n\\n\\n"],"names":[],"mappings":"AAaA,EAAE,cAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,gBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACvC,CAAC,AACA,MAAM,cAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,oBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AAEL,oBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var hydrate$3 = false;
var prerender$3 = true;
var Plangs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$5);
  return `${$$result.head += `${$$result.title = `<title>programming langs \u2022 clp.is</title>`, ""}`, ""}





<h1 id="${"head"}"><a href="${"/etc/"}" class="${"crumb svelte-lvhre9"}">etc</a><small class="${"p svelte-lvhre9"}">\xA0\u2022 programming languagess</small></h1>
... or
<h2>programming langs that really bangs</h2>
<p>...to write.
 ${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})}</p>

<h3>rustlang</h3>
<p>rust.</p>

<h3>ziglang</h3>
<p>zig.</p>

<h3>nim</h3>
<p>nim.</p>

<h3>golang</h3>
<p>go.</p>

<h3>python</h3>
<p>py.</p>`;
});
var plangs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Plangs,
  hydrate: hydrate$3,
  prerender: prerender$3
});
var css$4 = {
  code: ".l.svelte-bth4dt{list-style:decimal}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<style>\\n   .l {\\n    list-style: decimal;\\n}\\n</style>\\n<h1>lab</h1>\\n<ul class=\\"l\\">\\n\\t<li><a class=\\"link ext\\" href=\\"https://github.com/clpi/dotfiles\\">dotfiles</a>:  &nbsp;&nbsp;My dotfiles for nvim, alacritty, tmux, etc.</li>\\n</ul>\\n"],"names":[],"mappings":"AACG,EAAE,cAAC,CAAC,AACH,UAAU,CAAE,OAAO,AACvB,CAAC"}'
};
var Lab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<h1>lab</h1>
<ul class="${"l svelte-bth4dt"}"><li><a class="${"link ext"}" href="${"https://github.com/clpi/dotfiles"}">dotfiles</a>:  \xA0\xA0My dotfiles for nvim, alacritty, tmux, etc.</li></ul>`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Lab
});
var css$3 = {
  code: ".tag.svelte-oucym9{padding:3px;margin:3px;border-radius:3px;font-size:0.85rem;color:rgba(0,0,0,0.28);background-color:rgba(0,0,0,0.06)}.tag.svelte-oucym9:hover{background-color:rgba(0,0,0,0.10);transform:scale(1.1);transition:all 0.2s ease-in-out;color:rgba(0,0,0,0.38)}.lite.svelte-oucym9{color:rgba(0,0,0,0.5)}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["\\n<svelte:head>\\n\\t<title>projects \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script>\\nimport  Date  from '$lib/date.svelte'\\n<\/script>\\n<style>\\n   /* :global(.ext::after) {\\ncontent: \\" [->]\\";\\nfont-size: 0.6rem;\\ntransition: all 0.15s ease-in-out;\\ncolor: rgba(0,0,0,0.4);\\n   }\\n   :global(.ext:hover::after) {\\ncontent: \\" [->]\\";\\ntransition: all 0.15s ease-in-out;\\n   } */\\n   .tag { \\npadding: 3px;\\nmargin: 3px;\\nborder-radius: 3px;\\nfont-size: 0.85rem;\\ncolor: rgba(0,0,0,0.28);\\nbackground-color: rgba(0,0,0,0.06);\\n\\n}\\n.tag:hover {\\n\\tbackground-color: rgba(0,0,0,0.10);\\n\\ttransform: scale(1.1);\\n\\ttransition: all 0.2s ease-in-out;\\ncolor: rgba(0,0,0,0.38);\\n    }\\n   .lite { color: rgba(0,0,0,0.5);}\\n</style>\\n<h1 id=\\"head\\">projects</h1>\\n<ul>\\n<li><a class=\\"link\\" href=\\"/p/recollection\\">recollection</a>  <a class=\\"link ext lite\\" href=\\"https://github.com/clpi/recollection\\"> (github)</a>:&nbsp;&nbsp; implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.<span class='tag'>#lib</span><span class='tag'>#rust</span><Date date=\\"07-29-21\\"/></li>\\n<li><a class=\\"link\\" href=\\"/p/iz\\">iz</a>  <a class=\\"link ext lite\\" href=\\"https://github.com/clpi/iz\\"> (github)</a>:&nbsp;&nbsp; Zig implementation of CLI utility to automate and motivate daily data tasks esp. regarding health, like logging blood glucose levels for type 1 diabetics and performing elementary data analaysis and management. Also using to learn zig and generally become more experienced, as well as  uprototyping certain ideas for down the road. <span class='tag'>#zig</span><span class=\\"tag\\">#nim</span><span class=\\"tag\\">#cli</span><Date date=\\"08-07-21\\"/></li>\\n</ul>\\n<p>Last updated <Date date=\\"08-07-21\\"/>. Not a comprehensive list</p>\\n<br/>\\n\\n\\n"],"names":[],"mappings":"AAmBG,IAAI,cAAC,CAAC,AACT,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CACX,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,OAAO,CAClB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAElC,CAAC,AACD,kBAAI,MAAM,AAAC,CAAC,AACX,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CACjC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACnB,CAAC,AACF,KAAK,cAAC,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAC,CAAC"}`
};
var P = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `${$$result.head += `${$$result.title = `<title>projects \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">projects</h1>
<ul><li><a class="${"link"}" href="${"/p/recollection"}">recollection</a>  <a class="${"link ext lite svelte-oucym9"}" href="${"https://github.com/clpi/recollection"}">(github)</a>:\xA0\xA0 implementations and reimplementations of common data structures &amp; algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.<span class="${"tag svelte-oucym9"}">#lib</span><span class="${"tag svelte-oucym9"}">#rust</span>${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</li>
<li><a class="${"link"}" href="${"/p/iz"}">iz</a>  <a class="${"link ext lite svelte-oucym9"}" href="${"https://github.com/clpi/iz"}">(github)</a>:\xA0\xA0 Zig implementation of CLI utility to automate and motivate daily data tasks esp. regarding health, like logging blood glucose levels for type 1 diabetics and performing elementary data analaysis and management. Also using to learn zig and generally become more experienced, as well as  uprototyping certain ideas for down the road. <span class="${"tag svelte-oucym9"}">#zig</span><span class="${"tag svelte-oucym9"}">#nim</span><span class="${"tag svelte-oucym9"}">#cli</span>${validate_component(Date_1, "Date").$$render($$result, { date: "08-07-21" }, {}, {})}</li></ul>
<p>Last updated ${validate_component(Date_1, "Date").$$render($$result, { date: "08-07-21" }, {}, {})}. Not a comprehensive list</p>
<br>`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": P
});
var css$2 = {
  code: ".p.svelte-1d7rk9a{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-1d7rk9a{text-decoration:none;color:rgba(0,0,0,0.82);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-1d7rk9a:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["\\n<svelte:head>\\n\\t<title>recollection \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\n    color: rgba(0,0,0,0.55);  \\n    font-size: 1.9rem;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n    }\\n    .p:hover{\\n\\t    color: rgba(0,0,0,0.85);\\n\\t    padding-left: 8px;\\n\\t    transition: all 0.2s ease-in-out;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t}\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.82);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n    /* :global(.ext::after) {\\n\\tcontent: \\" [->]\\";\\n\\tfont-size: 0.6rem;\\n\\tpadding-left:0px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(0,0,0,0.4);\\n    }\\n    :global(.ext:hover::after) {\\n\\tcontent: \\" [->]\\";\\n\\ttransition: all 0.15s ease-in-out;\\n    } */\\n</style>\\n\\n\\n<h1 id=\\"head\\"><a href=\\"/p\\" class=\\"crumb\\">projects</a><small class=\\"p\\"> &nbsp;\u2022 recollections </small></h1>\\n<h2>table of contents</h2>\\n<ul>\\n<li><a class=\\"link\\" href=\\"#about\\">about</a>\\n<li><a class=\\"link\\" href=\\"#links\\">links</a>\\n<li><a class=\\"link\\" href=\\"https://docs.rs/recollection\\">docs</a>\\n</ul>\\n<p><Date date=\\"07/29/21\\"/> implementations of common data structures & algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>\\n<h3>links</h3>\\n<ul>\\n<li><a class=\\"link ext\\" href=\\"https://crates.io/crate/recollection\\">crates.io</a></li>\\n<li><a class=\\"link ext\\" href=\\"https://lib.rs/crate/recollection\\">lib.rs</a></li>\\n<li><a class=\\"link ext\\" href=\\"https://github.com/clpi/recollection\\">github</a></li>\\n<li><a class=\\"link ext\\" href=\\"https://docs.rs/recollection\\">docs.rs</a> for documentation</li>\\n</ul>\\n\\n"],"names":[],"mappings":"AAcA,EAAE,eAAC,CAAC,AACA,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC9C,CAAC,AACG,MAAM,eAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AACL,qBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var hydrate$2 = false;
var prerender$2 = true;
var Recollection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>recollection \u2022 clp.is</title>`, ""}`, ""}






<h1 id="${"head"}"><a href="${"/p"}" class="${"crumb svelte-1d7rk9a"}">projects</a><small class="${"p svelte-1d7rk9a"}">\xA0\u2022 recollections </small></h1>
<h2>table of contents</h2>
<ul><li><a class="${"link"}" href="${"#about"}">about</a>
</li><li><a class="${"link"}" href="${"#links"}">links</a>
</li><li><a class="${"link"}" href="${"https://docs.rs/recollection"}">docs</a></li></ul>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})} implementations of common data structures &amp; algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>
<h3>links</h3>
<ul><li><a class="${"link ext"}" href="${"https://crates.io/crate/recollection"}">crates.io</a></li>
<li><a class="${"link ext"}" href="${"https://lib.rs/crate/recollection"}">lib.rs</a></li>
<li><a class="${"link ext"}" href="${"https://github.com/clpi/recollection"}">github</a></li>
<li><a class="${"link ext"}" href="${"https://docs.rs/recollection"}">docs.rs</a> for documentation</li></ul>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Recollection,
  hydrate: hydrate$2,
  prerender: prerender$2
});
var css$1 = {
  code: ".p.svelte-1d7rk9a{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-1d7rk9a{text-decoration:none;color:rgba(0,0,0,0.82);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-1d7rk9a:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>iz \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\n    color: rgba(0,0,0,0.55);  \\n    font-size: 1.9rem;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n    }\\n    .p:hover{\\n\\t    color: rgba(0,0,0,0.85);\\n\\t    padding-left: 8px;\\n\\t    transition: all 0.2s ease-in-out;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t}\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.82);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n    /* :global(.ext::after) {\\n\\tcontent: \\" [->]\\";\\n\\tfont-size: 0.6rem;\\n\\tpadding-left:0px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(0,0,0,0.4);\\n    }\\n    :global(.ext:hover::after) {\\n\\tcontent: \\" [->]\\";\\n\\ttransition: all 0.15s ease-in-out;\\n    } */\\n</style>\\n\\n\\n<h1 id=\\"head\\"><a href=\\"/p\\" class=\\"crumb\\">projects</a><small class=\\"p\\"> &nbsp;\u2022 iz </small></h1>\\n<h2>table of contents</h2>\\n<ul>\\n<li><a class=\\"link\\" href=\\"#about\\">about</a>\\n<li><a class=\\"link\\" href=\\"#links\\">links</a>\\n<li><a class=\\"link\\" href=\\"/p/iz/docs\\">docs</a>\\n</ul>\\n<h3 id=\\"about\\">about</h3>\\n<p><Date date=\\"08/07/21\\"/> A cli utility, built in Zig, which will serve to help me (and anybody else who might find it useful!) to manage day-to-date personal data management, logging, and automation tasks -- especially related to health data, and more specifically, with an initial focus on type 1 diabetes health data. Primarily serves to bolster my knowledge of data structures and algorithms at a lower level than Rust (no dependencies), learn the Zig programming language which I am currently very taken with, and develop a prototype framework for certain design decisions and functionality that will be implemented in certain larger-scope projects down the line. Also experimenting with the wasm32-wasi compilation target included with the Zig compiler, with the result published to <a href=\\"https://wapm.io/package/clpi/iz\\">WAPM</a>.</p>\\n<p><Date date=\\"08/07/21\\"/> I'm also implementing the same CLI utility in the Nim programming language (which I'm also coming to like quite a bit) in parallel with the Zig implementation (and also doing a parallel implementation in Rust). All will have manual data structure implementations (in Rust through <a href=\\"/p/recollection\\">recollection</a>), which will primarily serve to, again, bolster my knowledge of data structures & algorithms, and is also just a fun exercise in general.</p>\\n\\n<h3 id=\\"links\\">links</h3>\\n<ul>\\n<li><a class=\\"link ext\\" href=\\"https://wapm.io/package/clpi/iz\\">wapm.io</a></li>\\n<li><a class=\\"link ext\\" href=\\"https://github.com/clpi/recollection\\">github</a> (iz)</li>\\n</ul>\\n\\n"],"names":[],"mappings":"AAaA,EAAE,eAAC,CAAC,AACA,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC9C,CAAC,AACG,MAAM,eAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AACL,qBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var hydrate$1 = false;
var prerender$1 = true;
var Iz = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$1);
  return `${$$result.head += `${$$result.title = `<title>iz \u2022 clp.is</title>`, ""}`, ""}






<h1 id="${"head"}"><a href="${"/p"}" class="${"crumb svelte-1d7rk9a"}">projects</a><small class="${"p svelte-1d7rk9a"}">\xA0\u2022 iz </small></h1>
<h2>table of contents</h2>
<ul><li><a class="${"link"}" href="${"#about"}">about</a>
</li><li><a class="${"link"}" href="${"#links"}">links</a>
</li><li><a class="${"link"}" href="${"/p/iz/docs"}">docs</a></li></ul>
<h3 id="${"about"}">about</h3>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "08/07/21" }, {}, {})} A cli utility, built in Zig, which will serve to help me (and anybody else who might find it useful!) to manage day-to-date personal data management, logging, and automation tasks -- especially related to health data, and more specifically, with an initial focus on type 1 diabetes health data. Primarily serves to bolster my knowledge of data structures and algorithms at a lower level than Rust (no dependencies), learn the Zig programming language which I am currently very taken with, and develop a prototype framework for certain design decisions and functionality that will be implemented in certain larger-scope projects down the line. Also experimenting with the wasm32-wasi compilation target included with the Zig compiler, with the result published to <a href="${"https://wapm.io/package/clpi/iz"}">WAPM</a>.</p>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "08/07/21" }, {}, {})} I&#39;m also implementing the same CLI utility in the Nim programming language (which I&#39;m also coming to like quite a bit) in parallel with the Zig implementation (and also doing a parallel implementation in Rust). All will have manual data structure implementations (in Rust through <a href="${"/p/recollection"}">recollection</a>), which will primarily serve to, again, bolster my knowledge of data structures &amp; algorithms, and is also just a fun exercise in general.</p>

<h3 id="${"links"}">links</h3>
<ul><li><a class="${"link ext"}" href="${"https://wapm.io/package/clpi/iz"}">wapm.io</a></li>
<li><a class="${"link ext"}" href="${"https://github.com/clpi/recollection"}">github</a> (iz)</li></ul>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Iz,
  hydrate: hydrate$1,
  prerender: prerender$1
});
var css = {
  code: ".p.svelte-1d7rk9a{color:rgba(0,0,0,0.55);font-size:1.9rem;text-shadow:0px 0px 8px rgba(0,0,0,0.04)}.p.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.85);padding-left:8px;transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.12)}.crumb.svelte-1d7rk9a{text-decoration:none;color:rgba(0,0,0,0.82);border-bottom:2px solid rgba(0,0,0,0.12);transition:all 0.15s ease-in-out}.crumb.svelte-1d7rk9a:hover{color:rgba(0,0,0,0.98);text-shadow:0px 0px 8px rgba(0,0,0,0.12);border-bottom:2px solid rgba(0,0,0,0.4);transition:0.1s all ease-in}.crumb.svelte-1d7rk9a:visited{color:rgba(0,0,0,0.9);border-bottom:4px dotted rgba(0,0,0,0.1)\n\n		    }",
  map: `{"version":3,"file":"docs.svelte","sources":["docs.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>iz docs \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\nexport let title = \\"projets\\"\\n<\/script>\\n<style>\\n.p { \\n    color: rgba(0,0,0,0.55);  \\n    font-size: 1.9rem;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.04);\\n    }\\n    .p:hover{\\n\\t    color: rgba(0,0,0,0.85);\\n\\t    padding-left: 8px;\\n\\t    transition: all 0.2s ease-in-out;\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t}\\n\\t    .crumb {\\n\\t\\t    text-decoration: none;\\n\\t\\t    color: rgba(0,0,0,0.82);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.12);\\n\\t\\t    transition: all 0.15s ease-in-out;\\n\\t\\t}\\n\\t\\t.crumb:hover {\\n\\n\\t\\t    color: rgba(0,0,0,0.98);\\n\\t\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);\\n\\t\\t    border-bottom: 2px solid rgba(0,0,0,0.4);\\n\\t\\t    transition: 0.1s all ease-in;\\n\\t\\t    }\\n\\t\\t.crumb:visited {\\n\\t\\t    color: rgba(0,0,0,0.9);\\n\\t\\t    border-bottom: 4px dotted rgba(0,0,0,0.1)\\n\\n\\t\\t    }\\n    /* :global(.ext::after) {\\n\\tcontent: \\" [->]\\";\\n\\tfont-size: 0.6rem;\\n\\tpadding-left:0px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(0,0,0,0.4);\\n    }\\n    :global(.ext:hover::after) {\\n\\tcontent: \\" [->]\\";\\n\\ttransition: all 0.15s ease-in-out;\\n    } */\\n</style>\\n\\n\\n<h1 id=\\"head\\"><a href=\\"/p\\" class=\\"crumb\\">projects</a><small class=\\"p\\"> &nbsp;\u2022 iz documentation</small></h1>\\n<p>(Nothing here yet!)</p>\\n"],"names":[],"mappings":"AAaA,EAAE,eAAC,CAAC,AACA,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,SAAS,CAAE,MAAM,CACf,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC3C,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAC/B,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC9C,CAAC,AACG,MAAM,eAAC,CAAC,AACP,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACrC,CAAC,AACD,qBAAM,MAAM,AAAC,CAAC,AAEV,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,OAAO,AAC5B,CAAC,AACL,qBAAM,QAAQ,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC;;MAEzC,CAAC"}`
};
var hydrate = false;
var prerender = true;
var Docs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "projets" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>iz docs \u2022 clp.is</title>`, ""}`, ""}






<h1 id="${"head"}"><a href="${"/p"}" class="${"crumb svelte-1d7rk9a"}">projects</a><small class="${"p svelte-1d7rk9a"}">\xA0\u2022 iz documentation</small></h1>
<p>(Nothing here yet!)</p>`;
});
var docs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Docs,
  hydrate,
  prerender
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
