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
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
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
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
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
    const send2 = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send2(options2);
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
              } catch (error2) {
                reject(error2);
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
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
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
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
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
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded: loaded2, fetched, uses_credentials }) => {
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
      maxage = loaded2.maxage;
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
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
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
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded2) {
  const has_error_status = loaded2.status && loaded2.status >= 400 && loaded2.status <= 599 && !loaded2.redirect;
  if (loaded2.error || has_error_status) {
    const status = loaded2.status;
    if (!loaded2.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded2.error === "string" ? new Error(loaded2.error) : loaded2.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded2.redirect) {
    if (!loaded2.status || Math.floor(loaded2.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded2.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded2;
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
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded2;
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
      load_input.error = error2;
    }
    loaded2 = await module2.load.call(null, load_input);
  } else {
    loaded2 = {};
  }
  if (!loaded2 && is_leaf && !is_error)
    return;
  if (!loaded2) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded2),
    context: loaded2.context || context,
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
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded2 = await load_node({
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
    loaded2,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded2 ? loaded2.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
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
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return {
      status: 500,
      headers: {},
      body: error3.stack
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
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
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
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded2;
        if (node) {
          try {
            loaded2 = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded2)
              return;
            if (loaded2.loaded.redirect) {
              return {
                status: loaded2.loaded.status,
                headers: {
                  location: encodeURI(loaded2.loaded.redirect)
                }
              };
            }
            if (loaded2.loaded.error) {
              ({ status, error: error2 } = loaded2.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error2 = e;
          }
          if (loaded2 && !error2) {
            branch.push(loaded2);
          }
          if (error2) {
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
                    error: error2
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
              error: error2
            });
          }
        }
        if (loaded2 && loaded2.loaded.context) {
          context = {
            ...context,
            ...loaded2.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
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
function subscribe(store, ...callbacks2) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks2);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function custom_event(type, detail) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, false, false, detail);
  return e;
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
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks2 = component.$$.callbacks[type];
    if (callbacks2) {
      const event = custom_event(type, detail);
      callbacks2.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
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
function escape_attribute_value(value) {
  return typeof value === "string" ? escape2(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
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
var Hooks = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Hooks
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
      file: "/./_app/start-e2fede94.js",
      css: ["/./_app/assets/start-c550a47d.css"],
      js: ["/./_app/start-e2fede94.js", "/./_app/chunks/vendor-6926e56a.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2) => {
      if (error2.frame) {
        console.error(error2.frame);
      }
      console.error(error2.stack);
      error2.stack = options.get_stack(error2);
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
  assets: [{ "file": ".DS_Store", "size": 6148, "type": null }, { "file": "android-chrome-192x192.png", "size": 6276, "type": "image/png" }, { "file": "android-chrome-512x512.png", "size": 18608, "type": "image/png" }, { "file": "apple-touch-icon.png", "size": 5755, "type": "image/png" }, { "file": "favicon-16x16.png", "size": 579, "type": "image/png" }, { "file": "favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "favicon.png", "size": 1138, "type": "image/png" }, { "file": "me/closed.jpeg", "size": 1620728, "type": "image/jpeg" }, { "file": "me/cout.jpeg", "size": 2039614, "type": "image/jpeg" }, { "file": "me/stare.jpeg", "size": 3015008, "type": "image/jpeg" }, { "file": "me/zoomedcout.jpeg", "size": 456628, "type": "image/jpeg" }, { "file": "swappy-20210729_134838.png", "size": 488459, "type": "image/png" }, { "file": "swappy-20210729_135416.png", "size": 556530, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/resources\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/resources/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/pics\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about/pics.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/links\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/links/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", , "src/routes/posts/index.svelte"],
      b: ["src/routes/__error.svelte", "src/routes/posts/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/tag\/([^/]+?)\/?$/,
      params: (m) => ({ tag: d(m[1]) }),
      a: ["src/routes/__layout.svelte", , "src/routes/posts/tag/[tag].svelte"],
      b: ["src/routes/__error.svelte", "src/routes/posts/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/posts\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", , "src/routes/posts/[slug].svelte"],
      b: ["src/routes/__error.svelte", "src/routes/posts/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/signup\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/signup/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/login\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/login/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/login\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/login.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/uses\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/uses.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/lastfm\/tracks\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return tracks;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/lastfm\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return lastfm;
      })
    },
    {
      type: "page",
      pattern: /^\/etc\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/frontend\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/frontend/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/laptops\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/laptops.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/updates\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/updates.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/plangs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/plangs.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/ling\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/ling/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/ling\/russian\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/ling/russian/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/etc\/ling\/con\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/etc/ling/con/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/lab\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/lab/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", , "src/routes/p/index.svelte"],
      b: ["src/routes/__error.svelte", "src/routes/p/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/recollection\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", , "src/routes/p/recollection/index.svelte"],
      b: ["src/routes/__error.svelte", "src/routes/p/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/iz\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", , "src/routes/p/iz/index.svelte"],
      b: ["src/routes/__error.svelte", "src/routes/p/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/p\/iz\/docs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", , "src/routes/p/iz/docs.svelte"],
      b: ["src/routes/__error.svelte", "src/routes/p/__error.svelte"]
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
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error$2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$g;
  }),
  "src/routes/resources/index.svelte": () => Promise.resolve().then(function() {
    return index$f;
  }),
  "src/routes/about/index.svelte": () => Promise.resolve().then(function() {
    return index$e;
  }),
  "src/routes/about/pics.svelte": () => Promise.resolve().then(function() {
    return pics;
  }),
  "src/routes/links/index.svelte": () => Promise.resolve().then(function() {
    return index$d;
  }),
  "src/routes/posts/__error.svelte": () => Promise.resolve().then(function() {
    return __error$1;
  }),
  "src/routes/posts/index.svelte": () => Promise.resolve().then(function() {
    return index$c;
  }),
  "src/routes/posts/tag/[tag].svelte": () => Promise.resolve().then(function() {
    return _tag_;
  }),
  "src/routes/posts/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  }),
  "src/routes/auth/index.svelte": () => Promise.resolve().then(function() {
    return index$b;
  }),
  "src/routes/auth/signup/index.svelte": () => Promise.resolve().then(function() {
    return index$a;
  }),
  "src/routes/auth/login/index.svelte": () => Promise.resolve().then(function() {
    return index$9;
  }),
  "src/routes/auth/login.svelte": () => Promise.resolve().then(function() {
    return login;
  }),
  "src/routes/uses.svelte": () => Promise.resolve().then(function() {
    return uses;
  }),
  "src/routes/etc/index.svelte": () => Promise.resolve().then(function() {
    return index$8;
  }),
  "src/routes/etc/frontend/index.svelte": () => Promise.resolve().then(function() {
    return index$7;
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
  "src/routes/etc/ling/index.svelte": () => Promise.resolve().then(function() {
    return index$6;
  }),
  "src/routes/etc/ling/russian/index.svelte": () => Promise.resolve().then(function() {
    return index$5;
  }),
  "src/routes/etc/ling/con/index.svelte": () => Promise.resolve().then(function() {
    return index$4;
  }),
  "src/routes/lab/index.svelte": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/p/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
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
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-25195a89.js", "css": ["/./_app/assets/pages/__layout.svelte-5b0dd24c.css"], "js": ["/./_app/pages/__layout.svelte-25195a89.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "/./_app/pages/__error.svelte-d1dce897.js", "css": [], "js": ["/./_app/pages/__error.svelte-d1dce897.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-4e1e7152.js", "css": ["/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/index.svelte-4e1e7152.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/resources/index.svelte": { "entry": "/./_app/pages/resources/index.svelte-eedb98e5.js", "css": [], "js": ["/./_app/pages/resources/index.svelte-eedb98e5.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/about/index.svelte": { "entry": "/./_app/pages/about/index.svelte-6d1e0d34.js", "css": ["/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/about/index.svelte-6d1e0d34.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/about/pics.svelte": { "entry": "/./_app/pages/about/pics.svelte-4e8eb59f.js", "css": ["/./_app/assets/pages/about/pics.svelte-2fa41759.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/about/pics.svelte-4e8eb59f.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/links/index.svelte": { "entry": "/./_app/pages/links/index.svelte-24277c6d.js", "css": [], "js": ["/./_app/pages/links/index.svelte-24277c6d.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/posts/__error.svelte": { "entry": "/./_app/pages/posts/__error.svelte-d00d716d.js", "css": [], "js": ["/./_app/pages/posts/__error.svelte-d00d716d.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/posts/index.svelte": { "entry": "/./_app/pages/posts/index.svelte-a7e0bbe6.js", "css": [], "js": ["/./_app/pages/posts/index.svelte-a7e0bbe6.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/posts/tag/[tag].svelte": { "entry": "/./_app/pages/posts/tag/[tag].svelte-a6c56853.js", "css": [], "js": ["/./_app/pages/posts/tag/[tag].svelte-a6c56853.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/posts/[slug].svelte": { "entry": "/./_app/pages/posts/[slug].svelte-202b788b.js", "css": [], "js": ["/./_app/pages/posts/[slug].svelte-202b788b.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/auth/index.svelte": { "entry": "/./_app/pages/auth/index.svelte-72652715.js", "css": ["/./_app/assets/pages/auth/index.svelte-d3fe2b48.css"], "js": ["/./_app/pages/auth/index.svelte-72652715.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/auth/signup/index.svelte": { "entry": "/./_app/pages/auth/signup/index.svelte-5148a3f7.js", "css": [], "js": ["/./_app/pages/auth/signup/index.svelte-5148a3f7.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/auth/login/index.svelte": { "entry": "/./_app/pages/auth/login/index.svelte-76c60587.js", "css": [], "js": ["/./_app/pages/auth/login/index.svelte-76c60587.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/auth/login.svelte": { "entry": "/./_app/pages/auth/login.svelte-eefcbe86.js", "css": [], "js": ["/./_app/pages/auth/login.svelte-eefcbe86.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/uses.svelte": { "entry": "/./_app/pages/uses.svelte-ea5af438.js", "css": ["/./_app/assets/pages/uses.svelte-09104085.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/uses.svelte-ea5af438.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/index.svelte": { "entry": "/./_app/pages/etc/index.svelte-f06a1c9d.js", "css": ["/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/etc/index.svelte-f06a1c9d.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/frontend/index.svelte": { "entry": "/./_app/pages/etc/frontend/index.svelte-5e830a08.js", "css": ["/./_app/assets/pages/etc/frontend/index.svelte-1716761b.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/etc/frontend/index.svelte-5e830a08.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/laptops.svelte": { "entry": "/./_app/pages/etc/laptops.svelte-f6828f41.js", "css": ["/./_app/assets/pages/etc/laptops.svelte-d46d2292.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/etc/laptops.svelte-f6828f41.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/updates.svelte": { "entry": "/./_app/pages/etc/updates.svelte-65df771b.js", "css": ["/./_app/assets/pages/etc/frontend/index.svelte-1716761b.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/etc/updates.svelte-65df771b.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/plangs.svelte": { "entry": "/./_app/pages/etc/plangs.svelte-f62b635a.js", "css": ["/./_app/assets/pages/etc/laptops.svelte-d46d2292.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/etc/plangs.svelte-f62b635a.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/etc/ling/index.svelte": { "entry": "/./_app/pages/etc/ling/index.svelte-fc64c216.js", "css": [], "js": ["/./_app/pages/etc/ling/index.svelte-fc64c216.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/etc/ling/russian/index.svelte": { "entry": "/./_app/pages/etc/ling/russian/index.svelte-3861f38f.js", "css": [], "js": ["/./_app/pages/etc/ling/russian/index.svelte-3861f38f.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/etc/ling/con/index.svelte": { "entry": "/./_app/pages/etc/ling/con/index.svelte-d0f56a51.js", "css": [], "js": ["/./_app/pages/etc/ling/con/index.svelte-d0f56a51.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/lab/index.svelte": { "entry": "/./_app/pages/lab/index.svelte-4e822258.js", "css": ["/./_app/assets/pages/lab/index.svelte-c2f25261.css"], "js": ["/./_app/pages/lab/index.svelte-4e822258.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/p/__error.svelte": { "entry": "/./_app/pages/p/__error.svelte-510c9086.js", "css": [], "js": ["/./_app/pages/p/__error.svelte-510c9086.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] }, "src/routes/p/index.svelte": { "entry": "/./_app/pages/p/index.svelte-658c1903.js", "css": ["/./_app/assets/pages/p/index.svelte-ccb2e8be.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/p/index.svelte-658c1903.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/p/recollection/index.svelte": { "entry": "/./_app/pages/p/recollection/index.svelte-899222e4.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/p/recollection/index.svelte-899222e4.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/p/iz/index.svelte": { "entry": "/./_app/pages/p/iz/index.svelte-6e2d63b7.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/p/iz/index.svelte-6e2d63b7.js", "/./_app/chunks/vendor-6926e56a.js", "/./_app/chunks/date-97fcd7e7.js"], "styles": [] }, "src/routes/p/iz/docs.svelte": { "entry": "/./_app/pages/p/iz/docs.svelte-82999fa7.js", "css": ["/./_app/assets/pages/p/recollection/index.svelte-ef4dd6ed.css", "/./_app/assets/date.svelte_svelte&type=style&lang-5d2bc558.css"], "js": ["/./_app/pages/p/iz/docs.svelte-82999fa7.js", "/./_app/chunks/vendor-6926e56a.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render$1(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender2 });
}
var VITE_LASTFM_API_ROOT = "http://ws.audioscrobbler.com/2.0/";
var clientId = {}.LASTFM_API_KEY;
var clientSecret = {}.LASTFM_API_SECRET;
async function get(req) {
  console.log(clientId, clientSecret);
  const res = await fetch(VITE_LASTFM_API_ROOT + "?method=user.getrecenttracks&user=ooohm&api_key=" + clientSecret + "&format=json&limit=1").then((r) => r.json());
  return {
    body: res
  };
}
var tracks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var lastfm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
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
  code: 'body{border:5px solid black;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:0% 4% 2% 4%;font-weight:300;font-family:Helvetica}a.svelte-13331y7.svelte-13331y7{text-decoration:none}#title.svelte-13331y7.svelte-13331y7{border-radius:4px;font-family:Helvetica;padding:10px 0px 0px 10px;font-size:1.9rem;margin-right:1.5%;margin-left:1%;transition:all 0.1s;color:rgba(0,0,0,0.77);font-weight:300;letter-spacing:-2px;display:inline-flex;text-shadow:0px 0px 8px rgba(0,0,0,0.10)}#title.svelte-13331y7.svelte-13331y7::after{content:".is ";font-weight:100;color:rgba(0,0,0,0.20);color:rgba(130,210,150,0.6);letter-spacing:0px;text-shadow:0px 0px 15px rgba(0,0,0,0.06)}li.svelte-13331y7 a.svelte-13331y7::before{content:"*";padding-right:4px;transition:all 0.15s ease-in-out;color:rgba(130,220,150,0.0)}li.svelte-13331y7:hover a.active.svelte-13331y7::before{transform:scale(1.3)}li.svelte-13331y7:hover a.active.svelte-13331y7{transform:scale(1.3)}li.svelte-13331y7 a.active.svelte-13331y7::before{content:"\u2022";color:rgba(130,220,150,0.6);padding-right:07px;padding-left:07px;transition:all 0.15s ease-in-out;text-shadow:0px 0px 15px rgba(130,220,150,0.25)}#title.svelte-13331y7.svelte-13331y7:active{transform:scale(0.75);transition:0.15s all ease-in-out}#title.svelte-13331y7.svelte-13331y7:hover{transform:scale(1.15);transition:all 0.05s;opacity:0.9}li.svelte-13331y7 a.svelte-13331y7{color:rgba(0,0,0,0.32);text-decoration:none;padding:7px 8px;border-radius:0px;letter-spacing:-0px;display:inline;text-shadow:0px 0px 7px rgba(0,0,0,0.05)}.active.svelte-13331y7.svelte-13331y7{transform:scale(1.1);transition:all 0.2s ease-in-out;text-shadow:0px 0px 8px rgba(0,0,0,0.09);color:rgba(0,0,0,0.95)}nav.svelte-13331y7 ul li a.svelte-13331y7{font-size:0.95rem;margin-right:1.1vw;text-shadow:0px 1px 6px rgba(0,0,0,0.05);font-size:0.97rem}nav.svelte-13331y7 ul li a.active.svelte-13331y7{text-shadow:0px 1px 10px rgba(0,0,0,0.08)}nav.svelte-13331y7.svelte-13331y7{color:var(--fg-light);margin-bottom:0%;padding:0% 0%;display:block;height:90px}ul.svelte-13331y7.svelte-13331y7{margin-top:0%;display:inline-flex}ul.svelte-13331y7 li.svelte-13331y7{display:inline-block;position:relative}.right.svelte-13331y7.svelte-13331y7{position:relative;display:inline-block}.right.svelte-13331y7.svelte-13331y7{float:right;margin-right:2.5%;margin-top:1.6%}.right.svelte-13331y7 a.svelte-13331y7{color:rgba(0,0,0,0.10);transition:all 0.2s linear;font-size:0.84rem}#etc.svelte-13331y7.svelte-13331y7{padding:3px;letter-spacing:-0px;padding-right:5px;color:rgba(0,0,0,0.3);font-size:0.8rem}.right.svelte-13331y7 a.svelte-13331y7:hover{color:rgba(0,0,0,0.4);background:#fffdfc;transition:all 0.02s}.right.svelte-13331y7 .active.svelte-13331y7{color:rgba(0,0,0,0.85)}.tabl.svelte-13331y7.svelte-13331y7{clear:both;padding:0px;margin:0px;display:inline}li.svelte-13331y7.svelte-13331y7:hover{transform:scale(1.05);transition:all 0.25s ease-in-out}li.svelte-13331y7:hover a.svelte-13331y7{color:rgba(0,0,0,0.9);border-radius:0px;transition:all 0.025s ease-in-out}',
  map: `{"version":3,"file":"nav.svelte","sources":["nav.svelte"],"sourcesContent":["<script>\\nexport let section = \\"Home\\";\\nimport { page} from '$app/stores'\\n<\/script>\\n\\n<style>\\n:global(body) {\\n\\tborder: 5px solid black;\\n\\theight: 100vh;\\n\\tmin-height: 100vh;\\n\\tmargin: 0;\\n\\tmax-width: 100%;\\n\\toverflow-x: hidden;\\n\\tpadding: 0% 4% 2% 4%;\\n\\tfont-weight: 300;\\n\\tfont-family:\\n\\t\\tHelvetica;\\n}\\na { text-decoration:none; }\\n#title {\\n\\tborder-radius: 4px;\\n\\tfont-family: Helvetica;\\n\\tpadding: 10px 0px 0px 10px;\\n\\tfont-size: 1.9rem;\\n\\tmargin-right: 1.5%;\\n\\tmargin-left:1%;\\n\\t/* border: 2px solid rgba(0,0,0,0.6); */\\n\\ttransition: all 0.1s;\\n\\tcolor: rgba(0,0,0,0.77);\\n\\t/* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */\\n\\tfont-weight: 300;\\n\\tletter-spacing: -2px;\\n\\tdisplay:inline-flex;\\n\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.10);\\n}\\n#title::after {\\n\\tcontent: \\".is \\";\\n\\tfont-weight:100;\\n\\tcolor: rgba(0,0,0,0.20);\\n\\tcolor: rgba(130,210,150,0.6);\\n\\tletter-spacing:0px;\\n\\ttext-shadow: 0px 0px 15px rgba(0,0,0,0.06);\\n}\\nspan {\\n\\tdisplay:inline-flex;\\n}\\nli a::before {\\n\\tcontent: \\"*\\";\\n\\tpadding-right: 4px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tcolor: rgba(130,220,150,0.0);\\n\\n}\\nli:hover a.active::before {\\n    transform:scale(1.3);\\n    }\\n    li:hover a.active {\\n\\t    transform:scale(1.3);\\n\\t}\\nli a.active::before {\\n\\tcontent: \\"\u2022\\";\\n\\tcolor: rgba(130,220,150,0.6);\\n\\tpadding-right:07px;\\n\\tpadding-left: 07px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\ttext-shadow: 0px 0px 15px rgba(130,220,150,0.25);\\n\\n}\\n#title:active {\\n    transform:scale(0.75);\\n    transition:0.15s all ease-in-out;\\n}\\n#title:hover {\\n\\ttransform: scale(1.15);\\n\\ttransition: all 0.05s;\\n\\topacity: 0.9;\\n}\\nli a {\\n\\tcolor:rgba(0,0,0,0.32);\\n\\ttext-decoration: none;\\n\\tpadding: 7px 8px;\\n\\t/* border-bottom-color: rgba(0,0,0,0.4); */\\n\\tborder-radius: 0px;\\n\\tletter-spacing: -0px;\\n\\tdisplay:inline;\\n\\n\\ttext-shadow: 0px 0px 7px rgba(0,0,0,0.05);\\n}\\n.active {\\n\\ttransform: scale(1.1);\\n\\ttransition: all 0.2s ease-in-out;\\n\\ttext-shadow: 0px 0px 8px rgba(0,0,0,0.09);\\n\\tcolor: rgba(0,0,0,0.95);\\n    }\\n    /* a.active::before {\\n\\t    content: \\">\\";\\n\\t    transition: all 0.05s ease-in-out;\\n\\t    color: rgba(0,0,0,0.15);\\n\\t    text-shadow: 0px 1px 8px rgba(0,0,0,0.1);\\n\\t    opacity: 100%;\\n\\t}N*/\\nnav ul li a {\\n\\tfont-size: 0.95rem;\\n\\tmargin-right: 1.1vw;\\n\\ttext-shadow: 0px 1px 6px rgba(0,0,0,0.05);\\n    font-size:0.97rem;\\n}\\nnav ul li a.active {\\n\\ttext-shadow: 0px 1px 10px rgba(0,0,0,0.08);\\n}\\nnav {\\n\\tcolor: var(--fg-light);\\n\\tmargin-bottom: 0%;\\n\\tpadding: 0% 0%;\\n\\tdisplay: block;\\n\\theight: 90px;\\n}\\nul {\\n\\tmargin-top: 0%;\\n\\tdisplay: inline-flex;\\n}\\nul li {\\n\\tdisplay: inline-block;\\n\\tposition:relative;\\n}\\n.left, .right {\\n\\tposition: relative;\\n\\tdisplay: inline-block;\\n}\\n.right {\\n\\tfloat:right;\\n\\tmargin-right: 2.5%;\\n\\tmargin-top: 1.6%;\\n}\\n.left {\\n\\tfloat: left;\\n\\tdisplay: inline-flex;\\n}\\n.right a {\\n\\tcolor: rgba(0,0,0,0.10);\\n\\ttransition:all 0.2s linear;\\n\\tfont-size: 0.84rem;\\n}\\n#etc{\\n\\tpadding: 3px;\\n\\tletter-spacing: -0px;\\n\\tpadding-right: 5px;\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size:0.8rem;\\n}\\n.right a:hover{\\n\\tcolor: rgba(0,0,0,0.4);\\n\\tbackground: #fffdfc;\\n\\ttransition: all 0.02s;\\n\\t/* transform:scale(1.1); */\\n\\n}\\n.right .active {\\n    color: rgba(0,0,0,0.85);\\n    }\\n.tabl {\\n\\tclear: both;\\n\\tpadding:0px;\\n\\tmargin:0px;\\n\\tdisplay:inline;\\n}\\nli:hover {\\n\\ttransform:scale(1.05);\\n\\ttransition: all 0.25s ease-in-out;\\n}\\nli:hover a {\\n\\tcolor: rgba(0,0,0,0.9);\\n\\tborder-radius: 0px;\\n\\ttransition: all 0.025s ease-in-out;\\n}\\n#sect {\\n\\tfont-size: 1.0rem;\\n\\tmargin-left: 4%;\\n}\\n\\n\\n</style>\\n\\n<nav>\\n\\t<a href=\\"/\\"><div id=\\"title\\">clp</div></a>\\n\\t\\t\\t <div class=\\"tabl\\">\\n\\t\\t<ul class=\\"navbar\\">\\n\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/\\">\\n\\t\\t\\tHome</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/about\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/about\\">About</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/posts\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/posts\\">Posts</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/p\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/p\\">Projects</a></li>\\n\\t\\t\\t<li><a class:active={ $page.path == \\"/etc\\" } class=\\"nav\\" sveltekit:prefetch href=\\"/etc\\">Etc</a></li>\\n\\n\\t\\t</ul>\\n\\t\\t\\t </div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class:active={ $page.path == \\"/lab\\" } class=\\"nav\\" id=\\"etc\\" href=\\"/lab\\">Lab</a>\\n\\t\\t\\t<a class:active={ $page.path == \\"/auth\\" } class=\\"nav\\" id=\\"etc\\" href=\\"/auth\\">Auth</a>\\n\\t\\t\\t<a class:active={ $page.path == \\"/auth\\" } class=\\"nav\\" id=\\"etc\\" href=\\"https://api.clp.is/\\">API</a>\\n\\n\\t\\t</div>\\n</nav>\\n"],"names":[],"mappings":"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"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { section = "Home" } = $$props;
  if ($$props.section === void 0 && $$bindings.section && section !== void 0)
    $$bindings.section(section);
  $$result.css.add(css$f);
  $$unsubscribe_page();
  return `<nav class="${"svelte-13331y7"}"><a href="${"/"}" class="${"svelte-13331y7"}"><div id="${"title"}" class="${"svelte-13331y7"}">clp</div></a>
			 <div class="${"tabl svelte-13331y7"}"><ul class="${"navbar svelte-13331y7"}"><li class="${"svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/"}">Home</a></li>
			<li class="${"svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/about" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/about"}">About</a></li>
			<li class="${"svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/posts" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/posts"}">Posts</a></li>
			<li class="${"svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/p" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/p"}">Projects</a></li>
			<li class="${"svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/etc" ? "active" : ""].join(" ").trim()}" sveltekit:prefetch href="${"/etc"}">Etc</a></li></ul></div>
		<div class="${"right svelte-13331y7"}"><a class="${["nav svelte-13331y7", $page.path == "/lab" ? "active" : ""].join(" ").trim()}" id="${"etc"}" href="${"/lab"}">Lab</a>
			<a class="${["nav svelte-13331y7", $page.path == "/auth" ? "active" : ""].join(" ").trim()}" id="${"etc"}" href="${"/auth"}">Auth</a>
			<a class="${["nav svelte-13331y7", $page.path == "/auth" ? "active" : ""].join(" ").trim()}" id="${"etc"}" href="${"https://api.clp.is/"}">API</a></div></nav>`;
});
var css$e = {
  code: "p.svelte-x2mpcs.svelte-x2mpcs{color:rgba(0,0,0,0.3);font-size:0.75rem}a.svelte-x2mpcs.svelte-x2mpcs,#crea.svelte-x2mpcs.svelte-x2mpcs{text-decoration:none;font-size:0.75rem;color:rgba(140,220,160,0.8)}.nav.svelte-x2mpcs.svelte-x2mpcs:hover{transition:all 0.25s ease-in-out}footer.svelte-x2mpcs.svelte-x2mpcs{color:rgba(0,0,0,0.3);font-size:0.8rem;padding:4px;margin-top:3%;position:relative;bottom:0;display:block}svg.svelte-x2mpcs.svelte-x2mpcs,path.svelte-x2mpcs.svelte-x2mpcs{color:rgba(150,210,170,0.4);opacity:50%}.right.svelte-x2mpcs a.svelte-x2mpcs:hover{color:rgba(0,0,0,0.5);text-shadow:0px 0px 16px rgba(0,0,0,0.10);transition:all 0.15s ease-in-out}.right.svelte-x2mpcs a.svelte-x2mpcs{padding-left:3px;margin-left:5px;color:rgba(0,0,0,0.16);text-shadow:0px 0px 10px rgba(0,0,0,0.05);font-size:0.78rem}.left.svelte-x2mpcs.svelte-x2mpcs,.right.svelte-x2mpcs.svelte-x2mpcs{position:relative;display:inline-block}.right.svelte-x2mpcs.svelte-x2mpcs{float:right;margin-top:1%}.left.svelte-x2mpcs.svelte-x2mpcs{float:left;display:inline-flex}",
  map: '{"version":3,"file":"footer.svelte","sources":["footer.svelte"],"sourcesContent":["<footer>\\n\\t<div class=\\"left\\">\\n\\t<p class=\\"foot\\">Last updated <span id=\\"crea\\">July 29, 2021</span></p>\\n\\t<p class=\\"foot\\"><a href=\\"mailto:clp@clp.is\\">Email</a> me</p>\\n\\t</div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gl\\" href=\\"https://gitlab.com/clpi\\">\\n\\t\\t\\t<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" width=12 height=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>GitLab</title><path d=\\"M4.845.904c-.435 0-.82.28-.955.692C2.639 5.449 1.246 9.728.07 13.335a1.437 1.437 0 00.522 1.607l11.071 8.045c.2.145.472.144.67-.004l11.073-8.04a1.436 1.436 0 00.522-1.61c-1.285-3.942-2.683-8.256-3.817-11.746a1.004 1.004 0 00-.957-.684.987.987 0 00-.949.69l-2.405 7.408H8.203l-2.41-7.408a.987.987 0 00-.942-.69h-.006zm-.006 1.42l2.173 6.678H2.675zm14.326 0l2.168 6.678h-4.341zm-10.593 7.81h6.862c-1.142 3.52-2.288 7.04-3.434 10.559L8.572 10.135zm-5.514.005h4.321l3.086 9.5zm13.567 0h4.325c-2.467 3.17-4.95 6.328-7.411 9.502 1.028-3.167 2.059-6.334 3.086-9.502zM2.1 10.762l6.977 8.947-7.817-5.682a.305.305 0 01-.112-.341zm19.798 0l.952 2.922a.305.305 0 01-.11.341v.002l-7.82 5.68.026-.035z\\"/></svg>\\n\\t\\t\\tGitLab</a>\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gh\\" href=\\"https://github.com/clpi\\">\\n<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" width=12 height=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>GitHub</title><path d=\\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\\"/></svg>\\n\\t\\t\\tGitHub</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://twitter.com/clp_is\\">\\n\\t\\t\\t<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" width=12 height=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>Twitter</title><path d=\\"M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z\\"/></svg>\\n\\t\\t\\tTwitter</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://linkedin.com/in/chrispecunies\\">\\n\\t\\t\\t<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" width=12 height=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>LinkedIn</title><path d=\\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\\"/></svg>\\n\\t\\t\\tLinkedIn</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://facebook.com/chrispecunies\\">\\n\\t\\t\\t<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" width=12 height=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>Facebook</title><path d=\\"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z\\"/></svg>\\n\\t\\t\\tFacebook</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://last.fm/user/ooohm\\">\\n\\t\\t<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" height=12 width=12 xmlns=\\"http://www.w3.org/2000/svg\\"><title>Last.fm</title><path d=\\"M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.382 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.666 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.63-3.931l-1.758-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.729-3.492-2.474 0-4.893.935-4.893 3.932 0 1.87.907 3.051 3.189 3.601l1.87.44c1.402.33 1.869.907 1.869 1.704 0 1.017-.99 1.43-2.86 1.43-2.776 0-3.93-1.457-4.59-3.464l-.907-2.75c-1.155-3.573-2.997-4.893-6.653-4.893C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.106 0 4.591-1.457 4.591-1.457z\\"/></svg>\\n\\t\\t\\tLast.fm</a>\\n\\t\\t</div>\\n\\n</footer>\\n<style>\\np {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.75rem;\\n\\n}\\na,#crea {\\n\\ttext-decoration:none;\\n\\tfont-size: 0.75rem;\\n\\tcolor: rgba(140,220,160,0.8);\\n}\\n.nav:hover {\\n\\t/* padding: 8px 5px; */\\n\\ttransition: all 0.25s ease-in-out;\\n}\\nfooter {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.8rem;\\n\\tpadding: 4px;\\n\\tmargin-top: 3%;\\n\\tposition:relative;\\n\\tbottom:0;\\n\\tdisplay: block;\\n}\\nsvg,path {\\n\\tcolor: rgba(150,210,170,0.4);\\n\\topacity:50%;\\n    }\\n.right a:hover{\\n\\tcolor: rgba(0,0,0,0.5);\\n\\t/* border: 2px solid rgba(0,0,0,0.4); */\\n\\t/* background: #fffdfc; */\\n\\t/* border-radius: 4px; */\\n\\ttext-shadow:0px 0px 16px rgba(0,0,0,0.10);\\n\\t/* box-shadow: 0px 0px 6px rgba(0,0,0,0.07); */\\n\\ttransition:all 0.15s ease-in-out;\\n\\n}\\n.right a {\\n\\t/* color: #fffdfc; */\\n\\tpadding-left: 3px;\\n\\tmargin-left: 5px;\\n\\t/* border: 2px solid rgba(0,0,0,0.2); */\\n\\tcolor: rgba(0,0,0,0.16);\\n\\ttext-shadow:0px 0px 10px rgba(0,0,0,0.05);\\n\\tfont-size:0.78rem;\\n}\\n.left, .right {\\n\\tposition: relative;\\n\\tdisplay: inline-block;\\n}\\n.right {\\n\\tfloat:right;\\n\\tmargin-top: 1%;\\n}\\n.left {\\n\\tfloat: left;\\n\\tdisplay: inline-flex;\\n}\\n</style>\\n"],"names":[],"mappings":"AA4BA,CAAC,4BAAC,CAAC,AACF,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,OAAO,AAEnB,CAAC,AACD,6BAAC,CAAC,KAAK,4BAAC,CAAC,AACR,gBAAgB,IAAI,CACpB,SAAS,CAAE,OAAO,CAClB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,AAC7B,CAAC,AACD,gCAAI,MAAM,AAAC,CAAC,AAEX,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AAClC,CAAC,AACD,MAAM,4BAAC,CAAC,AACP,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,EAAE,CACd,SAAS,QAAQ,CACjB,OAAO,CAAC,CACR,OAAO,CAAE,KAAK,AACf,CAAC,AACD,+BAAG,CAAC,IAAI,4BAAC,CAAC,AACT,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAC5B,QAAQ,GAAG,AACR,CAAC,AACL,oBAAM,CAAC,eAAC,MAAM,CAAC,AACd,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAItB,YAAY,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAEzC,WAAW,GAAG,CAAC,KAAK,CAAC,WAAW,AAEjC,CAAC,AACD,oBAAM,CAAC,CAAC,cAAC,CAAC,AAET,YAAY,CAAE,GAAG,CACjB,WAAW,CAAE,GAAG,CAEhB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,UAAU,OAAO,AAClB,CAAC,AACD,iCAAK,CAAE,MAAM,4BAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,AACtB,CAAC,AACD,MAAM,4BAAC,CAAC,AACP,MAAM,KAAK,CACX,UAAU,CAAE,EAAE,AACf,CAAC,AACD,KAAK,4BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,WAAW,AACrB,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<footer class="${"svelte-x2mpcs"}"><div class="${"left svelte-x2mpcs"}"><p class="${"foot svelte-x2mpcs"}">Last updated <span id="${"crea"}" class="${"svelte-x2mpcs"}">July 29, 2021</span></p>
	<p class="${"foot svelte-x2mpcs"}"><a href="${"mailto:clp@clp.is"}" class="${"svelte-x2mpcs"}">Email</a> me</p></div>
		<div class="${"right svelte-x2mpcs"}"><a class="${"nav svelte-x2mpcs"}" id="${"gl"}" href="${"https://gitlab.com/clpi"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" width="${"12"}" height="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>GitLab</title><path d="${"M4.845.904c-.435 0-.82.28-.955.692C2.639 5.449 1.246 9.728.07 13.335a1.437 1.437 0 00.522 1.607l11.071 8.045c.2.145.472.144.67-.004l11.073-8.04a1.436 1.436 0 00.522-1.61c-1.285-3.942-2.683-8.256-3.817-11.746a1.004 1.004 0 00-.957-.684.987.987 0 00-.949.69l-2.405 7.408H8.203l-2.41-7.408a.987.987 0 00-.942-.69h-.006zm-.006 1.42l2.173 6.678H2.675zm14.326 0l2.168 6.678h-4.341zm-10.593 7.81h6.862c-1.142 3.52-2.288 7.04-3.434 10.559L8.572 10.135zm-5.514.005h4.321l3.086 9.5zm13.567 0h4.325c-2.467 3.17-4.95 6.328-7.411 9.502 1.028-3.167 2.059-6.334 3.086-9.502zM2.1 10.762l6.977 8.947-7.817-5.682a.305.305 0 01-.112-.341zm19.798 0l.952 2.922a.305.305 0 01-.11.341v.002l-7.82 5.68.026-.035z"}" class="${"svelte-x2mpcs"}"></path></svg>
			GitLab</a>
			<a class="${"nav svelte-x2mpcs"}" id="${"gh"}" href="${"https://github.com/clpi"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" width="${"12"}" height="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>GitHub</title><path d="${"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"}" class="${"svelte-x2mpcs"}"></path></svg>
			GitHub</a>
			<a class="${"nav svelte-x2mpcs"}" href="${"https://twitter.com/clp_is"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" width="${"12"}" height="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>Twitter</title><path d="${"M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"}" class="${"svelte-x2mpcs"}"></path></svg>
			Twitter</a>
			<a class="${"nav svelte-x2mpcs"}" href="${"https://linkedin.com/in/chrispecunies"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" width="${"12"}" height="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>LinkedIn</title><path d="${"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"}" class="${"svelte-x2mpcs"}"></path></svg>
			LinkedIn</a>
			<a class="${"nav svelte-x2mpcs"}" href="${"https://facebook.com/chrispecunies"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" width="${"12"}" height="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>Facebook</title><path d="${"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"}" class="${"svelte-x2mpcs"}"></path></svg>
			Facebook</a>
			<a class="${"nav svelte-x2mpcs"}" href="${"https://last.fm/user/ooohm"}"><svg role="${"img"}" viewBox="${"0 0 24 24"}" height="${"12"}" width="${"12"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-x2mpcs"}"><title>Last.fm</title><path d="${"M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.382 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.666 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.63-3.931l-1.758-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.729-3.492-2.474 0-4.893.935-4.893 3.932 0 1.87.907 3.051 3.189 3.601l1.87.44c1.402.33 1.869.907 1.869 1.704 0 1.017-.99 1.43-2.86 1.43-2.776 0-3.93-1.457-4.59-3.464l-.907-2.75c-1.155-3.573-2.997-4.893-6.653-4.893C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.106 0 4.591-1.457 4.591-1.457z"}" class="${"svelte-x2mpcs"}"></path></svg>
			Last.fm</a></div>

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
  code: `ul:not(.navbar){margin-left:3.5%;list-style:decimal;padding-top:2.5%;border-top:1px solid rgba(0,0,0,0.02);border-radius:7px;padding-bottom:2.5%;background-color:rgba(0,0,0,0.01);border-top:1px solid rgba(0,0,0,0.085);border-bottom:1px solid rgba(0,0,0,0.045);margin-top:25px}ul:not(.navbar):hover{transition:all 0.2s ease-in-out;background-color:rgba(0,0,0,0.02);border-top:1px solid rgba(0,0,0,0.175);border-bottom:1px solid rgba(0,0,0,0.095)}li:not(.nav){margin-bottom:4px}li:not(.nav){padding-left:1%}body{border:2px ridge transparent;background-color:#fffefd;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:2% 15% 2% 15%;font-weight:300;background-image:url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(1.05) rotate(90)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0.09)'/><path d='M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-width='0.7' stroke='hsla(0, 0%, 0%, 0.030)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")
	}h1,h2,h3,h4{font-weight:100;font-family:Helvetica;letter-spacing:-1px;border-left:1px solid rgba(0,0,0,0.0)}h1{font-size:1.9rem;padding-left:18px;color:rgba(0,0,0,0.70)}#head{font-size:1.9rem;padding-left:18px;color:rgba(0,0,0,0.70)}h2{font-size:1.6rem;padding-left:12px;color:rgba(0,0,0,0.58)}h3{font-size:1.4rem;padding-left:8px;color:rgba(0,0,0,0.53)}h4{font-size:1.2rem;padding-left:7px;color:rgba(0,0,0,0.50)}h1::before{font-size:1.9rem;font-weight:100;content:"\u26AC";color:rgba(140,210,160,0.0);padding-right:12px;text-shadow:0px 0px 18px rgba(140,210,160,0)}#head::before{font-size:1.9rem;font-weight:100;content:"\u2022";color:rgba(140,0,160,0.00);padding-right:12px;text-shadow:0px 0px 18px rgba(140,210,160,0) }h2::before{font-size:1.6rem;font-weight:100;content:"\u26AC\u26AC";color:rgba(140,210,160,0.00);padding-right:9px;text-shadow:0px 0px 18px rgba(140,210,160,0)}h3::before{font-size:1.4rem;font-weight:100;content:"\u26AC\u26AC\u26AC";color:rgba(140,210,160,0.00);padding-right:7px;text-shadow:0px 0px 18px rgba(140,210,160,0)}h4::before{font-size:1.2rem;font-weight:100;content:"\u26AC\u26AC\u26AC\u26AC\u26AC";color:rgba(140,210,160,0.00);padding-right:5px;text-shadow:0px 0px 18px rgba(140,210,160,0)}h1:hover::before{font-size:1.9rem;font-weight:100;content:"\u26AC";color:rgba(140,210,160,0.43) ;padding-right:12px;transition:all 0.15s ease-in;text-shadow:0px 0px 18px rgba(140,210,160,0.12)}#head:hover::before{font-size:1.9rem;font-weight:100;content:"\u2022";color:rgba(140,210,160,0.53) ;padding-right:12px;transition:all 0.25s ease-in;text-shadow:0px 0px 18px rgba(140,210,160,0.12)}h2:hover::before{font-size:1.6rem;font-weight:100;content:"\u26AC\u26AC";color:rgba(140,210,160,0.48) ;padding-right:9px;transition:all 0.25s ease-in;text-shadow:0px 0px 18px rgba(140,210,160,0.08)}h3:hover::before{font-size:1.4rem;font-weight:100;content:"\u26AC\u26AC\u26AC";color:rgba(140,210,160,0.43) ;padding-right:7px;transition:all 0.25s ease-in;text-shadow:0px 0px 18px rgba(140,210,160,0.06)}h4:hover::before{font-size:1.2rem;font-weight:100;content:"\u26AC\u26AC\u26AC\u26AC\u26AC";color:rgba(140,210,160,0.38);padding-right:5px;transition:all 0.25s ease-in;text-shadow:0px 0px 18px rgba(140,210,160,0.05)}p{padding-left:45px;font-size:1.0rem;border-left:1px solid transparent}.content.svelte-1aer3dc{font-size:0.97rem;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-family:Helvetica;font-weight:300;color:rgba(0,2,1,0.58)}#head{padding-bottom:8px;border-left:1px solid rgba(0,0,0,0.0);margin-left:0px}#head:hover{transition:all 0.1s ease-in-out;margin-left:0px;padding-left:18px}.link:not(.nav):hover{transition:all 0.05s;text-shadow:0px 0px 8px rgba(0,0,0,0.0);text-decoration:underline;color:rgba(150,210,180,1)}.link:not(.nav){font-family:Helvetica;text-decoration:none;text-underline-offset:1px;font-size:1rem;color:rgba(100,180,120,0.9)}.content.svelte-1aer3dc{padding-top:12px;line-height:1.4rem;padding-bottom:35px;padding-left:40px;padding-right:40px;height:100%;min-height:45vh;background-color:rgba(246,246,246,0.925);border-left:1px solid rgba(0,0,0,0.065);border-right:1px solid rgba(0,0,0,0.065);border-top:1px solid rgba(0,0,0,0.040);border-bottom:2px solid rgba(0,0,0,0.13);box-shadow:0px 7px 70px rgba(0,0,0,0.105);border-radius:09px;display:block}li a :not(.nav){text-decoration:underline;text-underline-offset:5px;text-shadow:0px 0px 5px rgba(0,0,0,0.01)} .link.ext :not(.nav){color:rgba(0,0,0,0.5)}li a:active:not(.nav){transform:scale(1.1)}li a:hover:not(.nav){font-weight:300;text-shadow:0px 0px 10px rgba(0,0,0,0.05);transition:all 0.2s ease-in-out}li:hover a:not(.nav){transition:all 0.2s ease-in-out;transform:scale(1.1)}form{padding:3% 5% 3% 5%;margin-top:10px;box-shadow:0px 0px 50px rgba(0,0,0,0.03);border-top:1px solid rgba(0,0,0,0.035);border-left:1px solid rgba(0,0,0,0.045);border-right:1px solid rgba(0,0,0,0.045);border-bottom:2px solid rgba(0,0,0,0.12);display:inline-flexbox;transition:all 0.15s ease-in-out;border-radius:5px;min-width:40%;margin:7px}input{padding:15px 30px;margin-top:2px;border-radius:5px;display:inline;width:80%;border:1px transparent;border-top:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(255,255,255,1);background:rgba(0,0,0,0.025)}label{font-size:0.9rem;padding-left:02px;color:rgba(0,0,0,0.6);text-shadow:0px 0px 4px rgba(0,0,0,0.05)}.form{display:inline-flex;width:100%;margin:auto}button{border:2px solid transparent;border-bottom:2px solid rgba(0,0,0,0.1);border-top:1px solid rgba(0,0,0,0.025);border-left:1px solid rgba(0,0,0,0.025);border-right:1px solid rgba(0,0,0,0.025);color:rgba(0,0,0,0.6);background-color:rgba(150,220,170,1);color:rgba(255,255,255,1);text-shadow:0px 1px 0px rgba(0,0,0,0.15);padding:8px 10px;border-radius:4px;transition:all 0.15s ease-in-out}input:focus{border-top:1px solid rgba(0,0,0,0.2);border-bottom:1px solid rgba(150,220,170,0.8);color:rgba(110,210,140,0.9);outline:none;transform:scale(1.05);transition:all 0.1s ease-in-out}form button:hover{background-color:rbga(0,0,0,0.25);border-bottom:2px solid rgba(0,0,0,0.25);border-radius:5px;transform:scale(1.1);transition:all 0.1s ease-in-out}.secondary{background-color:rbga(0,0,0,0.25)}.secondary:hover{background-color:rbga(0,0,0,0.35)}.formtitle{font-family:Helvetica;padding-bottom:12px;display:block}.gray{color:rgba(0,0,0,0.5);font-weight:500}`,
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Nav from '../lib/nav.svelte';\\nimport Footer from '../lib/footer.svelte';\\nimport { page, navigating } from '$app/stores';\\nimport GoogleAnalytics from '$lib/google.svelte';\\n$: section = $page.path.split('/')[1];\\n<\/script>\\n\\n<style>\\n:global(ul:not(.navbar)) {\\n\\tmargin-left: 3.5%;\\n\\t    list-style: decimal;\\n\\tpadding-top: 2.5%;\\n\\tborder-top: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 7px;\\n\\tpadding-bottom: 2.5%;\\n\\tbackground-color: rgba(0,0,0,0.01);\\n\\tborder-top:1px solid rgba(0,0,0,0.085);\\n\\tborder-bottom:1px solid rgba(0,0,0,0.045);\\n\\tmargin-top: 25px;\\n    }\\n:global(ul:not(.navbar):hover) {\\n    transition: all 0.2s ease-in-out;\\n    background-color: rgba(0,0,0,0.02);\\n    border-top:1px solid rgba(0,0,0,0.175);\\n    border-bottom:1px solid rgba(0,0,0,0.095);\\n}\\n:global(li:not(.nav)) {\\n\\tmargin-bottom: 4px;\\n    }\\n    :global(li:not(.nav)) {\\n\\tpadding-left: 1%;\\n\\n\\t}\\n\\t:global(body) {\\n\\t\\tborder: 2px ridge transparent;\\n\\t\\tbackground-color: #fffefd;\\n\\t\\theight: 100vh;\\n\\t\\tmin-height: 100vh;\\n\\t\\tmargin: 0;\\n\\t\\tmax-width: 100%;\\n\\t\\toverflow-x: hidden;\\n\\t\\tpadding: 2% 15% 2% 15%;\\n\\t\\tfont-weight: 300;\\n\\t\\tbackground-image: url(\\"data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(1.05) rotate(90)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0.09)'/><path d='M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-width='0.7' stroke='hsla(0, 0%, 0%, 0.030)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>\\")\\n\\t}\\n\\t:global(h1),:global(h2),:global(h3),:global(h4) {\\n\\n\\t\\tfont-weight: 100;\\n\\t\\tfont-family: Helvetica;\\n\\t\\tletter-spacing: -1px;\\n\\t\\tborder-left: 1px solid rgba(0,0,0,0.0);\\n\\t\\t/* border-bottom: 0px solid rgba(0,0,0,0.25); */\\n\\t\\t/* padding: 0px 16px 4px 4px; */\\n\\t}\\n\\t:global(h1) { font-size: 1.9rem; padding-left: 18px; color: rgba(0,0,0,0.70); }\\n\\t:global(#head) { font-size: 1.9rem; padding-left: 18px; color: rgba(0,0,0,0.70); }\\n\\t:global(h2) { font-size: 1.6rem; padding-left: 12px; color: rgba(0,0,0,0.58); }\\n\\t:global(h3) { font-size: 1.4rem; padding-left: 8px; color: rgba(0,0,0,0.53); }\\n\\t:global(h4) { font-size: 1.2rem; padding-left: 7px; color: rgba(0,0,0,0.50); }\\n\\t:global(h1::before) { font-size: 1.9rem;font-weight: 100; content: \\"\u26AC\\"; color: rgba(140,210,160,0.0); padding-right: 12px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}\\n\\t:global(#head::before) { font-size: 1.9rem;font-weight: 100; content: \\"\u2022\\"; color: rgba(140,0,160,0.00); padding-right: 12px;text-shadow: 0px 0px 18px rgba(140,210,160,0) }\\n\\t:global(h2::before) { font-size: 1.6rem;font-weight: 100; content: \\"\u26AC\u26AC\\"; color: rgba(140,210,160,0.00); padding-right: 9px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}\\n\\t:global(h3::before) { font-size: 1.4rem;font-weight: 100; content: \\"\u26AC\u26AC\u26AC\\"; color: rgba(140,210,160,0.00); padding-right: 7px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}\\n\\t:global(h4::before) { font-size: 1.2rem;font-weight: 100; content: \\"\u26AC\u26AC\u26AC\u26AC\u26AC\\"; color: rgba(140,210,160,0.00); padding-right: 5px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}\\n\\t:global(h1:hover::before) { font-size: 1.9rem;font-weight: 100; content: \\"\u26AC\\"; color:rgba(140,210,160,0.43) ; padding-right: 12px; transition:all 0.15s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.12)}\\n\\t:global(#head:hover::before) { font-size: 1.9rem;font-weight: 100; content: \\"\u2022\\"; color:rgba(140,210,160,0.53) ; padding-right: 12px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.12)}\\n\\t:global(h2:hover::before) { font-size: 1.6rem;font-weight: 100; content: \\"\u26AC\u26AC\\"; color:rgba(140,210,160,0.48) ; padding-right: 9px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.08)}\\n\\t:global(h3:hover::before) { font-size: 1.4rem;font-weight: 100; content: \\"\u26AC\u26AC\u26AC\\"; color:rgba(140,210,160,0.43) ; padding-right: 7px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.06)}\\n\\t:global(h4:hover::before) { font-size: 1.2rem;font-weight: 100; content: \\"\u26AC\u26AC\u26AC\u26AC\u26AC\\"; color:rgba(140,210,160,0.38); padding-right: 5px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.05)}\\n\\t:global(h1:hover),:global(h2:hover),:global(h3:hover),:global(h4:hover),:global(#head:hover) {\\n\\t    }\\n\\t/* :global(h1:hover::after) { color: rgba(0,0,0,0.15); padding-left: 25px; font-size: 1.2rem; content: \\".\\" }\\n\\t:global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 25px; font-size: 1.2rem; content: \\".\\" }\\n\\t:global(h2:hover::after) { color: rgba(0,0,0,0.12); padding-left: 15; font-size: 1.0rem; content: \\"..\\" }\\n\\t:global(h3:hover::after) { color: rgba(0,0,0,0.09); padding-left: 10px; font-size: 0.9rem; content: \\"...\\" }\\n\\t:global(h4:hover::after) { color: rgba(0,0,0,0.09); padding-left: 08px; font-size: 0.7rem; content: \\"....\\" } */\\n\\t/* :global(h1:hover) { color: black;border-left: 4px solid rgba(0,0,0,0.15); transition: all 0.2s ease-in-out}\\n\\t:global(#head:hover) { border-left: 1px solid rgba(0,0,0,0.10); transition: all 0.2s ease-in-out}\\n\\t:global(h2:hover) { color:rgba(0,0,0,0.8);border-left: 1px solid rgba(0,0,0,0.10);  transition: all 0.2s ease-in-out}\\n\\t:global(h3:hover) { color:rgba(0,0,0,0.74);border-left: 1px solid rgba(0,0,0,0.10);  transition: all 0.2s ease-in-out}\\n\\t:global(h4:hover) { color:rgba(0,0,0,0.7);border-left: 1px solid rgba(0,0,0,0.1j);  transition: all 0.2s ease-in-out} */\\n\\t:global(p) {\\n\\t\\tpadding-left: 45px;\\n\\t\\tfont-size: 1.0rem;\\n\\t\\tborder-left:1px solid transparent;\\n\\t}\\n\\t.content {\\n\\t\\tfont-size: 0.97rem;\\n\\t\\tfont-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\\n\\t\\tfont-family:Helvetica;\\n\\t\\tfont-weight: 300;\\n\\t\\tcolor: rgba(0,2,1,0.58);\\n\\t\\t}\\n\\t:global(#head) {\\n\\t\\tpadding-bottom: 8px;\\n\\t\\tborder-left: 1px solid rgba(0,0,0,0.0);\\n\\t\\tmargin-left:0px;\\n\\t}\\n\\t/* :global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: \\"*\\" } */\\n\\t:global(#head:hover) {\\n\\t\\t/* color: rgba(0,0,0,0.76); */\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t\\tmargin-left: 0px;\\n\\t\\tpadding-left:18px;\\n\\n\\t}\\n\\t:global(.link:not(.nav):hover) {\\n\\t    transition: all 0.05s;\\n\\t    text-shadow: 0px 0px 8px rgba(0,0,0,0.0);\\n\\t    text-decoration: underline;\\n\\t    color: rgba(150,210,180,1);\\n\\t}\\n\\t:global(.link:not(.nav)) {\\n\\t    font-family: Helvetica;\\n\\t    text-decoration:none;\\n\\t    text-underline-offset: 1px;\\n\\t    font-size:1rem;\\n\\t    color: rgba(100,180,120,0.9);\\n\\t}\\n\\t/* :global(a:not(.nav):hover::before){\\n\\t\\tcontent: \\"[\\"\\n\\t}\\n\\t:global(a:not(.nav):hover::after){\\n\\t\\tcontent: \\"]\\"\\n\\t} */\\n\\t:global(p:hover:not(.foot)) {\\n\\t\\t/* border-left: 1px solid rgba(0,0,0,0.1); */\\n\\t\\t/* transition: all 0.2s ease-in-out; */\\n\\t\\t}\\n\\t/* :global(p::before) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-right: 4px;\\n\\t}\\n\\t:global(p:hover::before),:global(p:hover::after) {\\n\\t\\tcolor: rgba(0,0,0,0.1);\\n\\t}\\n\\t:global(p::after) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-left: 4px;\\n\\t} */\\n\\n.content {\\n\\tpadding-top: 12px;\\n\\tline-height: 1.4rem;\\n\\tpadding-bottom: 35px;\\n\\tpadding-left: 40px;\\n\\tpadding-right: 40px;\\n\\theight: 100%;\\n\\tmin-height: 45vh;\\n\\tbackground-color: rgba(246,246,246,0.925);\\n\\tborder-left: 1px solid rgba(0,0,0,0.065);\\n\\tborder-right: 1px solid rgba(0,0,0,0.065);\\n\\tborder-top: 1px solid rgba(0,0,0,0.040);\\n\\tborder-bottom: 2px solid rgba(0,0,0,0.13);\\n\\tbox-shadow: 0px 7px 70px rgba(0,0,0,0.105);\\n\\tborder-radius: 09px;\\n\\tdisplay:block;\\n}\\n:global(li a ):not(.nav) {\\n\\ttext-decoration: underline;\\n\\ttext-underline-offset: 5px;\\n\\ttext-shadow: 0px 0px 5px rgba(0,0,0,0.01);\\n    }\\n    :global( .link.ext ):not(.nav) {\\n\\t    color: rgba(0,0,0,0.5);\\n\\t}\\n\\t:global(li a:active):not(.nav) {\\n\\t\\ttransform: scale(1.1);\\n\\t}\\n\\t:global(li a:hover):not(.nav) {\\n\\t\\tfont-weight: 300;\\n\\t\\t/* color: rgba(255,255,255,0.98); */\\n\\t\\t/* border-radius: 4px; */\\n\\t\\t/* box-shadow:  0px 0px 8px rgba(0,0,0,0.1); */\\n\\t\\ttext-shadow: 0px 0px 10px rgba(0,0,0,0.05);\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\n\\t    }\\n\\t    :global(li:hover a):not(.nav) {\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\ttransform: scale(1.1);\\n\\n\\t\\t}\\n    /* :global(form) {\\n\\tpadding-left: 3%;\\n\\tpadding-right: 1%;\\n\\tpadding-top: 2%;\\n\\tpadding-bottom: 2%;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tbox-shadow: 0px 0px 7px rgba(0,0,0,0.00);\\n\\twidth: 50%;\\n\\tdisplay: block;\\n\\tposition:relative;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\ttransition: all 0.15s ease-in-out;\\n\\talign-items: center;\\n\\tbox-shadow: 0px 0px 5px rgba(0,0,0,0.03);\\n\\tborder: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 6px;\\n\\tborder-bottom: 3px solid rgba(0,0,0,0.09);\\n\\tmargin: auto;\\n    }\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\n\\n\\t\\t}\\n\\t\\t.formtitle {\\n\\t\\t    font-family:Helvetica;\\n\\t\\t    padding-bottom: 12px;\\n\\t\\t    padding-left: 8px;\\n\\t\\t\\tdisplay:block;\\n\\t\\t    }\\n\\t\\t    .gray {\\n\\t\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t\\t} */\\n    :global(form) {\\n\\tpadding: 3% 5% 3% 5%;\\n\\tmargin-top: 10px;\\n\\t/* background-color: rgba(255,255,255,0.01); */\\n\\tbox-shadow: 0px 0px 50px rgba(0,0,0,0.03);\\n\\tborder-top: 1px solid rgba(0,0,0,0.035);\\n\\tborder-left: 1px solid rgba(0,0,0,0.045);\\n\\tborder-right: 1px solid rgba(0,0,0,0.045);\\n\\tborder-bottom: 2px solid rgba(0,0,0,0.12);\\n\\tdisplay: inline-flexbox;\\n\\ttransition: all 0.15s ease-in-out;\\n\\tborder-radius: 5px;\\n\\tmin-width:40%;\\n\\tmargin: 7px;\\n    }\\n    :global(input) { \\n\\tpadding: 15px 30px; \\n\\tmargin-top: 2px;\\n\\tborder-radius:5px; \\n\\tdisplay:inline;\\n\\twidth: 80%;\\n\\tborder: 1px transparent; \\n\\tborder-top: 1px solid rgba(0,0,0,0.1);\\n\\tborder-bottom: 1px solid rgba(255,255,255,1);\\n\\tbackground: rgba(0,0,0,0.025);\\n\\t}\\n\\t:global(label) {\\n\\t\\tfont-size: 0.9rem;\\n\\t\\tpadding-left: 02px;\\n\\t\\tcolor: rgba(0,0,0,0.6);\\n\\t\\ttext-shadow: 0px 0px 4px rgba(0,0,0,0.05);\\n\\t    }\\n\\t:global(.form) {\\n\\t    display:inline-flex;\\n\\t    width: 100%;\\n\\t    margin:auto;\\n\\t\\t}\\n    :global(button) {\\n\\tborder: 2px solid transparent;\\n\\tborder-bottom: 2px solid rgba(0,0,0,0.1);\\n\\tborder-top: 1px solid rgba(0,0,0,0.025);\\n\\tborder-left: 1px solid rgba(0,0,0,0.025);\\n\\tborder-right: 1px solid rgba(0,0,0,0.025);\\n\\tcolor: rgba(0,0,0,0.6);\\n\\tbackground-color: rgba(150,220,170,1);\\n\\tcolor: rgba(255,255,255,1);\\n\\ttext-shadow: 0px 1px 0px rgba(0,0,0,0.15);\\n\\tpadding: 8px 10px;\\n\\tborder-radius: 4px;\\n\\ttransition: all 0.15s ease-in-out;\\n\\n\\t}\\n\\t:global(input:active) {\\n\\t\\t/* background-color: rgba(255,255,255,0.05); */\\n\\t    }\\n\\t:global(input:focus) {\\n\\t\\t/* background-color: rgba(255,255,255,0.05); */\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\t\\tborder-bottom: 1px solid rgba(150,220,170,0.8);\\n\\t\\tcolor: rgba(110,210,140,0.9);\\n\\t\\toutline:none;\\n\\t\\ttransform:scale(1.05);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t    }\\n\\t:global(form button:hover) {\\n\\t    background-color: rbga(0,0,0,0.25);\\n\\t    border-bottom: 2px solid rgba(0,0,0,0.25);\\n\\t    border-radius: 5px;\\n\\t    transform:scale(1.1);\\n\\t    transition:all 0.1s ease-in-out;\\n\\t}\\n\\t:global(.secondary) {\\n\\t    background-color: rbga(0,0,0,0.25);\\n\\n\\t    }\\n\\t:global(.secondary:hover) {\\n\\t    background-color: rbga(0,0,0,0.35);\\n\\n\\t    }\\n\\t\\t:global(.formtitle) {\\n\\t\\t    font-family:Helvetica;\\n\\t\\t    padding-bottom: 12px;\\n\\t\\t\\tdisplay:block;\\n\\t\\t    }\\n\\t\\t    :global(.gray) {\\n\\t\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t\\t    font-weight: 500;\\n\\t\\t\\t}\\n</style>\\n\\n<GoogleAnalytics/>\\n<div>\\n\\t<Nav/>\\n\\t<div class=\\"content\\">\\n\\t\\t<slot></slot>\\n\\t</div>\\n\\t<Footer/>\\n</div>\\n"],"names":[],"mappings":"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"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$d);
  $page.path.split("/")[1];
  $$unsubscribe_page();
  return `${validate_component(Google, "GoogleAnalytics").$$render($$result, {}, {}, {})}
<div>${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}
	<div class="${"content svelte-1aer3dc"}">${slots.default ? slots.default({}) : ``}</div>
	${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return {
    props: { title: `${status}: ${error2.message}` }
  };
}
var _error$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { error: error2 } = $$props, { status } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  return `${$$result.head += `${$$result.title = `<title>${escape2(title)}</title>`, ""}`, ""}

<h1>ERROR: ${escape2(title)}</h1>
<p>test</p>`;
});
var __error$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error$2,
  load
});
var css$c = {
  code: '.date.svelte-t4nvtu{color:rgba(0,0,0,0.14);font-family:helvetica;font-size:0.75rem;padding-right:4px;padding-left:9px;letter-spacing:-0px;text-shadow:0px 0px 10px rgba(0,0,0,0.060)}.date.svelte-t4nvtu:hover{color:rgba(0,0,0,0.38);transition:all 0.25s ease-in-out;text-shadow:0px 0px 15px rgba(0,0,0,0.11)}.date.svelte-t4nvtu::before{content:"";color:rgba(0,0,0,0.2)}.date.svelte-t4nvtu::after{content:"";color:rgba(0,0,0,0.2)}',
  map: '{"version":3,"file":"date.svelte","sources":["date.svelte"],"sourcesContent":["<script>\\nlet dt = Date.now().toLocaleString();\\nexport let date = dt;\\n\\n\\n<\/script>\\n<style>\\n\\n.date {\\n\\tcolor: rgba(0,0,0,0.14);\\n\\tfont-family:helvetica;\\n\\tfont-size: 0.75rem;\\n\\t/* vertical-align:center; */\\n\\tpadding-right: 4px;\\n\\tpadding-left: 9px;\\n\\tletter-spacing:-0px;\\n\\ttext-shadow: 0px 0px 10px rgba(0,0,0,0.060);\\n}\\n.date:hover {\\n\\tcolor: rgba(0,0,0,0.38);\\n\\ttransition: all 0.25s ease-in-out;\\n\\ttext-shadow: 0px 0px 15px rgba(0,0,0,0.11);\\n\\n    }\\n.date::before { content: \\"\\"; color: rgba(0,0,0,0.2); }\\n.date::after { content: \\"\\";color: rgba(0,0,0,0.2);  }\\n</style>\\n\\n<span class=\\"date\\">{ date }</span>\\n"],"names":[],"mappings":"AAQA,KAAK,cAAC,CAAC,AACN,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,YAAY,SAAS,CACrB,SAAS,CAAE,OAAO,CAElB,aAAa,CAAE,GAAG,CAClB,YAAY,CAAE,GAAG,CACjB,eAAe,IAAI,CACnB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,AAC5C,CAAC,AACD,mBAAK,MAAM,AAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,CACjC,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAEvC,CAAC,AACL,mBAAK,QAAQ,AAAC,CAAC,AAAC,OAAO,CAAE,EAAE,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAE,CAAC,AACtD,mBAAK,OAAO,AAAC,CAAC,AAAC,OAAO,CAAE,EAAE,CAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAG,CAAC"}'
};
var Date_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let dt = Date.now().toLocaleString();
  let { date = dt } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  $$result.css.add(css$c);
  return `<span class="${"date svelte-t4nvtu"}">${escape2(date)}</span>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Home \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">Index</h1>

<p>I&#39;m a recent graduate from the University of Washington Seattle&#39;s Materials Science &amp; Engineering program, currently working in the IT domain, especially in cloud infrastructure &amp; engineering. Have spent most of my time in Seattle, WA but now reside in Denver, CO.${validate_component(Date_1, "Date").$$render($$result, { date: "08-10-21" }, {}, {})}</p>
<p>welcome to clp.is. feel free to check out my <a class="${"link ext"}" href="${"https://github.com/clpi"}">github</a> or <a class="${"link ext"}" href="${"https://gitlab.com/clpi"}">gitlab</a> for any projects i might be working on. for now site is under construction! to reach me, email me <a class="${"link ext"}" href="${"mailto:clp@clp.is"}">here</a>. thanks!${validate_component(Date_1, "Date").$$render($$result, { date: "07-14-21" }, {}, {})}</p>

<h2>Updates</h2>
<p>Updates to visual design (massive!) and migration to Render from Vercel, plus addition of API lab link${validate_component(Date_1, "Date").$$render($$result, { date: "11-21-21" }, {}, {})}</p>

<h2>Important Links</h2>
<p>Nothing important yet!</p>`;
});
var index$g = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Resources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Resources \u2022 clp.is</title>`, ""}`, ""}`;
});
var index$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Resources
});
var matchName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var iconDefaults = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16,
  rotate: 0,
  vFlip: false,
  hFlip: false
});
function fullIcon(data) {
  return { ...iconDefaults, ...data };
}
var stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate && !validateIcon(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIcon(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIcon(result, allowSimpleName) ? null : result;
  }
  return null;
};
var validateIcon = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchName)) && icon.name.match(matchName));
};
function mergeIconData(icon, alias) {
  const result = { ...icon };
  for (const key in iconDefaults) {
    const prop = key;
    if (alias[prop] !== void 0) {
      const value = alias[prop];
      if (result[prop] === void 0) {
        result[prop] = value;
        continue;
      }
      switch (prop) {
        case "rotate":
          result[prop] = (result[prop] + value) % 4;
          break;
        case "hFlip":
        case "vFlip":
          result[prop] = value !== result[prop];
          break;
        default:
          result[prop] = value;
      }
    }
  }
  return result;
}
function getIconData$1(data, name, full = false) {
  function getIcon(name2, iteration) {
    var _a, _b, _c, _d;
    if (data.icons[name2] !== void 0) {
      return Object.assign({}, data.icons[name2]);
    }
    if (iteration > 5) {
      return null;
    }
    if (((_a = data.aliases) == null ? void 0 : _a[name2]) !== void 0) {
      const item = (_b = data.aliases) == null ? void 0 : _b[name2];
      const result2 = getIcon(item.parent, iteration + 1);
      if (result2) {
        return mergeIconData(result2, item);
      }
      return result2;
    }
    if (iteration === 0 && ((_c = data.chars) == null ? void 0 : _c[name2]) !== void 0) {
      return getIcon((_d = data.chars) == null ? void 0 : _d[name2], iteration + 1);
    }
    return null;
  }
  const result = getIcon(name, 0);
  if (result) {
    for (const key in iconDefaults) {
      if (result[key] === void 0 && data[key] !== void 0) {
        result[key] = data[key];
      }
    }
  }
  return result && full ? fullIcon(result) : result;
}
var matchChar = /^[a-f0-9]+(-[a-f0-9]+)*$/;
function validateIconProps(item, fix) {
  for (const key in item) {
    const attr = key;
    const value = item[attr];
    const type = typeof value;
    if (type === "undefined") {
      delete item[attr];
      continue;
    }
    switch (key) {
      case "body":
      case "parent":
        if (type !== "string") {
          return key;
        }
        break;
      case "hFlip":
      case "vFlip":
      case "hidden":
        if (type !== "boolean") {
          if (fix) {
            delete item[attr];
          } else {
            return key;
          }
        }
        break;
      case "width":
      case "height":
      case "left":
      case "top":
      case "rotate":
      case "inlineHeight":
      case "inlineTop":
      case "verticalAlign":
        if (type !== "number") {
          if (fix) {
            delete item[attr];
          } else {
            return key;
          }
        }
        break;
      default:
        if (type === "object") {
          if (fix) {
            delete item[attr];
          } else {
            return key;
          }
        }
    }
  }
  return null;
}
function validateIconSet(obj, options2) {
  const fix = !!(options2 == null ? void 0 : options2.fix);
  if (typeof obj !== "object" || obj === null || typeof obj.icons !== "object" || !obj.icons) {
    throw new Error("Bad icon set");
  }
  const data = obj;
  if (typeof (options2 == null ? void 0 : options2.prefix) === "string") {
    data.prefix = options2.prefix;
  } else if (typeof data.prefix !== "string" || !data.prefix.match(matchName)) {
    throw new Error("Invalid prefix");
  }
  if (typeof (options2 == null ? void 0 : options2.provider) === "string") {
    data.provider = options2.provider;
  } else if (data.provider !== void 0) {
    const value = data.provider;
    if (typeof value !== "string" || value !== "" && !value.match(matchName)) {
      if (fix) {
        delete data.provider;
      } else {
        throw new Error("Invalid provider");
      }
    }
  }
  const icons = data.icons;
  Object.keys(icons).forEach((name) => {
    if (!name.match(matchName)) {
      if (fix) {
        delete icons[name];
        return;
      }
      throw new Error(`Invalid icon name: "${name}"`);
    }
    const item = icons[name];
    if (typeof item !== "object" || item === null || typeof item.body !== "string") {
      if (fix) {
        delete icons[name];
        return;
      }
      throw new Error(`Invalid icon: "${name}"`);
    }
    const key = typeof item.parent === "string" ? "parent" : validateIconProps(item, fix);
    if (key !== null) {
      if (fix) {
        delete icons[name];
        return;
      }
      throw new Error(`Invalid property "${key}" in icon "${name}"`);
    }
  });
  if (!Object.keys(data.icons).length) {
    throw new Error("Icon set is empty");
  }
  if (data.aliases !== void 0) {
    if (typeof data.aliases !== "object" || data.aliases === null) {
      if (fix) {
        delete data.aliases;
      } else {
        throw new Error("Invalid aliases list");
      }
    }
  }
  if (typeof data.aliases === "object") {
    let validateAlias = function(name, iteration) {
      if (validatedAliases.has(name)) {
        return !failedAliases.has(name);
      }
      const item = aliases[name];
      if (iteration > 5 || typeof item !== "object" || item === null || typeof item.parent !== "string" || !name.match(matchName)) {
        if (fix) {
          delete aliases[name];
          failedAliases.add(name);
          return false;
        }
        throw new Error(`Invalid icon alias: "${name}"`);
      }
      const parent = item.parent;
      if (data.icons[parent] === void 0) {
        if (aliases[parent] === void 0 || !validateAlias(parent, iteration + 1)) {
          if (fix) {
            delete aliases[name];
            failedAliases.add(name);
            return false;
          }
          throw new Error(`Missing parent icon for alias "${name}`);
        }
      }
      if (fix && item.body !== void 0) {
        delete item.body;
      }
      const key = item.body !== void 0 ? "body" : validateIconProps(item, fix);
      if (key !== null) {
        if (fix) {
          delete aliases[name];
          failedAliases.add(name);
          return false;
        }
        throw new Error(`Invalid property "${key}" in alias "${name}"`);
      }
      validatedAliases.add(name);
      return true;
    };
    const aliases = data.aliases;
    const validatedAliases = new Set();
    const failedAliases = new Set();
    Object.keys(aliases).forEach((name) => {
      validateAlias(name, 0);
    });
    if (fix && !Object.keys(data.aliases).length) {
      delete data.aliases;
    }
  }
  Object.keys(iconDefaults).forEach((prop) => {
    const expectedType = typeof iconDefaults[prop];
    const actualType = typeof data[prop];
    if (actualType !== "undefined" && actualType !== expectedType) {
      throw new Error(`Invalid value type for "${prop}"`);
    }
  });
  if (data.chars !== void 0) {
    if (typeof data.chars !== "object" || data.chars === null) {
      if (fix) {
        delete data.chars;
      } else {
        throw new Error("Invalid characters map");
      }
    }
  }
  if (typeof data.chars === "object") {
    const chars2 = data.chars;
    Object.keys(chars2).forEach((char) => {
      var _a;
      if (!char.match(matchChar) || typeof chars2[char] !== "string") {
        if (fix) {
          delete chars2[char];
          return;
        }
        throw new Error(`Invalid character "${char}"`);
      }
      const target = chars2[char];
      if (data.icons[target] === void 0 && ((_a = data.aliases) == null ? void 0 : _a[target]) === void 0) {
        if (fix) {
          delete chars2[char];
          return;
        }
        throw new Error(`Character "${char}" points to missing icon "${target}"`);
      }
    });
    if (fix && !Object.keys(data.chars).length) {
      delete data.chars;
    }
  }
  return data;
}
function isVariation(item) {
  for (const key in iconDefaults) {
    if (item[key] !== void 0) {
      return true;
    }
  }
  return false;
}
function parseIconSet(data, callback, options2) {
  options2 = options2 || {};
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  const validate = options2.validate;
  if (validate !== false) {
    try {
      validateIconSet(data, typeof validate === "object" ? validate : { fix: true });
    } catch (err) {
      return names;
    }
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const icons = data.icons;
  Object.keys(icons).forEach((name) => {
    const iconData = getIconData$1(data, name, true);
    if (iconData) {
      callback(name, iconData);
      names.push(name);
    }
  });
  const parseAliases = options2.aliases || "all";
  if (parseAliases !== "none" && typeof data.aliases === "object") {
    const aliases = data.aliases;
    Object.keys(aliases).forEach((name) => {
      if (parseAliases === "variations" && isVariation(aliases[name])) {
        return;
      }
      const iconData = getIconData$1(data, name, true);
      if (iconData) {
        callback(name, iconData);
        names.push(name);
      }
    });
  }
  return names;
}
var storage$1 = Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: Object.create(null),
    missing: Object.create(null)
  };
}
function getStorage(provider, prefix) {
  if (storage$1[provider] === void 0) {
    storage$1[provider] = Object.create(null);
  }
  const providerStorage = storage$1[provider];
  if (providerStorage[prefix] === void 0) {
    providerStorage[prefix] = newStorage(provider, prefix);
  }
  return providerStorage[prefix];
}
function addIconSet(storage2, data) {
  const t = Date.now();
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing[name] = t;
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = Object.freeze(fullIcon(icon));
      return true;
    }
  } catch (err) {
  }
  return false;
}
function getIconFromStorage(storage2, name) {
  const value = storage2.icons[name];
  return value === void 0 ? null : value;
}
var simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  return icon ? getIconFromStorage(getStorage(icon.provider, icon.prefix), icon.name) : null;
}
function addIcon(name, data) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data);
}
function addCollection(data, provider) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = typeof data.provider === "string" ? data.provider : "";
  }
  if (simpleNames && provider === "" && (typeof data.prefix !== "string" || data.prefix === "")) {
    let added = false;
    parseIconSet(data, (name, icon) => {
      if (icon && addIcon(name, icon)) {
        added = true;
      }
    }, {
      validate: {
        fix: true,
        prefix: ""
      }
    });
    return added;
  }
  if (typeof data.prefix !== "string" || !validateIcon({
    provider,
    prefix: data.prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, data.prefix);
  return !!addIconSet(storage2, data);
}
var defaults = Object.freeze({
  inline: false,
  width: null,
  height: null,
  hAlign: "center",
  vAlign: "middle",
  slice: false,
  hFlip: false,
  vFlip: false,
  rotate: 0
});
function mergeCustomisations(defaults2, item) {
  const result = {};
  for (const key in defaults2) {
    const attr = key;
    result[attr] = defaults2[attr];
    if (item[attr] === void 0) {
      continue;
    }
    const value = item[attr];
    switch (attr) {
      case "inline":
      case "slice":
        if (typeof value === "boolean") {
          result[attr] = value;
        }
        break;
      case "hFlip":
      case "vFlip":
        if (value === true) {
          result[attr] = !result[attr];
        }
        break;
      case "hAlign":
      case "vAlign":
        if (typeof value === "string" && value !== "") {
          result[attr] = value;
        }
        break;
      case "width":
      case "height":
        if (typeof value === "string" && value !== "" || typeof value === "number" && value || value === null) {
          result[attr] = value;
        }
        break;
      case "rotate":
        if (typeof value === "number") {
          result[attr] += value;
        }
        break;
    }
  }
  return result;
}
var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision === void 0 ? 100 : precision;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function preserveAspectRatio(props) {
  let result = "";
  switch (props.hAlign) {
    case "left":
      result += "xMin";
      break;
    case "right":
      result += "xMax";
      break;
    default:
      result += "xMid";
  }
  switch (props.vAlign) {
    case "top":
      result += "YMin";
      break;
    case "bottom":
      result += "YMax";
      break;
    default:
      result += "YMid";
  }
  result += props.slice ? " slice" : " meet";
  return result;
}
function iconToSVG(icon, customisations) {
  const box = {
    left: icon.left,
    top: icon.top,
    width: icon.width,
    height: icon.height
  };
  let body = icon.body;
  [icon, customisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push("translate(" + (box.width + box.left) + " " + (0 - box.top) + ")");
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push("translate(" + (0 - box.left) + " " + (box.height + box.top) + ")");
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift("rotate(90 " + tempValue + " " + tempValue + ")");
        break;
      case 2:
        transformations.unshift("rotate(180 " + (box.width / 2 + box.left) + " " + (box.height / 2 + box.top) + ")");
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift("rotate(-90 " + tempValue + " " + tempValue + ")");
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== 0 || box.top !== 0) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  let width, height;
  if (customisations.width === null && customisations.height === null) {
    height = "1em";
    width = calculateSize(height, box.width / box.height);
  } else if (customisations.width !== null && customisations.height !== null) {
    width = customisations.width;
    height = customisations.height;
  } else if (customisations.height !== null) {
    height = customisations.height;
    width = calculateSize(height, box.width / box.height);
  } else {
    width = customisations.width;
    height = calculateSize(width, box.height / box.width);
  }
  if (width === "auto") {
    width = box.width;
  }
  if (height === "auto") {
    height = box.height;
  }
  width = typeof width === "string" ? width : width + "";
  height = typeof height === "string" ? height : height + "";
  const result = {
    attributes: {
      width,
      height,
      preserveAspectRatio: preserveAspectRatio(customisations),
      viewBox: box.left + " " + box.top + " " + box.width + " " + box.height
    },
    body
  };
  if (customisations.inline) {
    result.inline = true;
  }
  return result;
}
var regex = /\sid="(\S+)"/g;
var randomPrefix = "IconifyId-" + Date.now().toString(16) + "-" + (Math.random() * 16777216 | 0).toString(16) + "-";
var counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + counter++;
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
  });
  return body;
}
var storage = Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    resources,
    path: source.path === void 0 ? "/" : source.path,
    maxURL: source.maxURL ? source.maxURL : 500,
    rotate: source.rotate ? source.rotate : 750,
    timeout: source.timeout ? source.timeout : 5e3,
    random: source.random === true,
    index: source.index ? source.index : 0,
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
var configStorage = Object.create(null);
var fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
var fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config2 = createAPIConfig(customConfig);
  if (config2 === null) {
    return false;
  }
  configStorage[provider] = config2;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
var mergeParams = (base, params) => {
  let result = base, hasParams = result.indexOf("?") !== -1;
  function paramToString(value) {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "number":
        return encodeURIComponent(value);
      case "string":
        return encodeURIComponent(value);
      default:
        throw new Error("Invalid parameter");
    }
  }
  Object.keys(params).forEach((key) => {
    let value;
    try {
      value = paramToString(params[key]);
    } catch (err) {
      return;
    }
    result += (hasParams ? "&" : "?") + encodeURIComponent(key) + "=" + value;
    hasParams = true;
  });
  return result;
};
var maxLengthCache = Object.create(null);
var pathCache = Object.create(null);
var detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
  try {
    const chunk = String.fromCharCode(114) + String.fromCharCode(101);
    const req = global[chunk + "qui" + chunk];
    callback = req("cross-fetch");
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
  return null;
};
var fetchModule = detectFetch();
function calculateMaxLength(provider, prefix) {
  const config2 = getAPIConfig(provider);
  if (!config2) {
    return 0;
  }
  let result;
  if (!config2.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config2.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = mergeParams(prefix + ".json", {
      icons: ""
    });
    result = config2.maxURL - maxHostLength - config2.path.length - url.length;
  }
  const cacheKey = provider + ":" + prefix;
  pathCache[provider] = config2.path;
  maxLengthCache[cacheKey] = result;
  return result;
}
var prepare = (provider, prefix, icons) => {
  const results = [];
  let maxLength = maxLengthCache[prefix];
  if (maxLength === void 0) {
    maxLength = calculateMaxLength(provider, prefix);
  }
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index2) => {
    length += name.length + 1;
    if (length >= maxLength && index2 > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    if (pathCache[provider] === void 0) {
      const config2 = getAPIConfig(provider);
      if (!config2) {
        return "/";
      }
      pathCache[provider] = config2.path;
    }
    return pathCache[provider];
  }
  return "/";
}
var send = (host, params, status) => {
  if (!fetchModule) {
    status.done(void 0, 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      path += mergeParams(prefix + ".json", {
        icons: iconsList
      });
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      status.done(void 0, 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    if (response.status !== 200) {
      setTimeout(() => {
        status.done(void 0, response.status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data) => {
    if (typeof data !== "object" || data === null) {
      setTimeout(() => {
        status.done(void 0, defaultError);
      });
      return;
    }
    setTimeout(() => {
      status.done(data);
    });
  }).catch(() => {
    status.done(void 0, defaultError);
  });
};
var fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = Object.create(null);
  icons.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    if (a.prefix !== b.prefix) {
      return a.prefix.localeCompare(b.prefix);
    }
    return a.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    if (storage2[provider] === void 0) {
      storage2[provider] = Object.create(null);
    }
    const providerStorage = storage2[provider];
    if (providerStorage[prefix] === void 0) {
      providerStorage[prefix] = getStorage(provider, prefix);
    }
    const localStorage = providerStorage[prefix];
    let list;
    if (localStorage.icons[name] !== void 0) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing[name] !== void 0) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
var callbacks = Object.create(null);
var pendingUpdates = Object.create(null);
function removeCallback(sources, id) {
  sources.forEach((source) => {
    const provider = source.provider;
    if (callbacks[provider] === void 0) {
      return;
    }
    const providerCallbacks = callbacks[provider];
    const prefix = source.prefix;
    const items = providerCallbacks[prefix];
    if (items) {
      providerCallbacks[prefix] = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(provider, prefix) {
  if (pendingUpdates[provider] === void 0) {
    pendingUpdates[provider] = Object.create(null);
  }
  const providerPendingUpdates = pendingUpdates[provider];
  if (!providerPendingUpdates[prefix]) {
    providerPendingUpdates[prefix] = true;
    setTimeout(() => {
      providerPendingUpdates[prefix] = false;
      if (callbacks[provider] === void 0 || callbacks[provider][prefix] === void 0) {
        return;
      }
      const items = callbacks[provider][prefix].slice(0);
      if (!items.length) {
        return;
      }
      const storage2 = getStorage(provider, prefix);
      let hasPending = false;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name] !== void 0) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing[name] !== void 0) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([
              {
                provider,
                prefix
              }
            ], item.id);
          }
          item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
        }
      });
    });
  }
}
var idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((source) => {
    const provider = source.provider;
    const prefix = source.prefix;
    if (callbacks[provider] === void 0) {
      callbacks[provider] = Object.create(null);
    }
    const providerCallbacks = callbacks[provider];
    if (providerCallbacks[prefix] === void 0) {
      providerCallbacks[prefix] = [];
    }
    providerCallbacks[prefix].push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, false, simpleNames2) : item;
    if (!validate || validateIcon(icon, simpleNames2)) {
      result.push({
        provider: icon.provider,
        prefix: icon.prefix,
        name: icon.name
      });
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config2, payload, query, done, success) {
  const resourcesCount = config2.resources.length;
  const startIndex = config2.random ? Math.floor(Math.random() * resourcesCount) : config2.index;
  let resources;
  if (config2.random) {
    let list = config2.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config2.resources.slice(startIndex).concat(config2.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError = void 0;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.abort) {
        item.abort();
      }
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe2(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe: subscribe2,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue = queue.filter((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
      if (item.abort) {
        item.abort();
      }
      return false;
    });
  }
  function moduleResponse(item, data, error2) {
    const isError = data === void 0;
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config2.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (isError) {
      if (error2 !== void 0) {
        lastError = error2;
      }
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (success && !config2.random) {
      const index2 = config2.resources.indexOf(item.resource);
      if (index2 !== -1 && index2 !== config2.index) {
        success(index2);
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        const timeout2 = typeof config2.timeout === "function" ? config2.timeout(startTime) : config2.timeout;
        if (timeout2) {
          timer = setTimeout(() => {
            resetTimer();
            if (status === "pending") {
              clearQueue();
              failQuery();
            }
          }, timeout2);
          return;
        }
      }
      failQuery();
      return;
    }
    const item = {
      getQueryStatus,
      status: "pending",
      resource,
      done: (data, error2) => {
        moduleResponse(item, data, error2);
      }
    };
    queue.push(item);
    queriesSent++;
    const timeout = typeof config2.rotate === "function" ? config2.rotate(queriesSent, startTime) : config2.rotate;
    timer = setTimeout(execNext, timeout);
    query(resource, payload, item);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function setConfig(config2) {
  if (typeof config2 !== "object" || typeof config2.resources !== "object" || !(config2.resources instanceof Array) || !config2.resources.length) {
    throw new Error("Invalid Reduncancy configuration");
  }
  const newConfig = Object.create(null);
  let key;
  for (key in defaultConfig) {
    if (config2[key] !== void 0) {
      newConfig[key] = config2[key];
    } else {
      newConfig[key] = defaultConfig[key];
    }
  }
  return newConfig;
}
function initRedundancy(cfg) {
  const config2 = setConfig(cfg);
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(config2, payload, queryCallback, (data, error2) => {
      cleanup();
      if (doneCallback) {
        doneCallback(data, error2);
      }
    }, (newIndex) => {
      config2.index = newIndex;
    });
    queries.push(query2);
    return query2;
  }
  function find(callback) {
    const result = queries.find((value) => {
      return callback(value);
    });
    return result !== void 0 ? result : null;
  }
  const instance = {
    query,
    find,
    setIndex: (index2) => {
      config2.index = index2;
    },
    getIndex: () => config2.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
var redundancyCache = Object.create(null);
function getRedundancyCache(provider) {
  if (redundancyCache[provider] === void 0) {
    const config2 = getAPIConfig(provider);
    if (!config2) {
      return;
    }
    const redundancy = initRedundancy(config2);
    const cachedReundancy = {
      config: config2,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config2 = createAPIConfig(target);
    if (config2) {
      redundancy = initRedundancy(config2);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
var cache = {};
function emptyCallback() {
}
var pendingIcons = Object.create(null);
var iconsToLoad = Object.create(null);
var loaderFlags = Object.create(null);
var queueFlags = Object.create(null);
function loadedNewIcons(provider, prefix) {
  if (loaderFlags[provider] === void 0) {
    loaderFlags[provider] = Object.create(null);
  }
  const providerLoaderFlags = loaderFlags[provider];
  if (!providerLoaderFlags[prefix]) {
    providerLoaderFlags[prefix] = true;
    setTimeout(() => {
      providerLoaderFlags[prefix] = false;
      updateCallbacks(provider, prefix);
    });
  }
}
var errorsCache = Object.create(null);
function loadNewIcons(provider, prefix, icons) {
  function err() {
    const key = (provider === "" ? "" : "@" + provider + ":") + prefix;
    const time = Math.floor(Date.now() / 6e4);
    if (errorsCache[key] < time) {
      errorsCache[key] = time;
      console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
    }
  }
  if (iconsToLoad[provider] === void 0) {
    iconsToLoad[provider] = Object.create(null);
  }
  const providerIconsToLoad = iconsToLoad[provider];
  if (queueFlags[provider] === void 0) {
    queueFlags[provider] = Object.create(null);
  }
  const providerQueueFlags = queueFlags[provider];
  if (pendingIcons[provider] === void 0) {
    pendingIcons[provider] = Object.create(null);
  }
  const providerPendingIcons = pendingIcons[provider];
  if (providerIconsToLoad[prefix] === void 0) {
    providerIconsToLoad[prefix] = icons;
  } else {
    providerIconsToLoad[prefix] = providerIconsToLoad[prefix].concat(icons).sort();
  }
  if (!providerQueueFlags[prefix]) {
    providerQueueFlags[prefix] = true;
    setTimeout(() => {
      providerQueueFlags[prefix] = false;
      const icons2 = providerIconsToLoad[prefix];
      delete providerIconsToLoad[prefix];
      const api = getAPIModule(provider);
      if (!api) {
        err();
        return;
      }
      const params = api.prepare(provider, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data, error2) => {
          const storage2 = getStorage(provider, prefix);
          if (typeof data !== "object") {
            if (error2 !== 404) {
              return;
            }
            const t = Date.now();
            item.icons.forEach((name) => {
              storage2.missing[name] = t;
            });
          } else {
            try {
              const parsed = addIconSet(storage2, data);
              if (!parsed.length) {
                return;
              }
              const pending = providerPendingIcons[prefix];
              parsed.forEach((name) => {
                delete pending[name];
              });
              if (cache.store) {
                cache.store(provider, data);
              }
            } catch (err2) {
              console.error(err2);
            }
          }
          loadedNewIcons(provider, prefix);
        });
      });
    });
  }
}
var loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix = icon.prefix;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push({
      provider,
      prefix
    });
    if (pendingIcons[provider] === void 0) {
      pendingIcons[provider] = Object.create(null);
    }
    const providerPendingIcons = pendingIcons[provider];
    if (providerPendingIcons[prefix] === void 0) {
      providerPendingIcons[prefix] = Object.create(null);
    }
    if (newIcons[provider] === void 0) {
      newIcons[provider] = Object.create(null);
    }
    const providerNewIcons = newIcons[provider];
    if (providerNewIcons[prefix] === void 0) {
      providerNewIcons[prefix] = [];
    }
  });
  const time = Date.now();
  sortedIcons.pending.forEach((icon) => {
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const pendingQueue = pendingIcons[provider][prefix];
    if (pendingQueue[name] === void 0) {
      pendingQueue[name] = time;
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((source) => {
    const provider = source.provider;
    const prefix = source.prefix;
    if (newIcons[provider][prefix].length) {
      loadNewIcons(provider, prefix, newIcons[provider][prefix]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
var cacheVersion = "iconify2";
var cachePrefix = "iconify";
var countKey = cachePrefix + "-count";
var versionKey = cachePrefix + "-version";
var hour = 36e5;
var cacheExpiration = 168;
var config = {
  local: true,
  session: true
};
var loaded = false;
var count = {
  local: 0,
  session: 0
};
var emptyList = {
  local: [],
  session: []
};
var _window = typeof window === "undefined" ? {} : window;
function getGlobal(key) {
  const attr = key + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  config[key] = false;
  return null;
}
function setCount(storage2, key, value) {
  try {
    storage2.setItem(countKey, value + "");
    count[key] = value;
    return true;
  } catch (err) {
    return false;
  }
}
function getCount(storage2) {
  const count2 = storage2.getItem(countKey);
  if (count2) {
    const total = parseInt(count2);
    return total ? total : 0;
  }
  return 0;
}
function initCache(storage2, key) {
  try {
    storage2.setItem(versionKey, cacheVersion);
  } catch (err) {
  }
  setCount(storage2, key, 0);
}
function destroyCache(storage2) {
  try {
    const total = getCount(storage2);
    for (let i = 0; i < total; i++) {
      storage2.removeItem(cachePrefix + i);
    }
  } catch (err) {
  }
}
var loadCache = () => {
  if (loaded) {
    return;
  }
  loaded = true;
  const minTime = Math.floor(Date.now() / hour) - cacheExpiration;
  function load2(key) {
    const func = getGlobal(key);
    if (!func) {
      return;
    }
    const getItem = (index2) => {
      const name = cachePrefix + index2;
      const item = func.getItem(name);
      if (typeof item !== "string") {
        return false;
      }
      let valid = true;
      try {
        const data = JSON.parse(item);
        if (typeof data !== "object" || typeof data.cached !== "number" || data.cached < minTime || typeof data.provider !== "string" || typeof data.data !== "object" || typeof data.data.prefix !== "string") {
          valid = false;
        } else {
          const provider = data.provider;
          const prefix = data.data.prefix;
          const storage2 = getStorage(provider, prefix);
          valid = addIconSet(storage2, data.data).length > 0;
        }
      } catch (err) {
        valid = false;
      }
      if (!valid) {
        func.removeItem(name);
      }
      return valid;
    };
    try {
      const version = func.getItem(versionKey);
      if (version !== cacheVersion) {
        if (version) {
          destroyCache(func);
        }
        initCache(func, key);
        return;
      }
      let total = getCount(func);
      for (let i = total - 1; i >= 0; i--) {
        if (!getItem(i)) {
          if (i === total - 1) {
            total--;
          } else {
            emptyList[key].push(i);
          }
        }
      }
      setCount(func, key, total);
    } catch (err) {
    }
  }
  for (const key in config) {
    load2(key);
  }
};
var storeCache = (provider, data) => {
  if (!loaded) {
    loadCache();
  }
  function store(key) {
    if (!config[key]) {
      return false;
    }
    const func = getGlobal(key);
    if (!func) {
      return false;
    }
    let index2 = emptyList[key].shift();
    if (index2 === void 0) {
      index2 = count[key];
      if (!setCount(func, key, index2 + 1)) {
        return false;
      }
    }
    try {
      const item = {
        cached: Math.floor(Date.now() / hour),
        provider,
        data
      };
      func.setItem(cachePrefix + index2, JSON.stringify(item));
    } catch (err) {
      return false;
    }
    return true;
  }
  if (!store("local")) {
    store("session");
  }
};
var separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function alignmentFromString(custom, align) {
  align.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "left":
      case "center":
      case "right":
        custom.hAlign = value;
        break;
      case "top":
      case "middle":
      case "bottom":
        custom.vAlign = value;
        break;
      case "slice":
      case "crop":
        custom.slice = true;
        break;
      case "meet":
        custom.slice = false;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
var svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
function render(icon, props) {
  const customisations = mergeCustomisations(defaults, props);
  const componentProps = { ...svgDefaults };
  let style = typeof props.style === "string" ? props.style : "";
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "align":
        if (typeof value === "string") {
          alignmentFromString(customisations, value);
        }
        break;
      case "color":
        style = style + (style.length > 0 && style.trim().slice(-1) !== ";" ? ";" : "") + "color: " + value + "; ";
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default:
        if (key.slice(0, 3) === "on:") {
          break;
        }
        if (defaults[key] === void 0) {
          componentProps[key] = value;
        }
    }
  }
  const item = iconToSVG(icon, customisations);
  for (let key in item.attributes) {
    componentProps[key] = item.attributes[key];
  }
  if (item.inline) {
    style = "vertical-align: -0.125em; " + style;
  }
  if (style !== "") {
    componentProps.style = style;
  }
  let localCounter = 0;
  const id = props.id;
  return {
    attributes: componentProps,
    body: replaceIDs(item.body, id ? () => id + "-" + localCounter++ : "iconify-svelte-")
  };
}
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  cache.store = storeCache;
  loadCache();
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (typeof item !== "object" || item === null || item instanceof Array || typeof item.icons !== "object" || typeof item.prefix !== "string" || !addCollection(item)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window2.IconifyProviders !== void 0) {
    const providers = _window2.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
function checkIconState(icon, state, mounted, callback, onload) {
  function abortLoading() {
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  }
  if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
    state.name = "";
    abortLoading();
    return { data: fullIcon(icon) };
  }
  let iconName;
  if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
    abortLoading();
    return null;
  }
  const data = getIconData(iconName);
  if (data === null) {
    if (mounted && (!state.loading || state.loading.name !== icon)) {
      abortLoading();
      state.name = "";
      state.loading = {
        name: icon,
        abort: loadIcons([iconName], callback)
      };
    }
    return null;
  }
  abortLoading();
  if (state.name !== icon) {
    state.name = icon;
    if (onload && !state.destroyed) {
      onload(icon);
    }
  }
  const classes = ["iconify"];
  if (iconName.prefix !== "") {
    classes.push("iconify--" + iconName.prefix);
  }
  if (iconName.provider !== "") {
    classes.push("iconify--" + iconName.provider);
  }
  return { data, classes };
}
function generateIcon(icon, props) {
  return icon ? render(icon, props) : null;
}
var Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const state = {
    name: "",
    loading: null,
    destroyed: false
  };
  let mounted = false;
  let data;
  const onLoad = (icon) => {
    if (typeof $$props.onLoad === "function") {
      $$props.onLoad(icon);
    }
    const dispatch = createEventDispatcher();
    dispatch("load", { icon });
  };
  function loaded2() {
  }
  onMount(() => {
    mounted = true;
  });
  onDestroy(() => {
    state.destroyed = true;
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  });
  {
    {
      const iconData = checkIconState($$props.icon, state, mounted, loaded2, onLoad);
      data = iconData ? generateIcon(iconData.data, $$props) : null;
      if (data && iconData.classes) {
        data.attributes["class"] = (typeof $$props["class"] === "string" ? $$props["class"] + " " : "") + iconData.classes.join(" ");
      }
    }
  }
  return `${data !== null ? `<svg${spread([escape_object(data.attributes)])}><!-- HTML_TAG_START -->${data.body}<!-- HTML_TAG_END --></svg>` : ``}`;
});
var hydrate$a = false;
var prerender$a = true;
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>About \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">About</h1>
<p class="${"walloftext"}">Hi there! And <i>welcome</i> to Chris P&#39;s internet property. I&#39;m a budding engineer, a few years out of the University of Washington Materials science &amp; engineering program in Seattle.</p>
<p class="${"walloftext"}">I&#39;m currenlty most practiced in backend software development + cloud infrastructure architecture &amp; engineering. Coming from a physical engineering background, I&#39;ve had to learn quite a lot in my IT endeavours, both on my own and from the gracious assistance of others, whose patience I am grateful for eternally. I envision that with my multifaceted background and cross-disciplinary engineering cultivation, I can really bring a new perspective to the table in backend development and architecture.</p>

<p class="${"walloftext"}">I&#39;m also working to build <a class="${"link"}" href="${"https://devisa.io"}">devisa</a> and <a class="${"link"}" href="${"https://idlets.com"}">idlets</a>. Keep in touch with me through real means or quietly stalk my <a class="${"link"}" href="${"/etc/updates"}">activity</a> <a class="${"link"}" href="${"/posts"}">feeds</a> if you&#39;re into that. If you wanna talk, email me at <a href="${"mailto:clp@clp.is"}" class="${"link"}">clp@clp.is</a> or message me on LinkedIn. Thank you, sincerely!</p>

<p class="${"walloftext"}">- Chris P${validate_component(Date_1, "Date").$$render($$result, { date: "07-29-21" }, {}, {})}</p>
<br><br>
<h3>Miscellaneous</h3>
<p>${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi-light:home" }, {}, {})}Now Listening: <span>test</span></p>
<br>
<br>
<h3>Pics</h3>
<img src="${"me/closed.jpeg"}" height="${"275"}" width="${"275"}">
<img src="${"me/stare.jpeg"}" height="${"275"}" width="${"275"}">
<img src="${"me/cout.jpeg"}" height="${"275"}" width="${"275"}">`;
});
var index$e = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About,
  hydrate: hydrate$a,
  prerender: prerender$a
});
var css$b = {
  code: "form{padding-left:3%;padding-right:1%;padding-top:2%;padding-bottom:2%;background-color:rgba(0,0,0,0.02);box-shadow:0px 0px 7px rgba(0,0,0,0.00);width:50%;display:block;position:relative;align-content:center;justify-content:center;align-items:center;box-shadow:0px 0px 5px rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.02);border-radius:6px;border-bottom:3px solid rgba(0,0,0,0.09);margin:auto}",
  map: `{"version":3,"file":"pics.svelte","sources":["pics.svelte"],"sourcesContent":["<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\nimport Date from '$lib/date.svelte'\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>about/pics \u2022 clp.is</title>\\n</svelte:head>\\n<style>\\n    :global(form) {\\n\\tpadding-left: 3%;\\n\\tpadding-right: 1%;\\n\\tpadding-top: 2%;\\n\\tpadding-bottom: 2%;\\n\\tbackground-color: rgba(0,0,0,0.02);\\n\\tbox-shadow: 0px 0px 7px rgba(0,0,0,0.00);\\n\\twidth: 50%;\\n\\tdisplay: block;\\n\\tposition:relative;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\talign-items: center;\\n\\tbox-shadow: 0px 0px 5px rgba(0,0,0,0.03);\\n\\tborder: 1px solid rgba(0,0,0,0.02);\\n\\tborder-radius: 6px;\\n\\tborder-bottom: 3px solid rgba(0,0,0,0.09);\\n\\tmargin: auto;\\n    }\\n    label::before {\\n\\t    content: \\"$   \\";\\n\\t    font-size: 0.8rem;\\n\\t    color: rgba(0,0,0,0.2);\\n\\t}\\n    input { \\n\\tpadding: 10px; \\n\\tmargin-top: 4px;\\n\\twidth: 80%;\\n\\tborder-radius:5px; \\n\\tborder: 1px transparent; \\n\\tborder-top: 1px solid rgba(0,0,0,0.1);\\n\\tbackground: rgba(0,0,0,0.05);\\n\\t}\\n    textarea { \\n\\tpadding: 10px; \\n\\tmargin-top: 4px;\\n\\tborder-radius:5px; \\n\\twidth: 80%;\\n\\tborder: 1px transparent; \\n\\tborder-top: 1px solid rgba(0,0,0,0.1);\\n\\tbackground: rgba(0,0,0,0.05);\\n\\t}\\n\\tlabel {\\n\\t\\tfont-size: 0.9rem;\\n\\t\\tpadding-left: 02px;\\n\\t\\tcolor: rgba(0,0,0,0.6);\\n\\t\\ttext-shadow: 0px 0px 4px rgba(0,0,0,0.05);\\n\\t    }\\n    button {\\n\\tborder: 2px solid transparent;\\n\\tborder-bottom: 2px solid rgba(0,0,0,0.1);\\n\\tborder-top: 1px solid rgba(0,0,0,0.025);\\n\\tborder-left: 1px solid rgba(0,0,0,0.025);\\n\\tborder-right: 1px solid rgba(0,0,0,0.025);\\n\\tcolor: rgba(0,0,0,0.6);\\n\\tbackground-color: rgba(255,255,255,1);\\n\\tpadding: 8px;\\n\\tborder-radius: 3px;\\n\\n\\t}\\n\\tinput:active {\\n\\t\\tbackground-color: rgba(0,0,0,0.2);\\n\\t    }\\n\\tinput:focus {\\n\\t\\tbackground-color: rgba(0,0,0,0.12);\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\t\\toutline:none;\\n\\t\\ttransform:scale(1.1);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t    }\\n\\ttextarea:active {\\n\\t\\tbackground-color: rgba(0,0,0,0.2);\\n\\t\\ttransform:scale(0.9);\\n\\t    }\\n\\ttextarea:focus {\\n\\t\\tbackground-color: rgba(0,0,0,0.12);\\n\\t\\tborder-top: 1px solid rgba(0,0,0,0.2);\\n\\t\\toutline:none;\\n\\t\\ttransform:scale(1.05);\\n\\t\\ttransition: all 0.1s ease-in-out;\\n\\t    }\\n\\tform button:hover {\\n\\t    background-color: rbga(0,0,0,0.25);\\n\\t    border-bottom: 2px solid rgba(0,0,0,0.25);\\n\\t    border-radius: 5px;\\n\\t    transform:scale(1.05);\\n\\t    transition:all 0.1s ease-in-out;\\n\\t}\\n\\tform button:active {\\n\\n\\t    }\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\n\\n\\t\\t}\\n\\t    .form {\\n\\t\\talign-content: center;\\n\\talign-content: center;\\n\\tjustify-content:center;\\n\\t}\\n\\n\\n\\t\\t.formtitle {\\n\\t\\t    font-family:monospace;\\n\\t\\t    padding-bottom: 12px;\\n\\t\\t    padding-left: 8px;\\n\\t\\t\\tdisplay:block;\\n\\t\\t    }\\n\\t\\t    .gray {\\n\\t\\t\\t    color: rgba(0,0,0,0.5);\\n\\t\\t\\t}\\n\\n/* .walloftext { width: 80%; margin: auto; display:block; } */\\n</style>\\n\\n<h1 id=\\"head\\">about / pics</h1>\\n"],"names":[],"mappings":"AAUY,IAAI,AAAE,CAAC,AAClB,YAAY,CAAE,EAAE,CAChB,aAAa,CAAE,EAAE,CACjB,WAAW,CAAE,EAAE,CACf,cAAc,CAAE,EAAE,CAClB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxC,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,KAAK,CACd,SAAS,QAAQ,CACjB,aAAa,CAAE,MAAM,CACrB,gBAAgB,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,aAAa,CAAE,GAAG,CAClB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,MAAM,CAAE,IAAI,AACT,CAAC"}`
};
var hydrate$9 = false;
var prerender$9 = true;
var Pics = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$b);
  return `${$$result.head += `${$$result.title = `<title>about/pics \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">about / pics</h1>`;
});
var pics = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Pics,
  hydrate: hydrate$9,
  prerender: prerender$9
});
var hydrate$8 = false;
var prerender$8 = true;
var Links = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Links \u2022 clp.is</title>`, ""}`, ""}
<h1 id="${"head"}">Links</h1>`;
});
var index$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Links,
  hydrate: hydrate$8,
  prerender: prerender$8
});
var _error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var __error$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error$1
});
var hydrate$7 = false;
var prerender$7 = true;
var Posts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Posts \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">Posts</h1>
<p>this is where posts will be</p>

<h2>list</h2>
<p>oof</p>`;
});
var index$c = /* @__PURE__ */ Object.freeze({
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
  code: ".secondary{background-color:rbga(0,0,0,0.25)}.secondary:hover{background-color:rbga(0,0,0,0.35)}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>Auth \u2022 clp.is</title>\\n</svelte:head>\\n<style>\\n:global(.secondary) {\\n    background-color: rbga(0,0,0,0.25);\\n\\n    }\\n:global(.secondary:hover) {\\n    background-color: rbga(0,0,0,0.35);\\n\\n    }\\n</style>\\n\\n<h1 id=\\"head\\">Authentication</h1>\\n<ul>\\n<li>Signup sends application to backend to go through verification.</li>\\n<li>Everything still under construction!</li>\\n\\n</ul>\\n<div class=\\"form\\">\\n<form class=\\"login\\">\\n    <span class=\\"formtitle\\">Log <span class=\\"gray\\">in</span> to clp.is</span>\\n\\n    <label for=\\"email\\">E-mail</label><br/>\\n    <input name=\\"email\\" placeholder=\\"E-mail\\"/>\\n\\n\\n    <br/><br/>\\n    <label for=\\"passwor\\">Password</label><br/>\\n    <input name=\\"password\\" type=\\"password\\" placeholder=\\"password\\"/>\\n\\n<br/>\\n<br/>\\n    <button label=\\"login\\">Login</button>\\n    <button class=\\"secondary\\" label=\\"Help\\">Help</button>\\n</form>\\n<form class=\\"sigunp\\">\\n    <span class=\\"formtitle\\">(Apply) to sign up <span class=\\"gray\\">up</span> to clp.is</span>\\n\\n    <label for=\\"email\\">E-mail</label><br/>\\n    <input name=\\"email\\" placeholder=\\"E-mail\\"/>\\n\\n\\n    <br/><br/>\\n    <label for=\\"password\\">Password</label><br/>\\n    <input name=\\"password\\" type=\\"password\\" placeholder=\\"Password\\"/>\\n\\n<br/>\\n<br/>\\n    <button label=\\"login\\">Next</button>\\n    <button class=\\"secondary\\" label=\\"Help\\">Help</button>\\n</form>\\n</div>\\n"],"names":[],"mappings":"AAIQ,UAAU,AAAE,CAAC,AACjB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAElC,CAAC,AACG,gBAAgB,AAAE,CAAC,AACvB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAElC,CAAC"}'
};
var Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$a);
  return `${$$result.head += `${$$result.title = `<title>Auth \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">Authentication</h1>
<ul><li>Signup sends application to backend to go through verification.</li>
<li>Everything still under construction!</li></ul>
<div class="${"form"}"><form class="${"login"}"><span class="${"formtitle"}">Log <span class="${"gray"}">in</span> to clp.is</span>

    <label for="${"email"}">E-mail</label><br>
    <input name="${"email"}" placeholder="${"E-mail"}">


    <br><br>
    <label for="${"passwor"}">Password</label><br>
    <input name="${"password"}" type="${"password"}" placeholder="${"password"}">

<br>
<br>
    <button label="${"login"}">Login</button>
    <button class="${"secondary"}" label="${"Help"}">Help</button></form>
<form class="${"sigunp"}"><span class="${"formtitle"}">(Apply) to sign up <span class="${"gray"}">up</span> to clp.is</span>

    <label for="${"email"}">E-mail</label><br>
    <input name="${"email"}" placeholder="${"E-mail"}">


    <br><br>
    <label for="${"password"}">Password</label><br>
    <input name="${"password"}" type="${"password"}" placeholder="${"Password"}">

<br>
<br>
    <button label="${"login"}">Next</button>
    <button class="${"secondary"}" label="${"Help"}">Help</button></form></div>`;
});
var index$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Auth
});
var Signup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$a = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Signup
});
var Login$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Login$1
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
  return `${$$result.head += `${$$result.title = `<title>Etcetera \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">Etc.</h1>
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
var index$8 = /* @__PURE__ */ Object.freeze({
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
var index$7 = /* @__PURE__ */ Object.freeze({
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
var Ling = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Ling
});
var Russian = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Russian
});
var Con = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Con
});
var css$4 = {
  code: ".l.svelte-bth4dt{list-style:decimal}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<style>\\n   .l {\\n    list-style: decimal;\\n}\\n</style>\\n<svelte:head>\\n\\t<title>Lab \u2022 clp.is</title>\\n</svelte:head>\\n<h1>lab</h1>\\n<ul class=\\"l\\">\\n\\t<li><a class=\\"link ext\\" href=\\"https://github.com/clpi/dotfiles\\">dotfiles</a>:  &nbsp;&nbsp;My dotfiles for nvim, alacritty, tmux, etc.</li>\\n</ul>\\n"],"names":[],"mappings":"AACG,EAAE,cAAC,CAAC,AACH,UAAU,CAAE,OAAO,AACvB,CAAC"}'
};
var Lab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `${$$result.head += `${$$result.title = `<title>Lab \u2022 clp.is</title>`, ""}`, ""}
<h1>lab</h1>
<ul class="${"l svelte-bth4dt"}"><li><a class="${"link ext"}" href="${"https://github.com/clpi/dotfiles"}">dotfiles</a>:  \xA0\xA0My dotfiles for nvim, alacritty, tmux, etc.</li></ul>`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Lab
});
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error
});
var css$3 = {
  code: ".tag.svelte-oucym9{padding:3px;margin:3px;border-radius:3px;font-size:0.85rem;color:rgba(0,0,0,0.28);background-color:rgba(0,0,0,0.06)}.tag.svelte-oucym9:hover{background-color:rgba(0,0,0,0.10);transform:scale(1.1);transition:all 0.2s ease-in-out;color:rgba(0,0,0,0.38)}.lite.svelte-oucym9{color:rgba(0,0,0,0.5)}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["\\n<svelte:head>\\n\\t<title>Projects \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script>\\nimport  Date  from '$lib/date.svelte'\\n<\/script>\\n<style>\\n   /* :global(.ext::after) {\\ncontent: \\" [->]\\";\\nfont-size: 0.6rem;\\ntransition: all 0.15s ease-in-out;\\ncolor: rgba(0,0,0,0.4);\\n   }\\n   :global(.ext:hover::after) {\\ncontent: \\" [->]\\";\\ntransition: all 0.15s ease-in-out;\\n   } */\\n   .tag { \\npadding: 3px;\\nmargin: 3px;\\nborder-radius: 3px;\\nfont-size: 0.85rem;\\ncolor: rgba(0,0,0,0.28);\\nbackground-color: rgba(0,0,0,0.06);\\n\\n}\\n.tag:hover {\\n\\tbackground-color: rgba(0,0,0,0.10);\\n\\ttransform: scale(1.1);\\n\\ttransition: all 0.2s ease-in-out;\\ncolor: rgba(0,0,0,0.38);\\n    }\\n   .lite { color: rgba(0,0,0,0.5);}\\n</style>\\n<h1 id=\\"head\\">Projects</h1>\\n<ul>\\n<li><a class=\\"link\\" href=\\"/p/recollection\\">recollection</a>  <a class=\\"link ext lite\\" href=\\"https://github.com/clpi/recollection\\"> (github)</a>:&nbsp;&nbsp; implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.<span class='tag'>#lib</span><span class='tag'>#rust</span><Date date=\\"07-29-21\\"/></li>\\n<li><a class=\\"link\\" href=\\"/p/iz\\">iz</a>  <a class=\\"link ext lite\\" href=\\"https://github.com/clpi/iz\\"> (github)</a>:&nbsp;&nbsp; Zig implementation of CLI utility to automate and motivate daily data tasks esp. regarding health, like logging blood glucose levels for type 1 diabetics and performing elementary data analaysis and management. Also using to learn zig and generally become more experienced, as well as  uprototyping certain ideas for down the road. <span class='tag'>#zig</span><span class=\\"tag\\">#nim</span><span class=\\"tag\\">#cli</span><Date date=\\"08-07-21\\"/></li>\\n</ul>\\n<p>Last updated <Date date=\\"08-07-21\\"/>. Not a comprehensive list</p>\\n<br/>\\n\\n\\n"],"names":[],"mappings":"AAmBG,IAAI,cAAC,CAAC,AACT,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CACX,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,OAAO,CAClB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAElC,CAAC,AACD,kBAAI,MAAM,AAAC,CAAC,AACX,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CACjC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACnB,CAAC,AACF,KAAK,cAAC,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAAC,CAAC"}`
};
var P = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `${$$result.head += `${$$result.title = `<title>Projects \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">Projects</h1>
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
  const rendered = await render$1({
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
