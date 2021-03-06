/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import Receptacle from 'receptacle';
/* eslint-enable */
import logger from './logger';

class Cache {
  constructor() {
    this.receptacle = new Receptacle({ max: Cache.MAX_ITEMS });
  }
  getKey(platform, url) { return `${platform}-${url}`; }
  setPage(platform, url, head, body, hash) {
    const key = this.getKey(platform, url);
    logger.debug('cache page:', key);
    this.receptacle.set(key, { type: 200, head, body, hash }, Cache.DEFAULT_TTL);
  }
  setRedirect(url, location) {
    logger.debug('cache redirect:', url);
    this.receptacle.set(url, { type: 301, location }, Cache.DEFAULT_TTL);
  }
  setNotFound(url) {
    logger.debug('cache notfound:', url);
    this.receptacle.set(url, { type: 404 }, Cache.DEFAULT_TTL);
  }
  has(platform, url) {
    if (this.receptacle.has(this.getKey(platform, url))) {
      return true;
    }
    return this.receptacle.has(url);
  }
  get(platform, url) {
    const res = this.receptacle.get(this.getKey(platform, url));
    if (res) {
      return res;
    }
    return this.receptacle.get(url);
  }
  reset() {
    logger.debug('cache reset');
    this.receptacle.clear();
  }
}
// 1k pages are cached
// eslint-disable-next-line no-restricted-properties
Cache.MAX_ITEMS = Math.pow(2, 10);
// TTL set to 1day
Cache.DEFAULT_TTL = { ttl: 1000 * 60 * 60 * 24 };
const cache = new Cache();
export default cache;
