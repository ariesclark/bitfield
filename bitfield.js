'use strict';

class Bitfield {

  constructor(bits, flags = {}) {
    this.field = this.resolve(bits);
    this.flags = {};
    
    Object.keys(flags).forEach(key => {
      if (typeof flag[key] === "number") {
        this.flags[key.toUpperCase()] = flags[key];
      }
    });
  }

  is (flag, bool) {
    return this.get(flag) === bool;
  }

  has (flag) {
    return this.get(flag);
  }

  get (flag) {
    flag = this.resolve(flag);
    return (this.field & flag) > 0;
  }

  toggle (flag) {
    this.set(flag, !this.get(flag));
    return this;
  }

  unset (flag) {
    this.set(flag, false);
    return this;
  }

  set (flag, bool = true) {
    flag = this.resolve(flag);

    bool ? this.field = this.field | flag : this.field &= ~flag; 
    return this;
  }

  toJSON() {  
    return this.field;
  }

  valueOf() {
    return this.field;
  }

  resolve(bit = 0) {
    if (typeof bit === 'number' && bit >= 0) return bit;
    if (bit instanceof Bitfield) return bit.field;

    if (typeof bit === "string") {
      bit = bit.toUpperCase();
      if (typeof this.flags[bit] !== "undefined") {
        return this.flags[bit];
      }
    }

    throw new Error('invalid bitfield');
  }
}

//Bitfield.FLAGS = {};

module.exports = Bitfield;