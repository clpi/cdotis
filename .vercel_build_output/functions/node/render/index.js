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
    return new fetchBlob([buf], {
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
      const data = src(request.url);
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
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
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
      const [type] = h["content-type"].split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding = h["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding).decode(data));
      }
      fulfil(data);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
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
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
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
  if (branch) {
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
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2.path)},
						query: new URLSearchParams(${s$1(page2.query.toString())}),
						params: ${s$1(page2.params)}
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
        status,
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
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
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
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
var hasScheme = (url) => /^[a-zA-Z]+:/.test(url);
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page: page2,
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
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (hasScheme(url)) {
          if (typeof request.host !== "undefined") {
            const { hostname: fetchHostname } = new URL(url);
            const [serverHostname] = request.host.split(":");
            if (`.${fetchHostname}`.endsWith(`.${serverHostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const externalRequest = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, externalRequest);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page2.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
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
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
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
      context: loaded.context,
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
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
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
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node,
              $session,
              context,
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
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page: page2,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
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
        branch.push(loaded);
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
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page: page2
    });
  } catch (error4) {
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
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
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
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
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
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({ ...request, params });
    const preface = `Invalid response from route ${request.path}`;
    if (response) {
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
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
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
  if (!raw)
    return raw;
  if (typeof raw === "string") {
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
  return raw;
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
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
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
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
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
var css$6 = {
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
  $$result.css.add(css$6);
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
      file: "/./_app/start-57b1f40c.js",
      css: ["/./_app/assets/start-c550a47d.css"],
      js: ["/./_app/start-57b1f40c.js", "/./_app/chunks/vendor-93492730.js"]
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
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }],
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
      pattern: /^\/projects\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/projects/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/projects\/recollection\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/projects/recollection.svelte"],
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
      pattern: /^\/lab\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/lab/index.svelte"],
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
    return index$8;
  }),
  "src/routes/resources/index.svelte": () => Promise.resolve().then(function() {
    return index$7;
  }),
  "src/routes/projects/index.svelte": () => Promise.resolve().then(function() {
    return index$6;
  }),
  "src/routes/projects/recollection.svelte": () => Promise.resolve().then(function() {
    return recollection;
  }),
  "src/routes/about/index.svelte": () => Promise.resolve().then(function() {
    return index$5;
  }),
  "src/routes/links/index.svelte": () => Promise.resolve().then(function() {
    return index$4;
  }),
  "src/routes/posts/index.svelte": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/posts/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  }),
  "src/routes/auth/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/auth/login.svelte": () => Promise.resolve().then(function() {
    return login;
  }),
  "src/routes/uses.svelte": () => Promise.resolve().then(function() {
    return uses;
  }),
  "src/routes/etc/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/lab/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-540b00e3.js", "css": ["/./_app/assets/pages/__layout.svelte-cd164cf5.css"], "js": ["/./_app/pages/__layout.svelte-540b00e3.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-87cd0996.js", "css": [], "js": ["/./_app/error.svelte-87cd0996.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-5e68fb7b.js", "css": ["/./_app/assets/date-283b6cdf.css"], "js": ["/./_app/pages/index.svelte-5e68fb7b.js", "/./_app/chunks/vendor-93492730.js", "/./_app/chunks/date-b690abad.js"], "styles": null }, "src/routes/resources/index.svelte": { "entry": "/./_app/pages/resources/index.svelte-bfe7c2f3.js", "css": [], "js": ["/./_app/pages/resources/index.svelte-bfe7c2f3.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/projects/index.svelte": { "entry": "/./_app/pages/projects/index.svelte-2ebea3da.js", "css": ["/./_app/assets/pages/projects/index.svelte-0eaa0f55.css", "/./_app/assets/date-283b6cdf.css"], "js": ["/./_app/pages/projects/index.svelte-2ebea3da.js", "/./_app/chunks/vendor-93492730.js", "/./_app/chunks/date-b690abad.js"], "styles": null }, "src/routes/projects/recollection.svelte": { "entry": "/./_app/pages/projects/recollection.svelte-2bad0568.js", "css": ["/./_app/assets/pages/projects/recollection.svelte-d33a2ec5.css", "/./_app/assets/date-283b6cdf.css"], "js": ["/./_app/pages/projects/recollection.svelte-2bad0568.js", "/./_app/chunks/vendor-93492730.js", "/./_app/chunks/date-b690abad.js"], "styles": null }, "src/routes/about/index.svelte": { "entry": "/./_app/pages/about/index.svelte-3925eeea.js", "css": [], "js": ["/./_app/pages/about/index.svelte-3925eeea.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/links/index.svelte": { "entry": "/./_app/pages/links/index.svelte-61044f8c.js", "css": [], "js": ["/./_app/pages/links/index.svelte-61044f8c.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/posts/index.svelte": { "entry": "/./_app/pages/posts/index.svelte-84b18bcd.js", "css": [], "js": ["/./_app/pages/posts/index.svelte-84b18bcd.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/posts/[slug].svelte": { "entry": "/./_app/pages/posts/[slug].svelte-7ffc1dad.js", "css": [], "js": ["/./_app/pages/posts/[slug].svelte-7ffc1dad.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/auth/index.svelte": { "entry": "/./_app/pages/auth/index.svelte-564e293e.js", "css": [], "js": ["/./_app/pages/auth/index.svelte-564e293e.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/auth/login.svelte": { "entry": "/./_app/pages/auth/login.svelte-e57ae5d4.js", "css": [], "js": ["/./_app/pages/auth/login.svelte-e57ae5d4.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/uses.svelte": { "entry": "/./_app/pages/uses.svelte-e3d2b567.js", "css": [], "js": ["/./_app/pages/uses.svelte-e3d2b567.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/etc/index.svelte": { "entry": "/./_app/pages/etc/index.svelte-14e0070c.js", "css": [], "js": ["/./_app/pages/etc/index.svelte-14e0070c.js", "/./_app/chunks/vendor-93492730.js"], "styles": null }, "src/routes/lab/index.svelte": { "entry": "/./_app/pages/lab/index.svelte-22f59551.js", "css": [], "js": ["/./_app/pages/lab/index.svelte-22f59551.js", "/./_app/chunks/vendor-93492730.js"], "styles": null } };
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
var css$5 = {
  code: 'body{border:5px solid black;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:2% 4% 2% 4%;font-weight:300;font-family:monospace}a.svelte-1b34ssb.svelte-1b34ssb{text-decoration:none}#title.svelte-1b34ssb.svelte-1b34ssb{border-radius:4px;font-family:monospace;padding:18px 17px 18px 17px;font-size:1.4rem;margin-right:2%;color:black;background-color:#fffdfc;margin-left:2%;transform:scale(1.1);border:2px solid rgba(0,0,0,0.6);transition:all 0.05s;color:rgba(0,0,0,1);font-weight:400;letter-spacing:-1px;position:relative;display:inline-flex}#title.svelte-1b34ssb.svelte-1b34ssb::after{content:".is ";color:rgba(0,0,0,0.25)}li.svelte-1b34ssb a.svelte-1b34ssb::before{content:"/";color:rgba(0,0,0,0.25)}#title.svelte-1b34ssb.svelte-1b34ssb:hover{transform:scale(1.2);border-radius:5px;border:2px solid black;transition:all 0.05s;opacity:0.8}li.svelte-1b34ssb a.svelte-1b34ssb{color:rgba(0,0,0,0.8);text-decoration:none;padding:7px 4px;border:2px solid transparent;border-bottom-color:rgba(0,0,0,0.4);border-radius:0px;letter-spacing:-0px;display:inline-flex}nav.svelte-1b34ssb ul li a.svelte-1b34ssb{font-size:1.0rem;margin-right:1.5vw}nav.svelte-1b34ssb.svelte-1b34ssb{color:var(--fg-light);margin-bottom:0%;padding:0% 0%;display:block;height:90px}ul.svelte-1b34ssb.svelte-1b34ssb{margin-top:0%;display:inline-flex}ul.svelte-1b34ssb li.svelte-1b34ssb{display:inline-block;position:relative}.right.svelte-1b34ssb.svelte-1b34ssb{position:relative;display:inline-block}.right.svelte-1b34ssb.svelte-1b34ssb{float:right;margin-top:1%}.right.svelte-1b34ssb a.svelte-1b34ssb{padding:3px 5px;border:2px solid rgba(0,0,0,0.2);color:rgba(0,0,0,0.2);border-radius:2px;font-size:0.8rem}#etc.svelte-1b34ssb.svelte-1b34ssb{padding:3px;letter-spacing:-2px;padding-right:5px}.right.svelte-1b34ssb a.svelte-1b34ssb:hover{color:rgba(0,0,0,0.4);border:2px solid rgba(0,0,0,0.4);background:#fffdfc;transition:all 0.05s;box-shadow:0px 0px 4px rgba(0,0,0,0.15)}.tabl.svelte-1b34ssb.svelte-1b34ssb{clear:both;padding:0px;margin:0px;display:inline-block}li.svelte-1b34ssb.svelte-1b34ssb{padding:0px}li.svelte-1b34ssb.svelte-1b34ssb:hover{transform:scale(1.15);transition:all 0.1s ease-in-out}li.svelte-1b34ssb:hover a.svelte-1b34ssb{color:black;border-radius:0px;background-color:#fffdfc;border-bottom:2px ridge black;transition:all 0.03s ease-in-out}li.svelte-1b34ssb.svelte-1b34ssb:active{transform:scale(0.95);transition:all 0.03s ease-in-out}li.svelte-1b34ssb:active a.svelte-1b34ssb{transition:all 0.03s ease-in-out}',
  map: `{"version":3,"file":"nav.svelte","sources":["nav.svelte"],"sourcesContent":["<script>\\nexport let section = \\"Home\\";\\n<\/script>\\n\\n<style>\\n:global(body) {\\n\\tborder: 5px solid black;\\n\\theight: 100vh;\\n\\tmin-height: 100vh;\\n\\tmargin: 0;\\n\\tmax-width: 100%;\\n\\toverflow-x: hidden;\\n\\tpadding: 2% 4% 2% 4%;\\n\\tfont-weight: 300;\\n\\tfont-family:\\n\\t\\tmonospace;\\n}\\na { text-decoration:none; }\\n#title {\\n\\tborder-radius: 4px;\\n\\tfont-family: monospace;\\n\\tpadding: 18px 17px 18px 17px;\\n\\tfont-size: 1.4rem;\\n\\tmargin-right: 2%;\\n\\tcolor: black;\\n\\tbackground-color: #fffdfc;\\n\\tmargin-left:2%;\\n\\ttransform: scale(1.1);\\n\\tborder: 2px solid rgba(0,0,0,0.6);\\n\\ttransition: all 0.05s;\\n\\tcolor: rgba(0,0,0,1);\\n\\t/* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */\\n\\tfont-weight: 400;\\n\\tletter-spacing: -1px;\\n\\tposition: relative;\\n\\tdisplay:inline-flex;\\n}\\n#title::after {\\n\\tcontent: \\".is \\";\\n\\tcolor: rgba(0,0,0,0.25);\\n}\\nspan {\\n\\tdisplay:inline-flex;\\n}\\nli a::before {\\n\\tcontent: \\"/\\";\\n\\tcolor: rgba(0,0,0,0.25);\\n\\n}\\n#title:hover {\\n\\ttransform: scale(1.2);\\n\\n\\n\\tborder-radius: 5px;\\n\\tborder: 2px solid black;\\n\\t/* box-shadow: 0px 2px 8px rgba(0,0,0,0.15); */\\n\\ttransition: all 0.05s;\\n\\topacity: 0.8;\\n}\\nli a {\\n\\tcolor:rgba(0,0,0,0.8);\\n\\ttext-decoration: none;\\n\\tpadding: 7px 4px;\\n\\tborder: 2px solid transparent;\\n\\tborder-bottom-color: rgba(0,0,0,0.4);\\n\\tborder-radius: 0px;\\n\\tletter-spacing: -0px;\\n\\tdisplay:inline-flex;\\n\\n}\\nnav ul li a {\\n\\tfont-size: 1.0rem;\\n\\tmargin-right: 1.5vw;\\n}\\nnav {\\n\\tcolor: var(--fg-light);\\n\\tmargin-bottom: 0%;\\n\\tpadding: 0% 0%;\\n\\tdisplay: block;\\n\\theight: 90px;\\n}\\nul {\\n\\tmargin-top: 0%;\\n\\tdisplay: inline-flex;\\n}\\nul li {\\n\\tdisplay: inline-block;\\n\\tposition:relative;\\n}\\n.left, .right {\\n\\tposition: relative;\\n\\tdisplay: inline-block;\\n}\\n.right {\\n\\tfloat:right;\\n\\tmargin-top: 1%;\\n}\\n.left {\\n\\tfloat: left;\\n\\tdisplay: inline-flex;\\n}\\n.right a {\\n\\t/* color: #fffdfc; */\\n\\tpadding: 3px 5px;\\n\\tborder: 2px solid rgba(0,0,0,0.2);\\n\\tcolor: rgba(0,0,0,0.2);\\n\\tborder-radius: 2px;\\n\\tfont-size: 0.8rem;\\n}\\n#etc{\\n\\tpadding: 3px;\\n\\tletter-spacing: -2px;\\n\\tpadding-right: 5px;\\n}\\n#lititle {\\n\\tmargin-right: 10%;\\n}\\n.right a:hover{\\n\\tcolor: rgba(0,0,0,0.4);\\n\\tborder: 2px solid rgba(0,0,0,0.4);\\n\\tbackground: #fffdfc;\\n\\ttransition: all 0.05s;\\n\\tbox-shadow: 0px 0px 4px rgba(0,0,0,0.15);\\n\\n}\\n.tabl {\\n\\tclear: both;\\n\\tpadding:0px;\\n\\tmargin:0px;\\n\\tdisplay:inline-block;\\n}\\nli {\\n\\tpadding: 0px;\\n}\\nli:hover {\\n\\ttransform:scale(1.15);\\n\\ttransition: all 0.1s ease-in-out;\\n}\\nli:hover a {\\n\\tcolor: black;\\n\\tborder-radius: 0px;\\n\\tbackground-color: #fffdfc;\\n\\tborder-bottom: 2px ridge black;\\n\\t/* transition: all 0.05s ease-in-out; */\\n\\t/* padding: 4px 4px; */\\n\\t/* box-shadow: 0px 1px 9px rgba(0,0,0,0.25); */\\n\\ttransition: all 0.03s ease-in-out;\\n}\\n#sect {\\n\\tfont-size: 1.0rem;\\n\\tmargin-left: 4%;\\n}\\nli:active {\\n\\ttransform: scale(0.95);\\n\\ttransition: all 0.03s ease-in-out;\\n}\\nli:active a {\\n\\ttransition: all 0.03s ease-in-out;\\n}\\n\\n\\n</style>\\n\\n<nav>\\n\\t<a href=\\"/\\"><div id=\\"title\\">clp</div></a>\\n\\t\\t\\t <div class=\\"tabl\\">\\n\\t\\t<ul class=\\"navbar\\">\\n\\n\\t\\t\\t<li><a class=\\"nav\\" sveltekit:prefetch href=\\"/\\">home</a></li>\\n\\t\\t\\t<li><a class=\\"nav\\" sveltekit:prefetch href=\\"/about\\">about</a></li>\\n\\t\\t\\t<li><a class=\\"nav\\" sveltekit:prefetch href=\\"/posts\\">posts</a></li>\\n\\t\\t\\t<li><a class=\\"nav\\" sveltekit:prefetch href=\\"/projects\\">projects</a></li>\\n\\t\\t\\t<li><a class=\\"nav\\" sveltekit:prefetch href=\\"/etc\\">etc</a></li>\\n\\n\\t\\t</ul>\\n\\t\\t\\t </div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class=\\"nav\\" id=\\"etc\\" href=\\"/lab\\">...</a>\\n\\n\\t\\t</div>\\n</nav>\\n"],"names":[],"mappings":"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"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { section = "Home" } = $$props;
  if ($$props.section === void 0 && $$bindings.section && section !== void 0)
    $$bindings.section(section);
  $$result.css.add(css$5);
  return `<nav class="${"svelte-1b34ssb"}"><a href="${"/"}" class="${"svelte-1b34ssb"}"><div id="${"title"}" class="${"svelte-1b34ssb"}">clp</div></a>
			 <div class="${"tabl svelte-1b34ssb"}"><ul class="${"navbar svelte-1b34ssb"}"><li class="${"svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" sveltekit:prefetch href="${"/"}">home</a></li>
			<li class="${"svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" sveltekit:prefetch href="${"/about"}">about</a></li>
			<li class="${"svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" sveltekit:prefetch href="${"/posts"}">posts</a></li>
			<li class="${"svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" sveltekit:prefetch href="${"/projects"}">projects</a></li>
			<li class="${"svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" sveltekit:prefetch href="${"/etc"}">etc</a></li></ul></div>
		<div class="${"right svelte-1b34ssb"}"><a class="${"nav svelte-1b34ssb"}" id="${"etc"}" href="${"/lab"}">...</a></div></nav>`;
});
var css$4 = {
  code: "p.svelte-rycl45.svelte-rycl45{color:rgba(0,0,0,0.3);font-size:0.9rem}a.svelte-rycl45.svelte-rycl45{text-decoration:none;font-size:0.9rem;color:rgba(130,130,70,0.7)}.nav.svelte-rycl45.svelte-rycl45:hover{padding:8px 5px;transition:all 0.25s ease-in-out}footer.svelte-rycl45.svelte-rycl45{color:rgba(0,0,0,0.3);font-size:0.8rem;padding:24px;margin-top:0%;position:sticky;bottom:0;display:block}.right.svelte-rycl45 a.svelte-rycl45:hover{color:rgba(0,0,0,0.4);border:2px solid rgba(0,0,0,0.4);background:#fffdfc;transition:all 0.05s;box-shadow:0px 0px 4px rgba(0,0,0,0.15)}.right.svelte-rycl45 a.svelte-rycl45{padding:3px 5px;border:2px solid rgba(0,0,0,0.2);color:rgba(0,0,0,0.2);border-radius:2px;font-size:0.8rem}.left.svelte-rycl45.svelte-rycl45,.right.svelte-rycl45.svelte-rycl45{position:relative;display:inline-block}.right.svelte-rycl45.svelte-rycl45{float:right;margin-top:1%}.left.svelte-rycl45.svelte-rycl45{float:left;display:inline-flex}",
  map: '{"version":3,"file":"footer.svelte","sources":["footer.svelte"],"sourcesContent":["<footer>\\n\\t<div class=\\"left\\">\\n\\t<p class=\\"foot\\">Last updated 2021</p>\\n\\t<p class=\\"foot\\"><a href=\\"mailto:clp@clp.is\\">Email</a> me</p>\\n\\t</div>\\n\\t\\t<div class=\\"right\\">\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gl\\" href=\\"https://gitlab.com/clpi\\">gitlab</a>\\n\\t\\t\\t<a class=\\"nav\\" id=\\"gh\\" href=\\"https://github.com/clpi\\">github</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://github.com/clpi\\">twitter</a>\\n\\t\\t\\t<a class=\\"nav\\"  href=\\"https://github.com/clpi\\">linkedin</a>\\n\\n\\t\\t</div>\\n\\n</footer>\\n<style>\\np {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.9rem;\\n\\n}\\na {\\n\\ttext-decoration:none;\\n\\tfont-size: 0.9rem;\\n\\tcolor: rgba(130,130,70,0.7);\\n}\\n.nav:hover {\\n\\tpadding: 8px 5px;\\n\\ttransition: all 0.25s ease-in-out;\\n}\\nfooter {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-size: 0.8rem;\\n\\tpadding: 24px;\\n\\tmargin-top: 0%;\\n\\tposition:sticky;\\n\\tbottom:0;\\n\\tdisplay: block;\\n}\\n.right a:hover{\\n\\tcolor: rgba(0,0,0,0.4);\\n\\tborder: 2px solid rgba(0,0,0,0.4);\\n\\tbackground: #fffdfc;\\n\\ttransition: all 0.05s;\\n\\tbox-shadow: 0px 0px 4px rgba(0,0,0,0.15);\\n\\n}\\n.right a {\\n\\t/* color: #fffdfc; */\\n\\tpadding: 3px 5px;\\n\\tborder: 2px solid rgba(0,0,0,0.2);\\n\\tcolor: rgba(0,0,0,0.2);\\n\\tborder-radius: 2px;\\n\\tfont-size: 0.8rem;\\n}\\n.left, .right {\\n\\tposition: relative;\\n\\tdisplay: inline-block;\\n}\\n.right {\\n\\tfloat:right;\\n\\tmargin-top: 1%;\\n}\\n.left {\\n\\tfloat: left;\\n\\tdisplay: inline-flex;\\n}\\n</style>\\n"],"names":[],"mappings":"AAeA,CAAC,4BAAC,CAAC,AACF,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,MAAM,AAElB,CAAC,AACD,CAAC,4BAAC,CAAC,AACF,gBAAgB,IAAI,CACpB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,CAAC,AAC5B,CAAC,AACD,gCAAI,MAAM,AAAC,CAAC,AACX,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AAClC,CAAC,AACD,MAAM,4BAAC,CAAC,AACP,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,EAAE,CACd,SAAS,MAAM,CACf,OAAO,CAAC,CACR,OAAO,CAAE,KAAK,AACf,CAAC,AACD,oBAAM,CAAC,eAAC,MAAM,CAAC,AACd,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACjC,UAAU,CAAE,OAAO,CACnB,UAAU,CAAE,GAAG,CAAC,KAAK,CACrB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAEzC,CAAC,AACD,oBAAM,CAAC,CAAC,cAAC,CAAC,AAET,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACjC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,MAAM,AAClB,CAAC,AACD,iCAAK,CAAE,MAAM,4BAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,AACtB,CAAC,AACD,MAAM,4BAAC,CAAC,AACP,MAAM,KAAK,CACX,UAAU,CAAE,EAAE,AACf,CAAC,AACD,KAAK,4BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,WAAW,AACrB,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<footer class="${"svelte-rycl45"}"><div class="${"left svelte-rycl45"}"><p class="${"foot svelte-rycl45"}">Last updated 2021</p>
	<p class="${"foot svelte-rycl45"}"><a href="${"mailto:clp@clp.is"}" class="${"svelte-rycl45"}">Email</a> me</p></div>
		<div class="${"right svelte-rycl45"}"><a class="${"nav svelte-rycl45"}" id="${"gl"}" href="${"https://gitlab.com/clpi"}">gitlab</a>
			<a class="${"nav svelte-rycl45"}" id="${"gh"}" href="${"https://github.com/clpi"}">github</a>
			<a class="${"nav svelte-rycl45"}" href="${"https://github.com/clpi"}">twitter</a>
			<a class="${"nav svelte-rycl45"}" href="${"https://github.com/clpi"}">linkedin</a></div>

</footer>`;
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
var css$3 = {
  code: `ul:not(.navbar){margin-left:3.5%;list-style:square;padding-top:2.5%;border-top:1px solid rgba(0,0,0,0.03);border-radius:7px;padding-bottom:2.5%;background-color:rgba(0,0,0,0.01);border:1px solid rgba(0,0,0,0.1);margin-top:25px}ul:not(.navbar):hover{background-color:rgba(0,0,0,0.025);transition:all 0.2s ease-in-out;border:1px solid rgba(0,0,0,0.25)}li:not(.nav){margin-top:4px;margin-bottom:4px}li:not(.nav){padding-left:1%}body{border:2px ridge transparent;background-color:#fffefd;height:100vh;min-height:100vh;margin:0;max-width:100%;overflow-x:hidden;padding:2% 8% 2% 8%;font-weight:300}h1,h2,h3,h4{font-weight:300;font-family:monospace;letter-spacing:-2px;border-left:2px solid rgba(0,0,0,0.00)}h1{font-size:2.4rem;padding-left:32px}h2{font-size:2.0rem;padding-left:28px;color:rgba(0,0,0,0.7)}h3{font-size:1.8rem;padding-left:21px;color:rgba(0,0,0,0.64)}h4{font-size:1.6rem;padding-left:16px;color:rgba(0,0,0,0.6)}h1::before{content:"#";color:rgba(0,0,0,0.25);padding-right:16px}h2::before{content:"##";color:rgba(0,0,0,0.20);padding-right:12px}h3::before{content:"###";color:rgba(0,0,0,0.15);padding-right:10px}h4::before{content:"####";color:rgba(0,0,0,0.10);padding-right:8px}h1:hover::after{color:rgba(0,0,0,0.15);padding-left:8px;font-size:1.2rem;content:"[.]" }h2:hover::after{color:rgba(0,0,0,0.12);padding-left:6px;font-size:1.0rem;content:"[..]" }h3:hover::after{color:rgba(0,0,0,0.09);padding-left:4px;font-size:0.9rem;content:"[...]" }h4:hover::after{color:rgba(0,0,0,0.09);padding-left:4px;font-size:0.7rem;content:"[....]" }h1:hover{color:black;border-left:2px solid rgba(0,0,0,0.15);padding-left:34px;transition:all 0.2s ease-in-out}h2:hover{color:rgba(0,0,0,0.8);border-left:2px solid rgba(0,0,0,0.12);padding-left:30px;transition:all 0.2s ease-in-out}h3:hover{color:rgba(0,0,0,0.74);border-left:2px solid rgba(0,0,0,0.09);padding-left:23px;transition:all 0.2s ease-in-out}h4:hover{color:rgba(0,0,0,0.7);border-left:2px solid rgba(0,0,0,0.06);padding-left:18px;transition:all 0.2s ease-in-out}p{padding-left:32px;font-size:1.1rem}.content.svelte-acfck5{font-size:1.1rem;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-weight:400}#head{padding-bottom:8px;border-left:2px solid rgba(0,0,0,0.00)}#head:hover::after{color:rgba(0,0,0,0.15);padding-left:8px;font-size:1.2rem;content:"[~]" }#head:hover{color:rgba(0,0,0,0.95);border-left:2px solid rgba(0,0,0,0.15);padding-left:37px;transition:all 0.2s ease-in-out}a:not(.nav):hover{transition:all 0.2s;background-color:rgba(0,0,0,0.8);font-weight:500;color:rgba(255,255,255,0.95);border-radius:4px;text-decoration:underline;text-underline-offset:6px}a:not(.nav){color:rgba(130,100,70,0.7);font-family:monospace;font-size:1rem;letter-spacing:-0px;text-decoration:none}p{transition:all 0.2s ease-in-out;border-left:2px solid rgba(0,0,0,0.0)}p:hover:not(.foot){border-left:2px solid rgba(0,0,0,0.1);transition:all 0.2s ease-in-out}.content.svelte-acfck5{padding:12px;height:100%;min-height:45vh;background-color:rgba(0,0,0,0.01);border-left:4px dashed rgba(0,0,0,0.02);border-right:4px dashed rgba(0,0,0,0.02);border-top:4px dotted rgba(0,0,0,0.08);border-bottom:4px dotted rgba(0,0,0,0.08);display:block}`,
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Nav from '../lib/nav.svelte';\\nimport Footer from '../lib/footer.svelte';\\nimport { page, navigating } from '$app/stores';\\nimport GoogleAnalytics from '$lib/google.svelte';\\n$: section = $page.path.split('/')[1];\\n<\/script>\\n\\n<style>\\n:global(ul:not(.navbar)) {\\n\\tmargin-left: 3.5%;\\n\\tlist-style:square;\\n\\tpadding-top: 2.5%;\\n\\tborder-top: 1px solid rgba(0,0,0,0.03);\\n\\tborder-radius: 7px;\\n\\tpadding-bottom: 2.5%;\\n\\tbackground-color: rgba(0,0,0,0.01);\\n\\tborder:1px solid rgba(0,0,0,0.1);\\n\\tmargin-top: 25px;\\n    }\\n:global(ul:not(.navbar):hover) {\\n    background-color: rgba(0,0,0,0.025);\\n    transition: all 0.2s ease-in-out;\\n    border: 1px solid rgba(0,0,0,0.25);\\n}\\n:global(li:not(.nav)) {\\n\\tmargin-top: 4px;\\n\\tmargin-bottom: 4px;\\n    }\\n:global(li:not(.nav):hover) {\\n}\\n    :global(li:not(.nav)) {\\n\\tpadding-left: 1%;\\n\\n\\t}\\n\\t:global(body) {\\n\\t\\tborder: 2px ridge transparent;\\n\\t\\tbackground-color: #fffefd;\\n\\t\\theight: 100vh;\\n\\t\\tmin-height: 100vh;\\n\\t\\tmargin: 0;\\n\\t\\tmax-width: 100%;\\n\\t\\toverflow-x: hidden;\\n\\t\\tpadding: 2% 8% 2% 8%;\\n\\t\\tfont-weight: 300;\\n\\t}\\n\\t:global(h1),:global(h2),:global(h3),:global(h4) {\\n\\n\\t\\tfont-weight: 300;\\n\\t\\tfont-family: monospace;\\n\\t\\tletter-spacing: -2px;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.00);\\n\\t\\t/* border-bottom: 0px solid rgba(0,0,0,0.25); */\\n\\t\\t/* padding: 0px 16px 4px 4px; */\\n\\t}\\n\\t:global(h1) { font-size: 2.4rem; padding-left: 32px;}\\n\\t:global(h2) { font-size: 2.0rem; padding-left: 28px; color: rgba(0,0,0,0.7)}\\n\\t:global(h3) { font-size: 1.8rem; padding-left: 21px; color: rgba(0,0,0,0.64)}\\n\\t:global(h4) { font-size: 1.6rem; padding-left: 16px; color: rgba(0,0,0,0.6)}\\n\\t:global(h1::before) { content: \\"#\\"; color: rgba(0,0,0,0.25); padding-right: 16px; }\\n\\t:global(h2::before) { content: \\"##\\"; color: rgba(0,0,0,0.20); padding-right: 12px; }\\n\\t:global(h3::before) { content: \\"###\\"; color: rgba(0,0,0,0.15); padding-right: 10px; }\\n\\t:global(h4::before) { content: \\"####\\"; color: rgba(0,0,0,0.10); padding-right: 8px; }\\n\\t:global(h1:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: \\"[.]\\" }\\n\\t:global(h2:hover::after) { color: rgba(0,0,0,0.12); padding-left: 6px; font-size: 1.0rem; content: \\"[..]\\" }\\n\\t:global(h3:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.9rem; content: \\"[...]\\" }\\n\\t:global(h4:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.7rem; content: \\"[....]\\" }\\n\\t:global(h1:hover) { color: black;border-left: 2px solid rgba(0,0,0,0.15); padding-left: 34px; transition: all 0.2s ease-in-out}\\n\\t:global(h2:hover) { color:rgba(0,0,0,0.8);border-left: 2px solid rgba(0,0,0,0.12); padding-left: 30px; transition: all 0.2s ease-in-out}\\n\\t:global(h3:hover) { color:rgba(0,0,0,0.74);border-left: 2px solid rgba(0,0,0,0.09); padding-left: 23px; transition: all 0.2s ease-in-out}\\n\\t:global(h4:hover) { color:rgba(0,0,0,0.7);border-left: 2px solid rgba(0,0,0,0.06); padding-left: 18px; transition: all 0.2s ease-in-out}\\n\\t:global(p) {\\n\\t\\tpadding-left: 32px;\\n\\t\\tfont-size: 1.1rem;\\n\\t}\\n\\t.content {\\n\\t\\tfont-size: 1.1rem;\\n\\t\\tfont-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\\n\\t\\tfont-weight: 400;\\n\\t\\t}\\n\\t:global(#head) {\\n\\t\\tpadding-bottom: 8px;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.00);\\n\\t}\\n\\t:global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: \\"[~]\\" }\\n\\t:global(#head:hover) {\\n\\t\\tcolor: rgba(0,0,0,0.95);\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.15);\\n\\t\\tpadding-left: 37px;\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\n\\t}\\n\\t:global(a:not(.nav):hover) {\\n\\t\\ttransition: all 0.2s;\\n\\t\\tbackground-color: rgba(0,0,0,0.8);\\n\\t\\tfont-weight: 500;\\n\\t\\tcolor: rgba(255,255,255,0.95);\\n\\t\\tborder-radius: 4px;\\n\\t\\ttext-decoration: underline;\\n\\t\\ttext-underline-offset: 6px;\\n\\t}\\n\\t:global(a:not(.nav)) {\\n\\t\\tcolor: rgba(130,100,70,0.7);\\n\\t\\tfont-family: monospace;\\n\\t\\tfont-size:1rem;\\n\\t\\tletter-spacing:-0px;\\n\\t\\ttext-decoration:none;\\n\\t}\\n\\t/* :global(a:not(.nav):hover::before){\\n\\t\\tcontent: \\"[\\"\\n\\t}\\n\\t:global(a:not(.nav):hover::after){\\n\\t\\tcontent: \\"]\\"\\n\\t} */\\n\\t:global(p) {\\n\\t\\ttransition: all 0.2s ease-in-out;\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.0);\\n\\t}\\n\\t:global(p:hover:not(.foot)) {\\n\\t\\tborder-left: 2px solid rgba(0,0,0,0.1);\\n\\t\\ttransition: all 0.2s ease-in-out;}\\n\\t/* :global(p::before) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-right: 4px;\\n\\t}\\n\\t:global(p:hover::before),:global(p:hover::after) {\\n\\t\\tcolor: rgba(0,0,0,0.1);\\n\\t}\\n\\t:global(p::after) {\\n\\t\\tcolor: rgba(0,0,0,0.0);\\n\\t\\tcontent: \\"--\\";\\n\\t\\tpadding-left: 4px;\\n\\t} */\\n\\n.content {\\n\\tpadding: 12px;\\n\\theight: 100%;\\n\\tmin-height: 45vh;\\n\\tbackground-color: rgba(0,0,0,0.01);\\n\\tborder-left: 4px dashed rgba(0,0,0,0.02);\\n\\tborder-right: 4px dashed rgba(0,0,0,0.02);\\n\\t\\tborder-top: 4px dotted rgba(0,0,0,0.08);\\n\\t\\tborder-bottom: 4px dotted rgba(0,0,0,0.08);\\n\\tdisplay:block;\\n}\\n</style>\\n\\n<GoogleAnalytics/>\\n<div>\\n\\t<Nav/>\\n\\t<div class=\\"content\\">\\n\\t\\t<slot></slot>\\n\\t</div>\\n\\t<Footer/>\\n</div>\\n"],"names":[],"mappings":"AAQQ,eAAe,AAAE,CAAC,AACzB,WAAW,CAAE,IAAI,CACjB,WAAW,MAAM,CACjB,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACtC,aAAa,CAAE,GAAG,CAClB,cAAc,CAAE,IAAI,CACpB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,OAAO,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAChC,UAAU,CAAE,IAAI,AACb,CAAC,AACG,qBAAqB,AAAE,CAAC,AAC5B,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CACnC,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAChC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACtC,CAAC,AACO,YAAY,AAAE,CAAC,AACtB,UAAU,CAAE,GAAG,CACf,aAAa,CAAE,GAAG,AACf,CAAC,AAGO,YAAY,AAAE,CAAC,AAC1B,YAAY,CAAE,EAAE,AAEhB,CAAC,AACO,IAAI,AAAE,CAAC,AACd,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,CAC7B,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,KAAK,CACb,UAAU,CAAE,KAAK,CACjB,MAAM,CAAE,CAAC,CACT,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,EAAE,CACpB,WAAW,CAAE,GAAG,AACjB,CAAC,AACO,EAAE,AAAC,CAAC,AAAQ,EAAE,AAAC,CAAC,AAAQ,EAAE,AAAC,CAAC,AAAQ,EAAE,AAAE,CAAC,AAEhD,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,SAAS,CACtB,cAAc,CAAE,IAAI,CACpB,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAGxC,CAAC,AACO,EAAE,AAAE,CAAC,AAAC,SAAS,CAAE,MAAM,CAAE,YAAY,CAAE,IAAI,AAAC,CAAC,AAC7C,EAAE,AAAE,CAAC,AAAC,SAAS,CAAE,MAAM,CAAE,YAAY,CAAE,IAAI,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,AACpE,EAAE,AAAE,CAAC,AAAC,SAAS,CAAE,MAAM,CAAE,YAAY,CAAE,IAAI,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,AACrE,EAAE,AAAE,CAAC,AAAC,SAAS,CAAE,MAAM,CAAE,YAAY,CAAE,IAAI,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,AACpE,UAAU,AAAE,CAAC,AAAC,OAAO,CAAE,GAAG,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,aAAa,CAAE,IAAI,AAAE,CAAC,AAC3E,UAAU,AAAE,CAAC,AAAC,OAAO,CAAE,IAAI,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,aAAa,CAAE,IAAI,AAAE,CAAC,AAC5E,UAAU,AAAE,CAAC,AAAC,OAAO,CAAE,KAAK,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,aAAa,CAAE,IAAI,AAAE,CAAC,AAC7E,UAAU,AAAE,CAAC,AAAC,OAAO,CAAE,MAAM,CAAE,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,aAAa,CAAE,GAAG,AAAE,CAAC,AAC7E,eAAe,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,GAAG,CAAE,SAAS,CAAE,MAAM,CAAE,OAAO,CAAE,KAAK,CAAC,CAAC,AAClG,eAAe,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,GAAG,CAAE,SAAS,CAAE,MAAM,CAAE,OAAO,CAAE,MAAM,CAAC,CAAC,AACnG,eAAe,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,GAAG,CAAE,SAAS,CAAE,MAAM,CAAE,OAAO,CAAE,OAAO,CAAC,CAAC,AACpG,eAAe,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,GAAG,CAAE,SAAS,CAAE,MAAM,CAAE,OAAO,CAAE,QAAQ,CAAC,CAAC,AACrG,QAAQ,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,IAAI,CAAE,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,AACvH,QAAQ,AAAE,CAAC,AAAC,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,IAAI,CAAE,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,AAChI,QAAQ,AAAE,CAAC,AAAC,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,IAAI,CAAE,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,AACjI,QAAQ,AAAE,CAAC,AAAC,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,IAAI,CAAE,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,AAChI,CAAC,AAAE,CAAC,AACX,YAAY,CAAE,IAAI,CAClB,SAAS,CAAE,MAAM,AAClB,CAAC,AACD,QAAQ,cAAC,CAAC,AACT,SAAS,CAAE,MAAM,CACjB,YAAY,aAAa,CAAC,CAAC,kBAAkB,CAAC,CAAC,UAAU,CAAC,CAAC,MAAM,CAAC,CAAC,MAAM,CAAC,CAAC,MAAM,CAAC,CAAC,SAAS,CAAC,CAAC,WAAW,CAAC,CAAC,gBAAgB,CAAC,CAAC,UAAU,CACvI,WAAW,CAAE,GAAG,AAChB,CAAC,AACM,KAAK,AAAE,CAAC,AACf,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AACxC,CAAC,AACO,kBAAkB,AAAE,CAAC,AAAC,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAE,YAAY,CAAE,GAAG,CAAE,SAAS,CAAE,MAAM,CAAE,OAAO,CAAE,KAAK,CAAC,CAAC,AACrG,WAAW,AAAE,CAAC,AACrB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvB,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvC,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,AAEjC,CAAC,AACO,iBAAiB,AAAE,CAAC,AAC3B,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACjC,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,CAC7B,aAAa,CAAE,GAAG,CAClB,eAAe,CAAE,SAAS,CAC1B,qBAAqB,CAAE,GAAG,AAC3B,CAAC,AACO,WAAW,AAAE,CAAC,AACrB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,CAAC,CAC3B,WAAW,CAAE,SAAS,CACtB,UAAU,IAAI,CACd,eAAe,IAAI,CACnB,gBAAgB,IAAI,AACrB,CAAC,AAOO,CAAC,AAAE,CAAC,AACX,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAChC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AACvC,CAAC,AACO,kBAAkB,AAAE,CAAC,AAC5B,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtC,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,AAAC,CAAC,AAepC,QAAQ,cAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,CAChB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAClC,WAAW,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxC,YAAY,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxC,UAAU,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACvC,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC3C,QAAQ,KAAK,AACd,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$3);
  $page.path.split("/")[1];
  $$unsubscribe_page();
  return `${validate_component(Google, "GoogleAnalytics").$$render($$result, {}, {}, {})}
<div>${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}
	<div class="${"content svelte-acfck5"}">${slots.default ? slots.default({}) : ``}</div>
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
var css$2 = {
  code: '.date.svelte-1hz8ugo{color:rgba(0,0,0,0.3);font-family:monospace;font-size:1rem;letter-spacing:-1px;padding-right:4px}.date.svelte-1hz8ugo::before{content:"["}.date.svelte-1hz8ugo::after{content:"]"}',
  map: '{"version":3,"file":"date.svelte","sources":["date.svelte"],"sourcesContent":["<script>\\nlet dt = Date.now().toLocaleString();\\nexport let date = dt;\\n\\n\\n<\/script>\\n<style>\\n\\n.date {\\n\\tcolor: rgba(0,0,0,0.3);\\n\\tfont-family:monospace;\\n\\tfont-size: 1rem;\\n\\tletter-spacing:-1px;\\n\\tpadding-right: 4px;\\n}\\n.date::before { content: \\"[\\"; }\\n.date::after { content: \\"]\\"; }\\n</style>\\n\\n<span class=\\"date\\">{ date }</span>\\n"],"names":[],"mappings":"AAQA,KAAK,eAAC,CAAC,AACN,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,YAAY,SAAS,CACrB,SAAS,CAAE,IAAI,CACf,eAAe,IAAI,CACnB,aAAa,CAAE,GAAG,AACnB,CAAC,AACD,oBAAK,QAAQ,AAAC,CAAC,AAAC,OAAO,CAAE,GAAG,AAAE,CAAC,AAC/B,oBAAK,OAAO,AAAC,CAAC,AAAC,OAAO,CAAE,GAAG,AAAE,CAAC"}'
};
var Date_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let dt = Date.now().toLocaleString();
  let { date = dt } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  $$result.css.add(css$2);
  return `<span class="${"date svelte-1hz8ugo"}">${escape2(date)}</span>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>home \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">index</h1>

<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/14/21" }, {}, {})} welcome to clp.is. feel free to check out my <a href="${"https://github.com/clpi"}">github</a>/<a href="${"https://gitlab.com/clpi"}">gitlab</a> for any projects i might be working on. for now site is under construction! to reach me, email me <a href="${"mailto:clp@clp.is"}">here</a>. thanks!</p>`;
});
var index$8 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Resources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Resources
});
var css$1 = {
  code: 'li.svelte-1d22zl5 a.svelte-1d22zl5{text-decoration:underline;text-underline-offset:6px}.ext.svelte-1d22zl5.svelte-1d22zl5{font-size:1rem}li.svelte-1d22zl5 a.svelte-1d22zl5:hover{background-color:rgba(0,0,0,0.8);font-weight:500;color:rgba(255,255,255,0.95);border-radius:4px}.ext.svelte-1d22zl5.svelte-1d22zl5::after{content:"[->]";font-size:0.8rem;vertical-align:super}.ext.svelte-1d22zl5.svelte-1d22zl5:hover::after{content:"[->]";transform:scale(1.4);transition:all 0.15s ease-in-out;vertical-align:super}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["\\n<svelte:head>\\n\\t<title>projects \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script>\\nimport  Date  from '$lib/date.svelte'\\n<\/script>\\n<style>\\n\\nli a  {\\n\\ttext-decoration: underline;\\n\\ttext-underline-offset: 6px;\\n    }\\n    .ext {\\n\\t    font-size: 1rem;\\n\\t}\\n\\tli a:hover {\\n\\t\\tbackground-color: rgba(0,0,0,0.8);\\n\\t\\tfont-weight: 500;\\n\\t\\tcolor: rgba(255,255,255,0.95);\\n\\t\\tborder-radius: 4px;\\n\\t    }\\n.ext::after {\\n\\tcontent: \\"[->]\\";\\n\\tfont-size: 0.8rem;\\n\\tvertical-align:super;\\n    }\\n.ext:hover::after {\\n\\tcontent: \\"[->]\\";\\n\\ttransform: scale(1.4);\\n\\ttransition: all 0.15s ease-in-out;\\n\\tvertical-align:super;\\n    }\\n</style>\\n<h1 id=\\"head\\">projects</h1>\\n<p>Last updated <Date date = \\"07/29/21\\"/>. Not a comprehensive list</p>\\n<ul>\\n<li><a href=\\"/projects/recollection\\">recollection</a>  <a class=\\"ext\\" href=\\"https://github.com/clpi/recollection\\"> (github)</a>: implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.</li>\\n</ul>\\n<p></p>\\n\\n\\n"],"names":[],"mappings":"AAUA,iBAAE,CAAC,CAAC,eAAE,CAAC,AACN,eAAe,CAAE,SAAS,CAC1B,qBAAqB,CAAE,GAAG,AACvB,CAAC,AACD,IAAI,8BAAC,CAAC,AACL,SAAS,CAAE,IAAI,AACnB,CAAC,AACD,iBAAE,CAAC,gBAAC,MAAM,AAAC,CAAC,AACX,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACjC,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,CAC7B,aAAa,CAAE,GAAG,AACf,CAAC,AACN,kCAAI,OAAO,AAAC,CAAC,AACZ,OAAO,CAAE,MAAM,CACf,SAAS,CAAE,MAAM,CACjB,eAAe,KAAK,AACjB,CAAC,AACL,kCAAI,MAAM,OAAO,AAAC,CAAC,AAClB,OAAO,CAAE,MAAM,CACf,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,CACjC,eAAe,KAAK,AACjB,CAAC"}`
};
var Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `${$$result.head += `${$$result.title = `<title>projects \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">projects</h1>
<p>Last updated ${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})}. Not a comprehensive list</p>
<ul><li class="${"svelte-1d22zl5"}"><a href="${"/projects/recollection"}" class="${"svelte-1d22zl5"}">recollection</a>  <a class="${"ext svelte-1d22zl5"}" href="${"https://github.com/clpi/recollection"}">(github)</a>: implementations and reimplementations of common data structures &amp; algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.</li></ul>
<p></p>`;
});
var index$6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Projects
});
var css = {
  code: ".p.svelte-1r57hxx{color:rgba(0,0,0,0.55)}.p.svelte-1r57hxx:hover{color:rgba(0,0,0,0.8);padding-left:8px;transition:all 0.2s ease-in-out}",
  map: `{"version":3,"file":"recollection.svelte","sources":["recollection.svelte"],"sourcesContent":["<svelte:head>\\n\\t<title>p/recollection \u2022 clp.is</title>\\n</svelte:head>\\n\\n<script context=\\"module\\">\\nexport const hydrate = false;\\nexport const prerender = true;\\n<\/script>\\n<script>\\nimport Date from '$lib/date.svelte'\\n<\/script>\\n<style>\\n.p {\\n\\tcolor: rgba(0,0,0,0.55);\\n\\n    }\\n    .p:hover{\\n\\t    color: rgba(0,0,0,0.8);\\n\\t    padding-left: 8px;\\n\\t    transition: all 0.2s ease-in-out;\\n\\t}\\n</style>\\n\\n\\n<h1 id=\\"head\\">projects<small class=\\"p\\"> &nbsp;\u2022 recollections </small></h1>\\n<p><Date date=\\"07/29/21\\"/> implementations of common data structures & algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>\\n<p>...</p>\\n<h3>further info</h3>\\n<ul>\\n<li><a href=\\"https://crates.io/crate/recollection\\">crates.io</a></li>\\n<li><a href=\\"https://lib.rs/crate/recollection\\">lib.rs</a></li>\\n<li><a href=\\"https://github.com/clpi/recollection\\">github</a></li>\\n<li><a href=\\"https://docs.rs/recollection\\">docs.rs</a> for documentation</li>\\n</ul>\\n\\n"],"names":[],"mappings":"AAYA,EAAE,eAAC,CAAC,AACH,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAEpB,CAAC,AACD,iBAAE,MAAM,CAAC,AACR,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtB,YAAY,CAAE,GAAG,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,AACpC,CAAC"}`
};
var hydrate$4 = false;
var prerender$4 = true;
var Recollection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>p/recollection \u2022 clp.is</title>`, ""}`, ""}






