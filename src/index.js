'use strict';

class Bitfield {

  constructor(bits) {
    this.bitfield = this.constructor.resolve(bits);
  }

  any(bit) {
    return (this.bitfield & this.constructor.resolve(bit)) !== 0;
  }

  equals(bit) {
    return this.bitfield === this.constructor.resolve(bit);
  }

  has(bit) {
    if (Array.isArray(bit)) return bit.every(p => this.has(p));
    bit = this.constructor.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  missing(bits, ...params) {
    if (!Array.isArray(bits)) bits = new this.constructor(bits).toArray(false);
    return bits.filter(p => !this.has(p, ...params));
  }

  freeze() {
    return Object.freeze(this);
  }

  add(...bits) {
    let total = 0;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  remove(...bits) {
    let total = 0;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  serialize(...params) {
    const serialized = {};
    for (const [flag, bit] of Object.entries(this.constructor.FLAGS)) serialized[flag] = this.has(bit, ...params);
    return serialized;
  }

  toArray(...params) {
    return Object.keys(this.constructor.FLAGS).filter(bit => this.has(bit, ...params));
  }

  toJSON() {
    return this.bitfield;
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }

  static resolve(bit = 0) {
    if (typeof bit === 'number' && bit >= 0) return bit;
    if (bit instanceof Bitfield) return bit.bitfield;
    if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    if (typeof bit === 'string' && typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit];
    throw new Error('BITFIELD_INVALID');
  }
}

/**
 * Numeric bitfield flags.
 * <info>Defined in extension classes</info>
 * @type {Object}
 * @abstract
 */
Bitfield.FLAGS = {};

module.exports = Bitfield;