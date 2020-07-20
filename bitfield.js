'use strict';

class Bitfield {

  constructor(bits) {
    this.field = this.constructor.resolve(bits);
  }

  is (flag, bool) {
    return this.get(flag) === bool;
  }

  has (flag) {
    return this.get(flag);
  }

  get (flag) {
      return (this.field & flag) > 0;
  }

  set (flag, bool = true) {
      bool ? this.field = this.field | flag : this.field &= ~flag; 
      return this.get(flag);
  }

  toJSON() {  
    return this.field;
  }

  valueOf() {
    return this.field;
  }

  static resolve(bit = 0) {
    if (typeof bit === 'number' && bit >= 0) return bit;
    if (bit instanceof Bitfield) return bit.field;
    if (typeof bit === 'string' && typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit];

    throw new Error('BITFIELD_INVALID');
  }
}


Bitfield.FLAGS = {};

module.exports = Bitfield;