<h1 id="${"head"}">projects<small class="${"p svelte-1r57hxx"}">\xA0\u2022 recollections </small></h1>
<p>${validate_component(Date_1, "Date").$$render($$result, { date: "07/29/21" }, {}, {})} implementations of common data structures &amp; algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>
<p>...</p>
<h3>further info</h3>
<ul><li><a href="${"https://crates.io/crate/recollection"}">crates.io</a></li>
<li><a href="${"https://lib.rs/crate/recollection"}">lib.rs</a></li>
<li><a href="${"https://github.com/clpi/recollection"}">github</a></li>
<li><a href="${"https://docs.rs/recollection"}">docs.rs</a> for documentation</li></ul>`;
});
var recollection = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Recollection,
  hydrate: hydrate$4,
  prerender: prerender$4
});
var hydrate$3 = false;
var prerender$3 = true;
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>[about] \u2022 clp.is</title>`, ""}`, ""}

<h1 id="${"head"}">about</h1>
<p>Hi! I&#39;m Chris P</p>`;
});
var index$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About,
  hydrate: hydrate$3,
  prerender: prerender$3
});
var hydrate$2 = false;
var prerender$2 = true;
var Links = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>links \u2022 clp.is</title>`, ""}`, ""}
<h1 id="${"head"}">links</h1>`;
});
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Links,
  hydrate: hydrate$2,
  prerender: prerender$2
});
var hydrate$1 = false;
var prerender$1 = true;
var Posts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>posts \u2022 clp.is</title>`, ""}`, ""}


<h1 id="${"head"}">posts</h1>
<p>this is where posts will be</p>

<h2>list</h2>`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Posts,
  hydrate: hydrate$1,
  prerender: prerender$1
});
var U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D
});
var Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index$2 = /* @__PURE__ */ Object.freeze({
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
var Uses = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>/uses \u2022 clp.is</title>`, ""}`, ""}

<h1>what I use for dev stuff</h1>`;
});
var uses = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Uses
});
var hydrate = false;
var prerender = true;
var Etc = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>etc \u2022 clp.is</title>`, ""}`, ""}



<h1 id="${"head"}">etc</h1>
<p><span class="${"date"}">07/18/21</span> Any other links or resources</p>
<ul><li><a href="${"#"}">wasm</a>:  \xA0\xA0Web assembly experiments</li>
	<li><a href="${"#"}">svelte</a>:  \xA0\xA0Svelte/svelte kit experiments</li></ul>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Etc,
  hydrate,
  prerender
});
var Lab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>lab</h1>
<ul><li><a href="${"/wasm"}">wasm</a>:  \xA0\xA0Web assembly experiments</li>
	<li><a href="${"/wasm"}">svelte</a>:  \xA0\xA0Svelte/svelte kit experiments</li></ul>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Lab
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
