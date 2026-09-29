/* Pako inflate - (The MIT License)

Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).pako=e()}}(function(){return function r(o,s,f){function l(t,e){if(!s[t]){if(!o[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(d)return d(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var a=s[t]={exports:{}};o[t][0].call(a.exports,function(e){return l(o[t][1][e]||e)},a,a.exports,r,o,s,f)}return s[t].exports}for(var d="function"==typeof require&&require,e=0;e<f.length;e++)l(f[e]);return l}({1:[function(e,t,i){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;i.assign=function(e){for(var t,i,n=Array.prototype.slice.call(arguments,1);n.length;){var a=n.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var r in a)t=a,i=r,Object.prototype.hasOwnProperty.call(t,i)&&(e[r]=a[r])}}return e},i.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,i,n,a){if(t.subarray&&e.subarray)e.set(t.subarray(i,i+n),a);else for(var r=0;r<n;r++)e[a+r]=t[i+r]},flattenChunks:function(e){var t,i,n,a,r,o;for(t=n=0,i=e.length;t<i;t++)n+=e[t].length;for(o=new Uint8Array(n),t=a=0,i=e.length;t<i;t++)r=e[t],o.set(r,a),a+=r.length;return o}},r={arraySet:function(e,t,i,n,a){for(var r=0;r<n;r++)e[a+r]=t[i+r]},flattenChunks:function(e){return[].concat.apply([],e)}};i.setTyped=function(e){e?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,a)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,r))},i.setTyped(n)},{}],2:[function(e,t,i){"use strict";var f=e("./common"),a=!0,r=!0;try{String.fromCharCode.apply(null,[0])}catch(e){a=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){r=!1}for(var l=new f.Buf8(256),n=0;n<256;n++)l[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function d(e,t){if(t<65534&&(e.subarray&&r||!e.subarray&&a))return String.fromCharCode.apply(null,f.shrinkBuf(e,t));for(var i="",n=0;n<t;n++)i+=String.fromCharCode(e[n]);return i}l[254]=l[254]=1,i.string2buf=function(e){var t,i,n,a,r,o=e.length,s=0;for(a=0;a<o;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),s+=i<128?1:i<2048?2:i<65536?3:4;for(t=new f.Buf8(s),a=r=0;r<s;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),i<128?t[r++]=i:(i<2048?t[r++]=192|i>>>6:(i<65536?t[r++]=224|i>>>12:(t[r++]=240|i>>>18,t[r++]=128|i>>>12&63),t[r++]=128|i>>>6&63),t[r++]=128|63&i);return t},i.buf2binstring=function(e){return d(e,e.length)},i.binstring2buf=function(e){for(var t=new f.Buf8(e.length),i=0,n=t.length;i<n;i++)t[i]=e.charCodeAt(i);return t},i.buf2string=function(e,t){var i,n,a,r,o=t||e.length,s=new Array(2*o);for(i=n=0;i<o;)if((a=e[i++])<128)s[n++]=a;else if(4<(r=l[a]))s[n++]=65533,i+=r-1;else{for(a&=2===r?31:3===r?15:7;1<r&&i<o;)a=a<<6|63&e[i++],r--;1<r?s[n++]=65533:a<65536?s[n++]=a:(a-=65536,s[n++]=55296|a>>10&1023,s[n++]=56320|1023&a)}return d(s,n)},i.utf8border=function(e,t){var i;for((t=t||e.length)>e.length&&(t=e.length),i=t-1;0<=i&&128==(192&e[i]);)i--;return i<0?t:0===i?t:i+l[e[i]]>t?i:t}},{"./common":1}],3:[function(e,t,i){"use strict";t.exports=function(e,t,i,n){for(var a=65535&e|0,r=e>>>16&65535|0,o=0;0!==i;){for(i-=o=2e3<i?2e3:i;r=r+(a=a+t[n++]|0)|0,--o;);a%=65521,r%=65521}return a|r<<16|0}},{}],4:[function(e,t,i){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],5:[function(e,t,i){"use strict";var s=function(){for(var e,t=[],i=0;i<256;i++){e=i;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e}return t}();t.exports=function(e,t,i,n){var a=s,r=n+i;e^=-1;for(var o=n;o<r;o++)e=e>>>8^a[255&(e^t[o])];return-1^e}},{}],6:[function(e,t,i){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],7:[function(e,t,i){"use strict";t.exports=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z;i=e.state,n=e.next_in,E=e.input,a=n+(e.avail_in-5),r=e.next_out,Z=e.output,o=r-(t-e.avail_out),s=r+(e.avail_out-257),f=i.dmax,l=i.wsize,d=i.whave,c=i.wnext,u=i.window,h=i.hold,b=i.bits,m=i.lencode,w=i.distcode,k=(1<<i.lenbits)-1,_=(1<<i.distbits)-1;e:do{b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=m[h&k];t:for(;;){if(h>>>=v=g>>>24,b-=v,0===(v=g>>>16&255))Z[r++]=65535&g;else{if(!(16&v)){if(0==(64&v)){g=m[(65535&g)+(h&(1<<v)-1)];continue t}if(32&v){i.mode=12;break e}e.msg="invalid literal/length code",i.mode=30;break e}p=65535&g,(v&=15)&&(b<v&&(h+=E[n++]<<b,b+=8),p+=h&(1<<v)-1,h>>>=v,b-=v),b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=w[h&_];i:for(;;){if(h>>>=v=g>>>24,b-=v,!(16&(v=g>>>16&255))){if(0==(64&v)){g=w[(65535&g)+(h&(1<<v)-1)];continue i}e.msg="invalid distance code",i.mode=30;break e}if(x=65535&g,b<(v&=15)&&(h+=E[n++]<<b,(b+=8)<v&&(h+=E[n++]<<b,b+=8)),f<(x+=h&(1<<v)-1)){e.msg="invalid distance too far back",i.mode=30;break e}if(h>>>=v,b-=v,(v=r-o)<x){if(d<(v=x-v)&&i.sane){e.msg="invalid distance too far back",i.mode=30;break e}if(S=u,(y=0)===c){if(y+=l-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z}}else if(c<v){if(y+=l+c-v,(v-=c)<p){for(p-=v;Z[r++]=u[y++],--v;);if(y=0,c<p){for(p-=v=c;Z[r++]=u[y++],--v;);y=r-x,S=Z}}}else if(y+=c-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z}for(;2<p;)Z[r++]=S[y++],Z[r++]=S[y++],Z[r++]=S[y++],p-=3;p&&(Z[r++]=S[y++],1<p&&(Z[r++]=S[y++]))}else{for(y=r-x;Z[r++]=Z[y++],Z[r++]=Z[y++],Z[r++]=Z[y++],2<(p-=3););p&&(Z[r++]=Z[y++],1<p&&(Z[r++]=Z[y++]))}break}}break}}while(n<a&&r<s);n-=p=b>>3,h&=(1<<(b-=p<<3))-1,e.next_in=n,e.next_out=r,e.avail_in=n<a?a-n+5:5-(n-a),e.avail_out=r<s?s-r+257:257-(r-s),i.hold=h,i.bits=b}},{}],8:[function(e,t,i){"use strict";var z=e("../utils/common"),R=e("./adler32"),N=e("./crc32"),O=e("./inffast"),C=e("./inftrees"),I=1,D=2,T=0,U=-2,F=1,n=852,a=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function r(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new z.Buf16(320),this.work=new z.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function o(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=F,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new z.Buf32(n),t.distcode=t.distdyn=new z.Buf32(a),t.sane=1,t.back=-1,T):U}function s(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,o(e)):U}function f(e,t){var i,n;return e&&e.state?(n=e.state,t<0?(i=0,t=-t):(i=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=i,n.wbits=t,s(e))):U}function l(e,t){var i,n;return e?(n=new r,(e.state=n).window=null,(i=f(e,t))!==T&&(e.state=null),i):U}var d,c,u=!0;function H(e){if(u){var t;for(d=new z.Buf32(512),c=new z.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(C(I,e.lens,0,288,d,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;C(D,e.lens,0,32,c,0,e.work,{bits:5}),u=!1}e.lencode=d,e.lenbits=9,e.distcode=c,e.distbits=5}function j(e,t,i,n){var a,r=e.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new z.Buf8(r.wsize)),n>=r.wsize?(z.arraySet(r.window,t,i-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(n<(a=r.wsize-r.wnext)&&(a=n),z.arraySet(r.window,t,i-n,a,r.wnext),(n-=a)?(z.arraySet(r.window,t,i-n,n,0),r.wnext=n,r.whave=r.wsize):(r.wnext+=a,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=a))),0}i.inflateReset=s,i.inflateReset2=f,i.inflateResetKeep=o,i.inflateInit=function(e){return l(e,15)},i.inflateInit2=l,i.inflate=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z=0,B=new z.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(i=e.state).mode&&(i.mode=13),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,c=s,u=f,y=T;e:for(;;)switch(i.mode){case F:if(0===i.wrap){i.mode=13;break}for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(2&i.wrap&&35615===l){B[i.check=0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0),d=l=0,i.mode=2;break}if(i.flags=0,i.head&&(i.head.done=!1),!(1&i.wrap)||(((255&l)<<8)+(l>>8))%31){e.msg="incorrect header check",i.mode=30;break}if(8!=(15&l)){e.msg="unknown compression method",i.mode=30;break}if(d-=4,x=8+(15&(l>>>=4)),0===i.wbits)i.wbits=x;else if(x>i.wbits){e.msg="invalid window size",i.mode=30;break}i.dmax=1<<x,e.adler=i.check=1,i.mode=512&l?10:12,d=l=0;break;case 2:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(i.flags=l,8!=(255&i.flags)){e.msg="unknown compression method",i.mode=30;break}if(57344&i.flags){e.msg="unknown header flags set",i.mode=30;break}i.head&&(i.head.text=l>>8&1),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=3;case 3:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.head&&(i.head.time=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,B[2]=l>>>16&255,B[3]=l>>>24&255,i.check=N(i.check,B,4,0)),d=l=0,i.mode=4;case 4:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.head&&(i.head.xflags=255&l,i.head.os=l>>8),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=5;case 5:if(1024&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.length=l,i.head&&(i.head.extra_len=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0}else i.head&&(i.head.extra=null);i.mode=6;case 6:if(1024&i.flags&&(s<(h=i.length)&&(h=s),h&&(i.head&&(x=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),z.arraySet(i.head.extra,n,r,h,x)),512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,i.length-=h),i.length))break e;i.length=0,i.mode=7;case 7:if(2048&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.name+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=8;case 8:if(4096&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.comment+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.comment=null);i.mode=9;case 9:if(512&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(l!==(65535&i.check)){e.msg="header crc mismatch",i.mode=30;break}d=l=0}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),e.adler=i.check=0,i.mode=12;break;case 10:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}e.adler=i.check=L(l),d=l=0,i.mode=11;case 11:if(0===i.havedict)return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,2;e.adler=i.check=1,i.mode=12;case 12:if(5===t||6===t)break e;case 13:if(i.last){l>>>=7&d,d-=7&d,i.mode=27;break}for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}switch(i.last=1&l,d-=1,3&(l>>>=1)){case 0:i.mode=14;break;case 1:if(H(i),i.mode=20,6!==t)break;l>>>=2,d-=2;break e;case 2:i.mode=17;break;case 3:e.msg="invalid block type",i.mode=30}l>>>=2,d-=2;break;case 14:for(l>>>=7&d,d-=7&d;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if((65535&l)!=(l>>>16^65535)){e.msg="invalid stored block lengths",i.mode=30;break}if(i.length=65535&l,d=l=0,i.mode=15,6===t)break e;case 15:i.mode=16;case 16:if(h=i.length){if(s<h&&(h=s),f<h&&(h=f),0===h)break e;z.arraySet(a,n,r,h,o),s-=h,r+=h,f-=h,o+=h,i.length-=h;break}i.mode=12;break;case 17:for(;d<14;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(i.nlen=257+(31&l),l>>>=5,d-=5,i.ndist=1+(31&l),l>>>=5,d-=5,i.ncode=4+(15&l),l>>>=4,d-=4,286<i.nlen||30<i.ndist){e.msg="too many length or distance symbols",i.mode=30;break}i.have=0,i.mode=18;case 18:for(;i.have<i.ncode;){for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.lens[A[i.have++]]=7&l,l>>>=3,d-=3}for(;i.have<19;)i.lens[A[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,S={bits:i.lenbits},y=C(0,i.lens,0,19,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid code lengths set",i.mode=30;break}i.have=0,i.mode=19;case 19:for(;i.have<i.nlen+i.ndist;){for(;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(_<16)l>>>=w,d-=w,i.lens[i.have++]=_;else{if(16===_){for(E=w+2;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(l>>>=w,d-=w,0===i.have){e.msg="invalid bit length repeat",i.mode=30;break}x=i.lens[i.have-1],h=3+(3&l),l>>>=2,d-=2}else if(17===_){for(E=w+3;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}d-=w,x=0,h=3+(7&(l>>>=w)),l>>>=3,d-=3}else{for(E=w+7;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}d-=w,x=0,h=11+(127&(l>>>=w)),l>>>=7,d-=7}if(i.have+h>i.nlen+i.ndist){e.msg="invalid bit length repeat",i.mode=30;break}for(;h--;)i.lens[i.have++]=x}}if(30===i.mode)break;if(0===i.lens[256]){e.msg="invalid code -- missing end-of-block",i.mode=30;break}if(i.lenbits=9,S={bits:i.lenbits},y=C(I,i.lens,0,i.nlen,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid literal/lengths set",i.mode=30;break}if(i.distbits=6,i.distcode=i.distdyn,S={bits:i.distbits},y=C(D,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,S),i.distbits=S.bits,y){e.msg="invalid distances set",i.mode=30;break}if(i.mode=20,6===t)break e;case 20:i.mode=21;case 21:if(6<=s&&258<=f){e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,O(e,u),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,12===i.mode&&(i.back=-1);break}for(i.back=0;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(k&&0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.lencode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}l>>>=g,d-=g,i.back+=g}if(l>>>=w,d-=w,i.back+=w,i.length=_,0===k){i.mode=26;break}if(32&k){i.back=-1,i.mode=12;break}if(64&k){e.msg="invalid literal/length code",i.mode=30;break}i.extra=15&k,i.mode=22;case 22:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.length+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra}i.was=i.length,i.mode=23;case 23:for(;k=(Z=i.distcode[l&(1<<i.distbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.distcode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}l>>>=g,d-=g,i.back+=g}if(l>>>=w,d-=w,i.back+=w,64&k){e.msg="invalid distance code",i.mode=30;break}i.offset=_,i.extra=15&k,i.mode=24;case 24:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}i.offset+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra}if(i.offset>i.dmax){e.msg="invalid distance too far back",i.mode=30;break}i.mode=25;case 25:if(0===f)break e;if(h=u-f,i.offset>h){if((h=i.offset-h)>i.whave&&i.sane){e.msg="invalid distance too far back",i.mode=30;break}h>i.wnext?(h-=i.wnext,b=i.wsize-h):b=i.wnext-h,h>i.length&&(h=i.length),m=i.window}else m=a,b=o-i.offset,h=i.length;for(f<h&&(h=f),f-=h,i.length-=h;a[o++]=m[b++],--h;);0===i.length&&(i.mode=21);break;case 26:if(0===f)break e;a[o++]=i.length,f--,i.mode=21;break;case 27:if(i.wrap){for(;d<32;){if(0===s)break e;s--,l|=n[r++]<<d,d+=8}if(u-=f,e.total_out+=u,i.total+=u,u&&(e.adler=i.check=i.flags?N(i.check,a,u,o-u):R(i.check,a,u,o-u)),u=f,(i.flags?l:L(l))!==i.check){e.msg="incorrect data check",i.mode=30;break}d=l=0}i.mode=28;case 28:if(i.wrap&&i.flags){for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8}if(l!==(4294967295&i.total)){e.msg="incorrect length check",i.mode=30;break}d=l=0}i.mode=29;case 29:y=1;break e;case 30:y=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,(i.wsize||u!==e.avail_out&&i.mode<30&&(i.mode<27||4!==t))&&j(e,e.output,e.next_out,u-e.avail_out)?(i.mode=31,-4):(c-=e.avail_in,u-=e.avail_out,e.total_in+=c,e.total_out+=u,i.total+=u,i.wrap&&u&&(e.adler=i.check=i.flags?N(i.check,a,u,e.next_out-u):R(i.check,a,u,e.next_out-u)),e.data_type=i.bits+(i.last?64:0)+(12===i.mode?128:0)+(20===i.mode||15===i.mode?256:0),(0===c&&0===u||4===t)&&y===T&&(y=-5),y)},i.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,T},i.inflateGetHeader=function(e,t){var i;return e&&e.state?0==(2&(i=e.state).wrap)?U:((i.head=t).done=!1,T):U},i.inflateSetDictionary=function(e,t){var i,n=t.length;return e&&e.state?0!==(i=e.state).wrap&&11!==i.mode?U:11===i.mode&&R(1,t,n,0)!==i.check?-3:j(e,t,n,n)?(i.mode=31,-4):(i.havedict=1,T):U},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,i){"use strict";var I=e("../utils/common"),D=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],T=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],F=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,i,n,a,r,o,s){var f,l,d,c,u,h,b,m,w,k=s.bits,_=0,g=0,v=0,p=0,x=0,y=0,S=0,E=0,Z=0,B=0,A=null,z=0,R=new I.Buf16(16),N=new I.Buf16(16),O=null,C=0;for(_=0;_<=15;_++)R[_]=0;for(g=0;g<n;g++)R[t[i+g]]++;for(x=k,p=15;1<=p&&0===R[p];p--);if(p<x&&(x=p),0===p)return a[r++]=20971520,a[r++]=20971520,s.bits=1,0;for(v=1;v<p&&0===R[v];v++);for(x<v&&(x=v),_=E=1;_<=15;_++)if(E<<=1,(E-=R[_])<0)return-1;if(0<E&&(0===e||1!==p))return-1;for(N[1]=0,_=1;_<15;_++)N[_+1]=N[_]+R[_];for(g=0;g<n;g++)0!==t[i+g]&&(o[N[t[i+g]]++]=g);if(0===e?(A=O=o,h=19):1===e?(A=D,z-=257,O=T,C-=257,h=256):(A=U,O=F,h=-1),_=v,u=r,S=g=B=0,d=-1,c=(Z=1<<(y=x))-1,1===e&&852<Z||2===e&&592<Z)return 1;for(;;){for(b=_-S,o[g]<h?(m=0,w=o[g]):o[g]>h?(m=O[C+o[g]],w=A[z+o[g]]):(m=96,w=0),f=1<<_-S,v=l=1<<y;a[u+(B>>S)+(l-=f)]=b<<24|m<<16|w|0,0!==l;);for(f=1<<_-1;B&f;)f>>=1;if(0!==f?(B&=f-1,B+=f):B=0,g++,0==--R[_]){if(_===p)break;_=t[i+o[g]]}if(x<_&&(B&c)!==d){for(0===S&&(S=x),u+=v,E=1<<(y=_-S);y+S<p&&!((E-=R[y+S])<=0);)y++,E<<=1;if(Z+=1<<y,1===e&&852<Z||2===e&&592<Z)return 1;a[d=B&c]=x<<24|y<<16|u-r|0}}return 0!==B&&(a[u+B]=_-S<<24|64<<16|0),s.bits=x,0}},{"../utils/common":1}],10:[function(e,t,i){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],11:[function(e,t,i){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],"/lib/inflate.js":[function(e,t,i){"use strict";var c=e("./zlib/inflate"),u=e("./utils/common"),h=e("./utils/strings"),b=e("./zlib/constants"),n=e("./zlib/messages"),a=e("./zlib/zstream"),r=e("./zlib/gzheader"),m=Object.prototype.toString;function o(e){if(!(this instanceof o))return new o(e);this.options=u.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new a,this.strm.avail_out=0;var i=c.inflateInit2(this.strm,t.windowBits);if(i!==b.Z_OK)throw new Error(n[i]);if(this.header=new r,c.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=h.string2buf(t.dictionary):"[object ArrayBuffer]"===m.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(i=c.inflateSetDictionary(this.strm,t.dictionary))!==b.Z_OK))throw new Error(n[i])}function s(e,t){var i=new o(t);if(i.push(e,!0),i.err)throw i.msg||n[i.err];return i.result}o.prototype.push=function(e,t){var i,n,a,r,o,s=this.strm,f=this.options.chunkSize,l=this.options.dictionary,d=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?b.Z_FINISH:b.Z_NO_FLUSH,"string"==typeof e?s.input=h.binstring2buf(e):"[object ArrayBuffer]"===m.call(e)?s.input=new Uint8Array(e):s.input=e,s.next_in=0,s.avail_in=s.input.length;do{if(0===s.avail_out&&(s.output=new u.Buf8(f),s.next_out=0,s.avail_out=f),(i=c.inflate(s,b.Z_NO_FLUSH))===b.Z_NEED_DICT&&l&&(i=c.inflateSetDictionary(this.strm,l)),i===b.Z_BUF_ERROR&&!0===d&&(i=b.Z_OK,d=!1),i!==b.Z_STREAM_END&&i!==b.Z_OK)return this.onEnd(i),!(this.ended=!0);s.next_out&&(0!==s.avail_out&&i!==b.Z_STREAM_END&&(0!==s.avail_in||n!==b.Z_FINISH&&n!==b.Z_SYNC_FLUSH)||("string"===this.options.to?(a=h.utf8border(s.output,s.next_out),r=s.next_out-a,o=h.buf2string(s.output,a),s.next_out=r,s.avail_out=f-r,r&&u.arraySet(s.output,s.output,a,r,0),this.onData(o)):this.onData(u.shrinkBuf(s.output,s.next_out)))),0===s.avail_in&&0===s.avail_out&&(d=!0)}while((0<s.avail_in||0===s.avail_out)&&i!==b.Z_STREAM_END);return i===b.Z_STREAM_END&&(n=b.Z_FINISH),n===b.Z_FINISH?(i=c.inflateEnd(this.strm),this.onEnd(i),this.ended=!0,i===b.Z_OK):n!==b.Z_SYNC_FLUSH||(this.onEnd(b.Z_OK),!(s.avail_out=0))},o.prototype.onData=function(e){this.chunks.push(e)},o.prototype.onEnd=function(e){e===b.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=u.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},i.Inflate=o,i.inflate=s,i.inflateRaw=function(e,t){return(t=t||{}).raw=!0,s(e,t)},i.ungzip=s},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});

'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONS={layout:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',gantt:'M4 3v18 M8 6h9 M8 11h13 M12 16h8',network:'M12 8v4 M5 12h14 M5 12v4 M19 12v4 M9 3h6v5H9z M2 16h6v5H2z M16 16h6v5h-6z',upload:'M12 15V3 M7 8l5-5 5 5 M4 15v5h16v-5',download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',maximize:'M8 3H3v5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5',check:'M5 12l4 4L19 6',clock:'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',flag:'M5 21V3 M5 3h13l-3 5 3 5H5',alert:'M12 3 2 21h20L12 3 M12 9v5 M12 17h.01',sparkles:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3 M20 2v4 M18 4h4',search:'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',close:'M6 6l12 12 M6 18 18 6',print:'M6 9V3h12v6 M6 17H3V9h18v8h-3 M6 14h12v7H6z',chevron:'M9 5l7 7-7 7',layers:'M12 3 2 8l10 5 10-5-10-5 M2 12l10 5 10-5 M2 16l10 5 10-5',calendar:'M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4',file:'M5 3h9l5 5v13H5z M14 3v5h5 M9 12h6 M9 16h6',refresh:'M20 8a8 8 0 1 0 0 8 M20 3v5h-5'};
function icon(n){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]||ICONS.file}"/></svg>`}function icons(){ $$('[data-icon]').forEach(x=>x.outerHTML=icon(x.dataset.icon)); }
let source=structuredClone(window.INITIAL_DATA),view='overview',selectedStage=3,page=1,detailMode='plan',moduleFilter='',statusFilter='',query='',granularity='month',weekOffset=0,pendingImport=null,updateHistory=[];
const STAGE_NAMES=['启动','规划阶段','调研阶段','详细设计阶段','实施落地阶段','上线试运行'];
function date(v){if(v==null||v==='')return '';if(typeof v==='number')return new Date(Date.UTC(1899,11,30)+Math.round(v)*86400000).toISOString().slice(0,10);const s=String(v).trim();let m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);if(m){const a=[+m[1],+m[2],+m[3]],d=new Date(Date.UTC(a[0],a[1]-1,a[2]));return d.getUTCFullYear()===a[0]&&d.getUTCMonth()===a[1]-1&&d.getUTCDate()===a[2]?d.toISOString().slice(0,10):''}m=s.match(/^(\d{1,2})[/.月](\d{1,2})日?$/);return m?date(`2026-${m[1]}-${m[2]}`):''}
function cellText(v){if(v==null)return '';if(typeof v==='number'&&v>30000&&v<100000)return date(v);const x=String(v);return /^\d{4}-\d{2}-\d{2} 00:00:00$/.test(x)?x.slice(0,10):x;}
const md=d=>d?d.slice(5).replace('-','.'):'未填';const stamp=d=>new Date(d+'T00:00:00Z').getTime();
// Beijing uses UTC+8. Keep the live calendar separate from the uploaded snapshot.
const BEIJING_OFFSET = 8 * 60 * 60 * 1000;
function beijingToday() { return new Date(Date.now() + BEIJING_OFFSET).toISOString().slice(0, 10); }
let currentDay = beijingToday(), dayTimer;
function scheduleDayRefresh() {
  clearTimeout(dayTimer);
  const nextMidnight = stamp(currentDay) + 86400000 - BEIJING_OFFSET;
  dayTimer = setTimeout(refreshCurrentDay, Math.max(50, nextMidnight - Date.now() + 50));
}
function refreshCurrentDay() {
  const nextDay = beijingToday();
  if (nextDay !== currentDay) {
    currentDay = nextDay;
    if (view === 'overview') render();
    else if (view === 'detail' && detailMode === 'plan-gantt' && model.hierarchical) {
      const results=$('#planResults'),scrollLeft=results?.querySelector('.task-table-wrap')?.scrollLeft||0;
      if(results){results.innerHTML=planResults();bindPlanResults();const wrapper=results.querySelector('.task-table-wrap');if(wrapper)wrapper.scrollLeft=scrollLeft;}
    }
  }
  scheduleDayRefresh();
}

function status(v){v=String(v||'').trim();if(/延期|逾期/.test(v))return '已延期';if(/已完成/.test(v))return '已完成';if(/进行中|评审中/.test(v))return '进行中';if(/待启动|未开始/.test(v))return '待启动';return '待确认'}
function cls(s){return s==='已完成'?'done':s==='进行中'?'active':s==='已延期'?'late':'pending'}const badge=s=>`<span class="badge ${cls(s)}">${esc(s)}</span>`;
const PROGRESS_HEADERS=['名称','主责部门','层级','计划开始时间','计划结束时间','实际开始时间','实际结束时间','阶段状态'];
function isProgressSheet(sheet){return PROGRESS_HEADERS.every((h,i)=>String(sheet?.data?.[0]?.[i]||'').trim()===h)}
function selectPlanSheets(sheets){
 const progress=(sheets||[]).filter(isProgressSheet);
 if(progress.length>1)throw Error('发现多张项目进度表，请仅保留一张符合八列表头的工作表');
 return progress.length?progress:(sheets||[]).filter(s=>s.sheet==='项目计划');
}
function parseProgress(src){
 const sheet=selectPlanSheets(src.sheets)[0],nodes=[],stages=[],conclusions=[];
 let stageNode=null,taskNode=null,inConclusions=false;
 sheet.data.slice(1).forEach((r,index)=>{
  const name=String(r[0]||'').trim(),levelName=String(r[2]||'').trim(),row=index+2;
  if(!name)return;
  if(/^当前项目卡点/.test(name)){inConclusions=true;return}
  if(inConclusions){name.split(/\r?\n/).map(x=>x.trim().replace(/^\d+[.、]\s*/,'' )).filter(Boolean).forEach(x=>conclusions.push(x));return}
  const level=['阶段','一级任务','二级任务'].indexOf(levelName);
  if(level<0)throw Error(`第 ${row} 行的层级应为阶段、一级任务或二级任务`);
  if(level>0&&!stageNode)throw Error(`第 ${row} 行缺少所属阶段`);
  if(level===2&&!taskNode)throw Error(`第 ${row} 行缺少所属一级任务`);
  const values={};['start','end','actualStart','actualEnd'].forEach((key,i)=>{
   const raw=r[i+3];values[key]=date(raw);
   if(raw!=null&&String(raw).trim()!==''&&String(raw).trim()!=='/'&&!values[key])throw Error(`第 ${row} 行的${PROGRESS_HEADERS[i+3]}无效`);
  });
  if(values.start&&values.end&&values.start>values.end)throw Error(`第 ${row} 行计划结束早于计划开始`);
  if(values.actualStart&&values.actualEnd&&values.actualStart>values.actualEnd)throw Error(`第 ${row} 行实际结束早于实际开始`);
  const node={id:'progress-'+row,row,name,level,levelName,kind:level===0?'stage':'task',stage:level===0?stages.length:stageNode.stage,parent:level===0?'':level===1?stageNode.id:taskNode.id,owner:String(r[1]||'').trim(),rawStatus:String(r[7]||'').trim(),rawDates:r.slice(3,7),...values,sheet:sheet.sheet,duration:'',root:level===0?name:stageNode.name,group:level===2?taskNode.name:level===1?name:'',groupLabel:level===2?taskNode.name:level===1?name:''};
  node.status=status(node.rawStatus);
  if(level===0){stageNode=node;taskNode=null;stages.push({...node})}
  if(level===1)taskNode=node;
  nodes.push(node);
 });
 const parents=new Set(nodes.map(n=>n.parent).filter(Boolean));
 nodes.forEach(n=>{n.groupHeader=parents.has(n.id);n.leaf=n.kind!=='stage'&&!n.groupHeader});
 return{hierarchical:true,sheet:sheet.sheet,nodes,plans:nodes.filter(n=>n.kind!=='stage'),stages,conclusions,tasks:[],aux:[],modules:[]};
}
function progressDate(p,key){const value=p[key];if(value)return md(value);return String(p.rawDates?.[['start','end','actualStart','actualEnd'].indexOf(key)]||'').trim()==='/'?'/':'—'}
function progressPeriod(p,actual=false,full=false){return (actual?['actualStart','actualEnd']:['start','end']).map(key=>full&&p[key]?p[key]:progressDate(p,key)).join(' — ')}
function hierarchyVisiblePlans(){
 const all=model.nodes,map=new Map(all.map(p=>[p.id,p])),selected=new Set();
 const descends=(node,id)=>{while(node){if(node.id===id)return true;node=map.get(node.parent)}return false};
 all.forEach(p=>{
  if(planScope!=='all'&&p.stage!==selectedStage)return;
  if(query&&!(p.name+' '+p.root+' '+p.group+' '+p.owner+' '+p.rawStatus).toLowerCase().includes(query.toLowerCase()))return;
  if(statusFilter&&(p.status!==statusFilter||p.kind==='stage'||p.groupHeader))return;
  if(planGroup&&!descends(p,planGroup))return;
  let n=p;while(n){selected.add(n.id);n=map.get(n.parent)}
 });
 return all.filter(p=>selected.has(p.id));
}
function hierarchyDetails(){
 const scope=model.nodes.filter(p=>planScope==='all'||p.stage===selectedStage),leaves=scope.filter(p=>p.leaf);
 const title=planScope==='all'?'项目进度计划':model.stages[selectedStage].name;
 return header('细分阶段计划','','DETAILED PROJECT PLAN')+`<div class="plan-scope"><button class="btn ${planScope==='all'?'primary':''}" data-all-plans>全部计划</button>${model.stages.map((s,i)=>`<button class="scope-tab ${planScope!=='all'&&selectedStage===i?'selected':''}" data-stage="${i}">${esc(s.name)}</button>`).join('')}</div><section class="panel"><div class="detail-summary"><div><h2>${esc(title)}</h2><p>阶段 → 一级任务 → 二级任务</p></div><div class="detail-counts"><div><strong>${leaves.length}</strong><small>末级任务</small></div><div><strong style="color:#28a891">${leaves.filter(p=>p.status==='已完成').length}</strong><small>已完成</small></div><div><strong style="color:#6579d5">${leaves.filter(p=>p.status==='进行中').length}</strong><small>进行中</small></div></div></div><div class="filter-bar"><label class="search-field">${icon('search')}<input id="planSearch" placeholder="搜索阶段或任务" value="${esc(query)}" aria-label="搜索细分计划"></label><select id="planGroup" aria-label="按一级任务筛选"><option value="">全部一级任务</option>${model.plans.filter(p=>p.level===1&&(planScope==='all'||p.stage===selectedStage)).map(p=>`<option value="${p.id}" ${planGroup===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><select id="planStatus" aria-label="按原表状态筛选"><option value="">全部状态</option>${['已完成','进行中','待启动','已延期','待确认'].map(st=>`<option value="${st}" ${statusFilter===st?'selected':''}>${st==='待启动'?'未开始':st==='待确认'?'状态未填':st}</option>`).join('')}</select><div class="segments"><button data-plan-mode="plan" class="${detailMode==='plan'?'selected':''}">阶段表格</button><button data-plan-mode="plan-gantt" class="${detailMode==='plan-gantt'?'selected':''}">计划甘特</button></div></div><div id="planResults">${hierarchyPlanResults()}</div></section>`;
}
function hierarchyPlanResults(){
 const rows=hierarchyVisiblePlans(),map=new Map(model.nodes.map(p=>[p.id,p]));
 const visible=rows.filter(p=>{let n=map.get(p.parent);while(n){if(collapsedPlanGroups.has(n.id))return false;n=map.get(n.parent)}return true});
 if(!rows.length)return '<div class="empty">没有符合条件的任务<button class="text-btn" data-reset-plan>清除筛选</button></div>';
 const footer=`<div class="table-footer"><span>${rows.filter(p=>p.leaf).length} 项末级任务 · 保留原表层级与顺序</span><span>“/”为原表未填日期</span></div>`;
 if(detailMode==='plan-gantt')return hierarchyGantt(visible)+footer;
 return `<div class="task-table-wrap"><table class="task-table progress-table"><thead><tr>${['名称','主责部门','层级','计划周期','实际周期','阶段状态'].map(h=>`<th>${h}</th>`).join('')}<th></th></tr></thead><tbody>${visible.map(p=>`<tr class="progress-row ${p.kind==='stage'?'progress-stage':p.level===1?'progress-parent':''}" data-plan="${p.id}"><td><div class="progress-name" style="--depth:${p.level}">${p.groupHeader?`<button class="progress-toggle" data-plan-group-toggle="${p.id}" aria-label="${collapsedPlanGroups.has(p.id)?'展开':'折叠'}${esc(p.name)}" aria-expanded="${!collapsedPlanGroups.has(p.id)}">${collapsedPlanGroups.has(p.id)?'+':'−'}</button>`:'<span class="progress-bullet"></span>'}<strong>${esc(p.name)}</strong></div></td><td class="progress-owner">${esc(p.owner||'—')}</td><td><span class="level-tag level-${p.level}">${p.levelName}</span></td><td class="progress-date">${progressPeriod(p)}</td><td class="progress-date actual-date">${progressPeriod(p,true)}</td><td><span class="badge ${cls(p.status)}">${esc(p.rawStatus||'未填')}</span></td><td class="plan-chevron">${icon('chevron')}</td></tr>`).join('')}</tbody></table></div>`+footer;
}
function hierarchyGantt(rows){
 const DAY=86400000,dates=model.nodes.flatMap(p=>[p.start,p.end,p.actualStart,p.actualEnd]).filter(Boolean),first=Math.min(...dates.map(stamp)),last=Math.max(...dates.map(stamp)),dow=(new Date(first).getUTCDay()+6)%7,start=first-dow*DAY,weeks=Math.ceil((last-start+DAY)/(7*DAY)),end=start+weeks*7*DAY,pct=d=>Math.max(0,Math.min(100,(stamp(d)-start)/(end-start)*100));
 const insideToday=stamp(currentDay)>=start&&stamp(currentDay)<end,today=pct(currentDay);
 const todayLabel=insideToday?`<span class="hg-today-label" style="left:clamp(30px,${today}%,calc(100% - 30px))" title="北京时间 ${currentDay}">今天 ${md(currentDay)}</span>`:'';
 const todayLine=insideToday?`<span class="hg-today-line" style="left:${today}%" aria-hidden="true"></span>`:'';
 return `<div class="task-table-wrap"><div class="hierarchy-gantt" style="--weeks:${weeks};min-width:${430+weeks*88}px"><div class="hg-row hg-header"><div class="hg-frozen">阶段 / 任务<span>状态</span></div><div class="hg-weeks">${Array.from({length:weeks},(_,i)=>`<div><b>W${i+1}</b><small>${md(new Date(start+i*7*DAY).toISOString().slice(0,10))}</small></div>`).join('')}${todayLabel}</div></div>${rows.map(p=>{
  const actualEnd=p.actualEnd||(p.actualStart&&source.asOf>=p.actualStart?source.asOf:'');
  const bar=(from,to,type)=>{
   if(!from||!to||to<from)return '';
   const prefix=type==='plan'?'计划':'实际',ending=type==='plan'||p.actualEnd?md(to):'进行中';
   return `<span class="hg-bar hg-${type} ${p.status==='已完成'?'done':''}" style="left:${pct(from)}%;width:${Math.max(.35,pct(new Date(stamp(to)+DAY).toISOString().slice(0,10))-pct(from))}%" title="${prefix} ${from} — ${type==='plan'||p.actualEnd?to:'进行中'}"></span><span class="hg-date-label hg-${type}-label">${prefix} ${md(from)} — ${ending}</span>`;
  };
  return `<div class="hg-row ${p.kind==='stage'?'hg-stage':p.level===1?'hg-parent':''}" data-plan="${p.id}"><div class="hg-frozen"><div class="progress-name" style="--depth:${p.level}">${p.groupHeader?`<button class="progress-toggle" data-plan-group-toggle="${p.id}" aria-label="${collapsedPlanGroups.has(p.id)?'展开':'折叠'}${esc(p.name)}">${collapsedPlanGroups.has(p.id)?'+':'−'}</button>`:'<span class="progress-bullet"></span>'}<strong>${esc(p.name)}</strong></div><span class="badge ${cls(p.status)}">${esc(p.rawStatus||'未填')}</span></div><div class="hg-track">${bar(p.start,p.end,'plan')}${bar(p.actualStart,actualEnd,'actual')}${!p.start?'<span class="hg-missing">计划日期未填</span>':''}${todayLine}</div></div>`;
 }).join('')}</div></div>`;
}
function showHierarchyPlan(p){
 const stage=model.stages[p.stage];
 $('#drawerContent').innerHTML=`<div class="drawer-header"><span>${esc(p.levelName)}详情</span><button class="icon-btn" data-close="drawer" aria-label="关闭计划详情">${icon('close')}</button></div><div class="drawer-body"><div class="eyebrow">${esc(stage.name)}${p.level===2?' / '+esc(p.group):''}</div><h2>${esc(p.name)}</h2><span class="badge ${cls(p.status)}">${esc(p.rawStatus||'未填')}</span><div class="property-grid"><div><small>主责部门</small><strong>${esc(p.owner||'原表未填')}</strong></div><div><small>层级</small><strong>${p.levelName}</strong></div><div><small>计划周期</small><strong>${progressPeriod(p,false,true)}</strong></div><div><small>实际周期</small><strong>${progressPeriod(p,true,true)}</strong></div></div><div class="source-line">${esc(source.sourceFile||'彩棠工作台项目进度表.xlsx')}<br>工作表「${esc(p.sheet)}」· 第 ${p.row} 行</div></div>`;
 if(!$('#drawer').open)$('#drawer').showModal();$('#drawer [data-close]').onclick=()=>$('#drawer').close();
}
function projectConclusions(){
 const items=model.conclusions||[];
 return items.length?`<div class="conclusions"><span class="conclusion-tag">关键结论</span><ol>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`:`<div class="blockers-empty"><span class="blockers-icon">${icon('check')}</span><strong>暂无卡点</strong></div>`;
}
function milestoneItems(){
 const development=model.plans.find(p=>p.name==='实施开发'||p.name.includes('实施开发开发计划'));
 const items=[{date:model.stages[3]?.end,name:'详细设计阶段完成',desc:'战略 · 阶段计划',stage:3},{date:development?.end,name:'实施开发计划完成',desc:'项目进度计划',stage:4},{date:model.stages[4]?.end,name:'实施落地阶段完成',desc:'数科 · 阶段计划',stage:4}];
 if(model.stages[5])items.push({date:model.stages[5].end,name:model.stages[5].name,desc:'数科 · 阶段计划',stage:5});
 return items.filter(m=>m.date).map(m=>`<button class="milestone-item" style="width:100%;text-align:left" data-stage="${m.stage}"><div class="date-tile"><small>${m.date.slice(5,7)}月</small>${m.date.slice(8)}</div><div><strong>${m.name}</strong><p>${m.desc}</p></div><span class="badge active">计划节点</span></button>`).join('');
}

function parseModel(src){if(selectPlanSheets(src.sheets).some(isProgressSheet))return parseProgress(src);const ps=src.sheets.find(s=>s.sheet==='项目计划');let plans=[],group='阶段任务';if(ps)ps.data.slice(3).forEach((r,ii)=>{if(!r[0])return;const name=String(r[0]).trim(),duration=String(r[1]||''),match=duration.match(/（(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})）/);if(/^需求评审彩棠|^实施开发开发计划|^功能测试$/.test(name))group=/需求评审/.test(name)?'需求评审':/实施开发/.test(name)?'实施开发':'功能测试';const stage=ii===0?1:ii===1?2:ii<=4?3:4;plans.push({id:'plan-'+(ii+4),row:ii+4,name,stage,group,start:match?date(`2026-${match[1]}-${match[2]}`):'',end:match?date(`2026-${match[3]}-${match[4]}`):'',duration,status:status(r[2]),rawStatus:r[2]||'未填',sheet:'项目计划'})});return{plans,tasks:[],aux:[],modules:[],stages:src.stages}}

source.sheets=selectPlanSheets(source.sheets);delete source.history;
let model=parseModel(source);
let planScope='all',planGroup='',collapsedPlanGroups=new Set();
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000)}
function go(v){view=v;page=1;render();window.scrollTo({top:0,behavior:'smooth'})}function drill(s,filter=''){selectedStage=s;planScope='stage';planGroup='';moduleFilter='';statusFilter=filter;query='';detailMode='plan';go('detail')}
function header(title,sub,eyebrow='PROJECT OVERVIEW'){return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub?`<div class="subtitle">${sub}</div>`:''}</div><div class="head-actions"><button class="btn" data-action="export">${icon('download')}导出汇报版</button><button class="btn primary" data-action="upload">${icon('upload')}更新本周数据</button></div></div>`}
function render(){ currentDay=beijingToday();$('#crumb').textContent={overview:'项目总览',detail:'阶段计划',updates:'每周数据更新'}[view];$$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===view));$('#main').innerHTML=({overview:overview,detail:details,updates:updates}[view])();icons();bind();positionGanttLabels();const complete=model.stages.filter(s=>s.status==='已完成').length;$('.project-health strong').textContent=model.stages.filter(s=>s.status==='进行中').map(s=>s.name.replace('阶段','')).join('与')||'查看各阶段状态';$('.project-health small').textContent=`${complete} / ${model.stages.length} 个阶段已完成`;$('.mini-phases').innerHTML=model.stages.map(s=>s.status==='已完成'?'<b></b>':'<i></i>').join('');}
function overview(){const done=model.stages.filter(s=>s.status==='已完成').length,active=model.stages.filter(s=>s.status==='进行中').length,rows=planRows(),leaves=rows.filter(p=>p.leaf),running=leaves.filter(p=>p.status==='进行中'),next=model.stages.filter(s=>s.status!=='已完成'&&s.end>=source.asOf).sort((a,b)=>a.end.localeCompare(b.end))[0];return header('彩棠工作台项目管理',`计划周期 ${model.stages[0].start.replaceAll('-','.')} — ${model.stages.at(-1).end.replaceAll('-','.')}`)+`<section class="metrics"><div class="metric"><div class="metric-top">阶段完成率 ${icon('layers')}</div><div class="metric-value">${Math.round(done/model.stages.length*100)}<small>%</small></div><div class="metric-foot"><em>${done} 个阶段已完成</em>共 ${model.stages.length} 个阶段</div><div class="donut" style="background:conic-gradient(var(--blue) ${Math.round(done/model.stages.length*100)}%,#edf1fa 0)"></div></div><div class="metric"><div class="metric-top">当前进行阶段 ${icon('clock')}</div><div class="metric-value">${String(active).padStart(2,'0')}<small>个</small></div><div class="metric-foot">${model.stages.filter(s=>s.status==='进行中').map(s=>s.name.replace('阶段','')).join(' · ')||'暂无进行中的阶段'}</div></div><div class="metric"><div class="metric-top">下一阶段里程碑 ${icon('flag')}</div><div class="metric-value">${next?md(next.end):'—'}<small>${next?'2026':''}</small></div><div class="metric-foot">${next?next.name+'计划结束':'暂无待完成里程碑'}</div></div><button class="metric" style="text-align:left" data-action="allPlans"><div class="metric-top">细分计划项 ${icon('gantt')}</div><div class="metric-value">${leaves.length}<small>项</small></div><div class="metric-foot"><em>${leaves.filter(p=>p.status==='已完成').length} 项已完成</em>来源：${esc(model.sheet||'项目计划')}</div></button></section><div class="overview-grid"><section class="panel"><div class="panel-head"><div><h2>项目阶段甘特图 <small>PROJECT ROADMAP</small></h2><p>计划与实际同步呈现 · 点击阶段查看细分计划</p></div><div class="segments"><button data-gran="month" class="${granularity==='month'?'selected':''}">月视图</button><button data-gran="week" class="${granularity==='week'?'selected':''}">周视图</button></div></div><div class="legend"><span><i class="planned-key"></i>计划周期（浅色）</span><span><i class="actual-key"></i>实际周期（深色）</span><span><i></i>已完成</span><span class="hint">实际结束时间以总管理表为准</span></div>${gantt()}</section></div><div class="lower-grid"><section class="panel"><div class="panel-head"><h2>关键里程碑 <small>MILESTONES</small></h2>${icon('flag')}</div><div class="milestone-list">${milestoneItems()}</div></section><section class="panel blockers-panel"><div class="panel-head"><h2>当前项目卡点 <small>PROJECT BLOCKERS</small></h2></div>${projectConclusions()}</section></div>`}
function positionGanttLabels() {
 $$('.gantt .track,.hierarchy-gantt .hg-track').forEach(track => {
  const plan=track.querySelector('.plan-line,.hg-plan'),actual=track.querySelector('.actual-line,.hg-actual'),p=track.querySelector('.plan-lane .range-label,.hg-plan-label'),a=track.querySelector('.actual-lane .range-label,.hg-actual-label');
  const padding=6,gap=12,width=track.clientWidth,origin=track.getBoundingClientRect().left;
  const range=bar=>{const box=bar.getBoundingClientRect();return [box.left-origin,box.right-origin]};
  const pr=plan?range(plan):null,ar=actual?range(actual):null,pw=p?.getBoundingClientRect().width||0,aw=a?.getBoundingClientRect().width||0;
  const clamp=(x,w)=>Math.max(padding,Math.min(x,width-w-padding));
  let px=0,ax=0,actualInside=!!ar&&ar[1]-ar[0]>=aw+padding*2;
  if(a&&ar){
   a.classList.toggle('outside',!actualInside);
   ax=clamp(actualInside?ar[0]+padding:ar[1]+padding,aw);
  }
  if(p&&pr){
   const spaces=ar?[[pr[0],Math.min(pr[1],ar[0])],[Math.max(pr[0],ar[1]),pr[1]]]:[pr];
   const space=spaces.filter(([left,right])=>right-left>=pw+padding*2).sort((x,y)=>(y[1]-y[0])-(x[1]-x[0]))[0];
   px=clamp(space?space[0]+padding:Math.max(pr[1],ar?.[1]||0)+padding,pw);
  }
  // Position the pair together: identical or overlapping dates must never cover each other.
  if(p&&a&&pr&&ar&&px<ax+aw+gap&&ax<px+pw+gap){
   if(actualInside&&ax+aw+gap+pw<=width-padding)px=ax+aw+gap;
   else if(actualInside&&ax-pw-gap>=padding)px=ax-pw-gap;
   else{
    const total=pw+gap+aw,right=Math.max(pr[1],ar[1])+padding,left=Math.min(pr[0],ar[0])-padding-total;
    px=clamp(right+total<=width-padding?right:left>=padding?left:right,total);
    ax=px+pw+gap;
    actualInside=false;
    a.classList.add('outside');
   }
  }
  if(p)p.style.left=px+'px';
  if(a)a.style.left=ax+'px';
 });
}
function gantt(){
 const DAY=86400000,weekly=granularity==='week',base=new Date(currentDay+'T00:00:00Z'),dow=(base.getUTCDay()+6)%7;
 const start=weekly?stamp(currentDay)-(dow+14)*DAY+weekOffset*42*DAY:stamp('2026-08-01');
 const end=weekly?start+42*DAY:Math.max(stamp('2026-12-15'),...model.stages.map(s=>stamp(s.end)+7*DAY));
 const iso=n=>new Date(n).toISOString().slice(0,10),pos=d=>Math.max(0,Math.min(100,(stamp(d)-start)/(end-start)*100));
 const marks=weekly?Array.from({length:6},(_,i)=>iso(start+i*7*DAY)):['2026-08-01','2026-09-01','2026-10-01','2026-11-01','2026-12-01'];
 const today=pos(currentDay),insideToday=stamp(currentDay)>=start&&stamp(currentDay)<end;
 const grid=marks.slice(1).map(d=>`<span class="grid-line" style="left:${pos(d)}%"></span>`).join('');
 function lane(kind,from,to,label,title){
  const visible=from&&to&&to>=from&&stamp(to)>=start&&stamp(from)<end;
  if(!visible)return `<div class="gantt-lane ${kind}-lane" title="${esc(title)}"><span class="range-unavailable">${esc(label)}${weekly&&from&&to?'<small>不在当前窗口</small>':''}</span></div>`;
  const left=pos(from),width=Math.max(pos(iso(stamp(to)+DAY))-left,.6),labelLeft=left+1.2;
  return `<div class="gantt-lane ${kind}-lane" title="${esc(title)}"><div class="${kind}-line" style="left:${left}%;width:${width}%"></div><span class="range-label" style="left:clamp(6px,${labelLeft}%,calc(100% - 160px))">${esc(label)}</span></div>`;
 }
 return `<div class="gantt-scroll"><div class="gantt ${weekly?'weekly-gantt':''}"><div class="gantt-head"><div>阶段状态 / 项目阶段 / 主责部门</div><div class="months">${marks.map((d,i)=>`<span style="left:${pos(d)}%">${weekly?`<b>第 ${i+1} 周</b><small>${md(d)} — ${md(iso(stamp(d)+6*DAY))}</small>`:d.slice(5,7)+'月'}</span>`).join('')}</div></div><div class="gantt-body">${model.stages.map((s,i)=>{
  const actualEnd=s.actualEnd||((s.actualStart&&source.asOf>=s.actualStart)?source.asOf:'');
  const rgb=s.status==='已完成'?'48,182,164':i===3?'113,128,227':'70,98,221';
  const planColor=i===3?'#e9e7fa':i===4?'#dfe7fc':'#e0f3ef';
  const planLabel=`计划 ${md(s.start)} — ${md(s.end)}`;
  const actualLabel=s.actualStart?`实际 ${md(s.actualStart)} — ${s.actualEnd?md(s.actualEnd):s.status==='进行中'?'进行中':'结束未填'}`:'实际开始时间未填';
  const actualTitle=s.actualStart?`实际开始：${s.actualStart}；${s.actualEnd?'实际结束：'+s.actualEnd:'实际结束未填，色条展示至报告日期 '+source.asOf}`:'原表未填写实际开始时间';
  return `<div class="gantt-row" data-stage="${i}" role="button" tabindex="0" aria-label="查看${s.name}"><div class="stage-label"><span class="stage-state ${cls(s.status)}">${s.status==='已完成'?icon('check'):icon('clock')}${esc(s.rawStatus||s.status)}</span><div><strong>${s.name}</strong><small>${esc(s.owner)} · 主责部门</small></div></div><div class="track" style="--stage-rgb:${rgb};--plan-color:${planColor}">${grid}${lane('plan',s.start,s.end,planLabel,`计划开始：${s.start}；计划结束：${s.end}`)}${lane('actual',s.actualStart,actualEnd,actualLabel,actualTitle)}${insideToday?`<span class="today-line" style="left:${today}%">${i===0?'<span title="北京时间">今天 '+md(currentDay)+'</span>':''}</span>`:''}</div></div>`;
 }).join('')}</div></div></div>`;
}


function planLabel(name){return /^需求评审彩棠/.test(name)?'需求评审':/^实施开发开发计划/.test(name)?'实施开发':name;}
function planRows(){if(model.hierarchical)return model.nodes;let parent='',groupLabel='';return model.plans.map(p=>{const groupHeader=/^需求评审彩棠|^实施开发开发计划|^功能测试$/.test(p.name);if(groupHeader){parent=p.id;groupLabel=p.name}if(p.name==='UAT'||p.name==='上线试运行'){parent='';groupLabel=''}return {...p,groupHeader,parent:groupHeader?'':parent,groupLabel,leaf:!groupHeader}})}
function visiblePlans(){if(model.hierarchical)return hierarchyVisiblePlans();const all=planRows(),filtered=all.filter(p=>(planScope==='all'||p.stage===selectedStage)&&(!query||(p.name+p.duration+p.rawStatus+p.groupLabel).toLowerCase().includes(query.toLowerCase()))&&(!statusFilter||(!p.groupHeader&&p.status===statusFilter))&&(!planGroup||p.groupLabel===planGroup));const parents=new Set(filtered.map(p=>p.parent).filter(Boolean));return all.filter(p=>filtered.some(f=>f.id===p.id)||parents.has(p.id))}
function showAllPlans(){planScope='all';query='';statusFilter='';planGroup='';detailMode='plan';go('detail')}
function details(){if(model.hierarchical)return hierarchyDetails();const all=planRows(),scope=all.filter(p=>planScope==='all'||p.stage===selectedStage),leaves=scope.filter(p=>p.leaf),completed=leaves.filter(p=>p.status==='已完成').length,running=leaves.filter(p=>p.status==='进行中').length;return header('细分阶段计划',``,'DETAILED PROJECT PLAN')+`<div class="plan-scope"><button class="btn ${planScope==='all'?'primary':''}" data-all-plans>全部计划</button><span>按总管理阶段查看</span>${model.stages.map((s,i)=>`<button class="scope-tab ${planScope!=='all'&&selectedStage===i?'selected':''}" data-stage="${i}">${s.name}</button>`).join('')}</div><section class="panel"><div class="detail-summary"><div><h2>${planScope==='all'?'项目工作计划':model.stages[selectedStage].name}</h2><p>${planScope==='all'?'架构与调研 → 功能设计 → 需求评审 → 实施开发 → 功能测试':'阶段筛选 · 原表内容和次序保持不变'}</p></div><div class="detail-counts"><div><strong>${leaves.length}</strong><small>细分计划项</small></div><div><strong style="color:#28a891">${completed}</strong><small>原表已完成</small></div><div><strong style="color:#6579d5">${running}</strong><small>原表进行中</small></div></div></div><div class="filter-bar"><label class="search-field">${icon('search')}<input id="planSearch" placeholder="搜索项目阶段或模块" value="${esc(query)}" aria-label="搜索细分计划"></label><select id="planGroup" aria-label="按原表分组筛选"><option value="">全部分组</option>${all.filter(p=>p.groupHeader).map(p=>`<option value="${esc(p.name)}" ${p.name===planGroup?'selected':''}>${esc(p.name.replace('需求评审彩棠工作台功能说明书（数科）','需求评审').replace('实施开发开发计划（已知需求）','实施开发'))}</option>`).join('')}</select><select id="planStatus" aria-label="按原表状态筛选"><option value="">全部状态</option>${['已完成','进行中','待启动','待确认'].map(st=>`<option value="${st}" ${statusFilter===st?'selected':''}>${st==='待确认'?'状态未填':st}</option>`).join('')}</select><div class="segments"><button data-plan-mode="plan" class="${detailMode==='plan'?'selected':''}">原表计划</button><button data-plan-mode="plan-gantt" class="${detailMode==='plan-gantt'?'selected':''}">计划甘特</button></div></div><div id="planResults">${planResults()}</div></section><div class="mini-note">当前 ${model.plans.length} 条原表记录，${all.filter(p=>p.groupHeader).length} 条为分组标题、${all.filter(p=>p.leaf).length} 条为细分计划项。状态沿用原表，“已完成评审”“已完成开发”“待启动（预估）”分别保留；UAT 与上线试运行的日期、状态原表未填。</div>`}
function planResults(){if(model.hierarchical)return hierarchyPlanResults();const rows=visiblePlans();if(!rows.length){if(planScope!=='all'&&selectedStage===0)return '<div class="empty">启动阶段已于 08.03 完成</div>';return '<div class="empty">没有符合条件的计划项<br><button class="text-btn" data-reset-plan>清除筛选</button></div>'}let collapsed=0;const visible=rows.filter(p=>{if(p.parent&&collapsedPlanGroups.has(p.parent)){collapsed++;return false}return true});if(detailMode==='plan-gantt')return planGantt(visible)+`<div class="table-footer">${rows.filter(p=>p.leaf).length} 个计划项 · W1–W16 对应原表 09.14 — 次年 01.03 · 向右滚动查看完整排期</div>`;return `<div class="task-table-wrap"><table class="task-table original-plan-table"><thead><tr><th>项目阶段 / 计划项</th><th>用时</th><th>计划周期</th><th>状态</th><th></th></tr></thead><tbody>${visible.map(p=>p.groupHeader?`<tr class="plan-group-row" data-plan-group-toggle="${p.id}"><td><button class="plan-group-btn" aria-expanded="${!collapsedPlanGroups.has(p.id)}"><span class="group-toggle">${collapsedPlanGroups.has(p.id)?'+':'−'}</span>${esc(planLabel(p.name))}</button></td><td>${esc(p.duration)}</td><td>${md(p.start)} — ${md(p.end)}</td><td><span class="workflow-label">${esc(p.rawStatus)}</span></td><td><span class="group-count">${planRows().filter(x=>x.parent===p.id).length} 项</span></td></tr>`:`<tr data-plan="${p.id}"><td><div class="original-plan-title ${p.parent?'child-plan':''}">${p.parent?'<span class="child-dot"></span>':'<span class="source-row">'+String(p.row-3).padStart(2,'0')+'</span>'}<strong>${esc(planLabel(p.name))}</strong></div></td><td class="plan-duration">${esc(p.duration.split('（')[0]||'未填')}</td><td class="plan-period">${p.start?md(p.start)+' — '+md(p.end):'未填'}</td><td><span class="badge ${cls(p.status)}">${esc(p.rawStatus==='未填'?'未填':p.rawStatus)}</span></td><td class="plan-chevron">${icon('chevron')}</td></tr>`).join('')}</tbody></table></div><div class="table-footer"><span>${rows.filter(p=>p.leaf).length} 个计划项 ${collapsed?'· '+collapsed+' 项已折叠':''} · 按原表顺序展示</span><span>来源：${esc(model.sheet||'项目计划')}</span></div>`}
function planGantt(rows){const start=stamp('2026-09-14'),end=start+112*86400000,pct=d=>Math.max(0,Math.min(100,(stamp(d)-start)/(end-start)*100));return `<div class="task-table-wrap"><div class="original-gantt"><div class="og-header"><div class="og-frozen"><b>项目阶段 / 计划项</b><span>状态</span></div><div class="og-weeks">${Array.from({length:16},(_,i)=>{let d=new Date(start+i*7*86400000).toISOString().slice(0,10);return `<div><b>W${i+1}</b><small>${md(d)}</small></div>`}).join('')}</div></div>${rows.map(p=>{const out=p.end&&stamp(p.end)<start,left=p.start?pct(p.start):0,width=p.end?Math.max(.6,pct(new Date(stamp(p.end)+86400000).toISOString().slice(0,10))-left):0;return `<div class="og-row ${p.groupHeader?'og-group':''}" ${p.groupHeader?`data-plan-group-toggle="${p.id}"`:`data-plan="${p.id}"`}><div class="og-frozen"><span class="og-name ${p.parent?'og-child':''}">${p.groupHeader?'<b>'+ (collapsedPlanGroups.has(p.id)?'+':'−') +' '+esc(planLabel(p.name))+'</b>':esc(planLabel(p.name))}</span>${p.groupHeader?'':`<span class="badge ${cls(p.status)}">${esc(p.rawStatus)}</span>`}</div><div class="og-track">${out?`<span class="og-out">${md(p.start)} — ${md(p.end)} · ${esc(p.rawStatus)}</span>`:p.start?`<span class="og-bar ${cls(p.status)}" style="left:${left}%;width:${width}%">${p.groupHeader?'':md(p.start)+' — '+md(p.end)}</span>`:'<span class="og-out">原表日期未填</span>'}</div></div>`}).join('')}</div></div>`}
function showPlan(id){const p=planRows().find(x=>x.id===id);if(!p)return;if(model.hierarchical)return showHierarchyPlan(p);$('#drawerContent').innerHTML=`<div class="drawer-header"><span>细分计划 / Excel 项目计划</span><button class="icon-btn" data-close="drawer" aria-label="关闭计划详情">${icon('close')}</button></div><div class="drawer-body"><div class="eyebrow">${esc(planLabel(p.groupLabel||'前期与设计计划'))}</div><h2>${esc(planLabel(p.name))}</h2><span class="badge ${cls(p.status)}">${esc(p.rawStatus)}</span><div class="property-grid"><div><small>原表用时</small><strong>${esc(p.duration||'未填')}</strong></div><div><small>所属总阶段</small><strong>${STAGE_NAMES[p.stage]}</strong></div><div><small>计划开始</small><strong>${p.start||'未填'}</strong></div><div><small>计划结束</small><strong>${p.end||'未填'}</strong></div></div><div class="note-box">${p.duration.includes('预估')||p.rawStatus.includes('预估')?'此项为原表预估计划。':'计划名称、用时和状态均按「项目计划」原表展示。'}${!p.start?'原表未填写时间，未推算或补造日期。':''}</div><div class="source-line">数据来源：集团流程改革-彩棠试点项目工作计划.xlsx<br>工作表「项目计划」· 第 ${p.row} 行 · A–C 列</div></div>`;if(!$('#drawer').open)$('#drawer').showModal();$('#drawer [data-close]').onclick=()=>$('#drawer').close()}
function bindPlanResults(){const r=$('#planResults');if(!r)return;r.querySelectorAll('[data-plan]').forEach(el=>el.onclick=()=>showPlan(el.dataset.plan));r.querySelectorAll('[data-plan-group-toggle]').forEach(el=>el.onclick=e=>{e.stopPropagation();const id=el.dataset.planGroupToggle;if(collapsedPlanGroups.has(id))collapsedPlanGroups.delete(id);else collapsedPlanGroups.add(id);r.innerHTML=planResults();bindPlanResults()});r.querySelectorAll('[data-reset-plan]').forEach(el=>el.onclick=()=>{query='';statusFilter='';planGroup='';render()});positionGanttLabels()}
function bindPlans(){ $$('[data-all-plans]').forEach(el=>el.onclick=showAllPlans);$$('[data-plan-mode]').forEach(el=>el.onclick=()=>{detailMode=el.dataset.planMode;render()});if($('#planSearch'))$('#planSearch').oninput=e=>{query=e.target.value;collapsedPlanGroups.clear();$('#planResults').innerHTML=planResults();bindPlanResults()};for(const id of ['planGroup','planStatus'])if($('#'+id))$('#'+id).onchange=e=>{if(id==='planGroup')planGroup=e.target.value;else statusFilter=e.target.value;collapsedPlanGroups.clear();$('#planResults').innerHTML=planResults();bindPlanResults()};bindPlanResults()}
// Each origin keeps its own archive; exported files also have separate archives.
let historyDatabase = null, historyLoaded = false, historyError = '', latestRecordId = '', savingImport = false;
let historyReady;
function cleanSnapshot(value) {
  const copy = structuredClone(value);
  delete copy.history;
  copy.sheets = selectPlanSheets(copy.sheets);
  return copy;
}
function openHistoryDatabase() {
  return new Promise((resolve, reject) => {
    const scope = location.protocol === 'file:' ? location.pathname : location.pathname.replace(/[^/]*$/, '');
    const request = indexedDB.open('caitang-project-history-v1:' + scope, 1);
    request.onupgradeneeded = () => {
      for (const name of ['records', 'files', 'state']) {
        request.result.createObjectStore(name, { keyPath: name === 'state' ? 'key' : 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('请关闭其他看板窗口后重试'));
  });
}
async function initializeHistory() {
  try {
    historyDatabase = await openHistoryDatabase();
    const saved = await new Promise((resolve, reject) => {
      const tx = historyDatabase.transaction(['records', 'state'], 'readonly');
      const records = tx.objectStore('records').getAll();
      const current = tx.objectStore('state').get('latest');
      tx.oncomplete = () => resolve({ records: records.result, current: current.result });
      tx.onabort = () => reject(tx.error || new Error('历史记录读取失败'));
    });
    updateHistory = saved.records.sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id));
    if (saved.current && (!window.INITIAL_DATA.baselineRevision || saved.current.snapshot.baselineRevision === window.INITIAL_DATA.baselineRevision)) {
      const restored = cleanSnapshot(saved.current.snapshot);
      validateStages(restored.stages);
      model = parseModel(restored);
      source = restored;
      latestRecordId = saved.current.recordId;
    }
  } catch (error) {
    historyError = '无法读取浏览器保存的记录，请检查浏览器存储权限后刷新。';
  } finally {
    historyLoaded = true;
    render();
  }
}
function storeImport(record, file) {
  if (!historyDatabase || historyError) return Promise.reject(new Error('浏览器存储不可用，请允许网站保存数据后重试'));
  return new Promise((resolve, reject) => {
    let tx;
    try {
      tx = historyDatabase.transaction(['records', 'files', 'state'], 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error || new Error('保存中断'));
      tx.objectStore('records').add(record);
      tx.objectStore('files').add({ id: record.id, blob: file.slice(0, file.size, file.type) });
      tx.objectStore('state').put({ key: 'latest', recordId: record.id, snapshot: record.snapshot });
    } catch (error) {
      if (tx) { try { tx.abort(); } catch {} }
      reject(error);
    }
  });
}
function historyRows() {
  if (!historyLoaded) return '<div class="mini-note" data-history-loading>正在读取更新记录…</div>';
  const records = updateHistory.map(record => `<div class="summary-item history-record" data-record-id="${esc(record.id)}">${icon('file')}<div class="history-info"><strong>${esc(record.name)}</strong><p>${esc(record.time)} · ${record.changes} 项差异 · 报告基准 ${esc(record.asOf)}</p></div><span class="badge ${record.id === latestRecordId ? 'done' : 'pending'}">${record.id === latestRecordId ? '当前版本' : '已归档'}</span><div class="history-actions"><button class="btn" data-history-download="${esc(record.id)}">${icon('download')}下载原文件</button></div></div>`).join('');
  const bundled=window.CURRENT_EXCEL?`<div class="summary-item history-bundled">${icon('file')}<div class="history-info"><strong>${esc(window.CURRENT_EXCEL.name)}</strong><p>项目进度表 · ${window.INITIAL_DATA.sheets[0].sheet} · Excel 原件</p></div><span class="badge ${latestRecordId?'pending':'done'}">${latestRecordId?'已归档':'当前版本'}</span><div class="history-actions"><button class="btn" data-history-download="current-excel">${icon('download')}下载原文件</button></div></div>`:'';
  return records + bundled + `<div class="summary-item history-initial">${icon('file')}<div class="history-info"><strong>${esc(window.ORIGINAL_EXCEL?.name || '初始项目工作计划.xlsx')}</strong><p>初始上传文件 · Excel 原件</p></div><span class="badge pending">初始文件</span><div class="history-actions"><button class="btn" data-history-download="initial">${icon('download')}下载原文件</button></div></div>`;
}
function updates() {
  return header('每周更新，有据可循', `每次确认导入后保存更新记录。报告基准：${source.asOf}`, 'WEEKLY UPDATE') + `<div class="update-grid"><section class="panel"><div class="panel-head"><h2>导入项目数据 <small>DATA IMPORT</small></h2><span class="badge active">浏览器保存</span></div><div class="upload-zone" id="dropZone" tabindex="0" role="button" aria-label="选择或拖入项目数据">${icon('upload')}<h3>将本周文件拖到这里</h3><p>支持原版 Excel、阶段更新 CSV 和导出的 JSON 快照</p><button class="btn primary" data-action="upload">选择文件</button><div style="font-size:10px;color:#a2adc5;margin-top:17px">.xlsx / .csv / .json · 最大 10 MB</div></div><div class="panel-head" style="border-top:1px solid var(--line)"><h2>更新记录 <small>${updateHistory.length+(window.CURRENT_EXCEL?1:0)} 次更新</small></h2><button class="text-btn" data-action="json">导出数据快照</button></div>${historyRows()}${historyError ? `<div class="history-storage-error" role="alert">${esc(historyError)}</div>` : ''}<div class="mini-note">记录与原文件保存在当前浏览器，刷新后可继续查看和下载；清除网站数据或更换浏览器不会保留这些记录。</div></section></div>`;
}
async function downloadHistory(id) {
  try {
    if (id === 'initial' || id === 'current-excel') {
      const original = id === 'initial' ? window.ORIGINAL_EXCEL : window.CURRENT_EXCEL;
      if (!original?.base64) throw new Error('Excel 原件尚未载入，请刷新后重试');
      const bytes = Uint8Array.from(atob(original.base64), char => char.charCodeAt(0));
      return download(bytes, original.name, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
    const record = updateHistory.find(item => item.id === id);
    if (!record) throw new Error('未找到这条更新记录');
    const saved = await new Promise((resolve, reject) => {
      const request = historyDatabase.transaction('files', 'readonly').objectStore('files').get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (!saved?.blob) throw new Error('原文件记录不可用');
    download(saved.blob, record.name, saved.blob.type || 'application/octet-stream');
  } catch (error) { toast('下载失败：' + error.message); }
}
function bindHistory() {
  $$('[data-history-download]').forEach(button => button.onclick = () => downloadHistory(button.dataset.historyDownload));
}
async function applyImport() {
  if (!pendingImport || savingImport) return;
  const asOf = $('#importAsOf').value;
  if (!date(asOf)) return toast('请填写有效的报告基准日期');
  savingImport = true;
  const button = $('#applyImport');
  const controls = [...document.querySelectorAll('#uploadContent button, #uploadContent input')];
  controls.forEach(control => control.disabled = true);
  button.textContent = '正在保存记录…';
  $('#historySaveError')?.remove();
  try {
    await historyReady;
    const snapshot = cleanSnapshot(pendingImport.source);
    snapshot.asOf = asOf;
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: pendingImport.name,
      createdAt: Date.now(), time: new Date().toLocaleString('zh-CN'),
      changes: pendingImport.changes.length, asOf, snapshot
    };
    await storeImport(record, pendingImport.file);
    source = snapshot;
    model = parseModel(source);
    selectedStage=Math.min(selectedStage,model.stages.length-1);planGroup='';query='';collapsedPlanGroups.clear();
    updateHistory.unshift(record);
    latestRecordId = record.id;
    pendingImport = null;
    $('#uploadDialog').close();
    render();
    toast('看板已更新，原文件和历史记录已保存');
  } catch (error) {
    const message = document.createElement('div');
    message.id = 'historySaveError';
    message.className = 'error-box';
    message.setAttribute('role', 'alert');
    message.textContent = (error.name === 'QuotaExceededError' ? '浏览器存储空间不足，请释放空间后重试。' : '记录保存失败，请检查浏览器存储权限后重试。') + '当前看板未更新，原有记录未改变。';
    $('#uploadContent .dialog-body').appendChild(message);
  } finally {
    savingImport = false;
    controls.forEach(control => control.disabled = false);
    button.textContent = '确认更新看板';
  }
}

function bindResults(){}
function bind(){bindHistory();bindPlans();$$('[data-plan]').forEach(el=>el.onclick=()=>showPlan(el.dataset.plan)); $$('[data-week]').forEach(el=>el.onclick=()=>{weekOffset=+el.dataset.week===0?0:weekOffset+(+el.dataset.week);render()}); $$('[data-stage]').forEach(el=>{el.onclick=()=>drill(+el.dataset.stage);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}}});$$('[data-gran]').forEach(el=>el.onclick=()=>{granularity=el.dataset.gran;render()});$$('[data-action]').forEach(el=>el.onclick=e=>{e.stopPropagation();action(el.dataset.action)});bindResults();const z=$('#dropZone');if(z){z.onclick=()=>$('#fileInput').click();z.onkeydown=e=>{if(e.key==='Enter')$('#fileInput').click()};z.ondragover=e=>{e.preventDefault();z.classList.add('dragging')};z.ondragleave=()=>z.classList.remove('dragging');z.ondrop=e=>{e.preventDefault();z.classList.remove('dragging');if(e.dataTransfer.files[0])importFile(e.dataTransfer.files[0])}}}
function action(a){if(a==='upload')$('#fileInput').click();else if(a==='export')exportHTML();else if(a==='print')window.print();else if(a==='allPlans')showAllPlans();else if(a==='runningPlans'){showAllPlans();statusFilter='进行中';render()}else if(a==='json')historyReady.then(()=>download(JSON.stringify(source,null,2),`彩棠项目快照-${source.asOf}.json`,'application/json'));else if(a==='template')download('\ufeff'+['项目阶段,主责部门,计划开始时间,计划结束时间,实际开始时间,实际结束时间,阶段状态',...model.stages.map(s=>[s.name,s.owner,s.start,s.end,s.actualStart,s.actualEnd,s.status].join(','))].join('\r\n'),'总阶段每周更新模板.csv','text/csv;charset=utf-8')}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function exportHTML() {
  await historyReady;
  try {
    let css = window.BUNDLED_CSS, js = window.BUNDLED_JS, html = window.BUNDLED_SHELL;
    if (!css || !js || !html) {
      [css, js, html] = await Promise.all(['style.css', 'app.js', 'index.html'].map(url =>
        fetch(url, { cache: 'no-store' }).then(response => {
          if (!response.ok) throw Error('资源读取失败');
          return response.text();
        })
      ));
    }
    const safe = value => JSON.stringify(value).replaceAll('<', '\\u003c');
    const out = html
      .replace(/<link rel="stylesheet" href="style\.css(?:\?[^\"]*)?">/, () => '<style>' + css + '</style>')
      .replace(/<script src="data\.js(?:\?[^\"]*)?"><\/script>/, () => `<script>window.INITIAL_DATA=${safe(source)};window.BUNDLED_CSS=${safe(css)};window.BUNDLED_JS=${safe(js)};window.BUNDLED_SHELL=${safe(html)};<\/script>`)
      .replace(/<script src="original-excel\.js(?:\?[^\"]*)?"><\/script>/, () => `<script>window.ORIGINAL_EXCEL=${safe(window.ORIGINAL_EXCEL)};window.CURRENT_EXCEL=${safe(window.CURRENT_EXCEL||null)};<\/script>`)
      .replace(/<script src="app\.js(?:\?[^\"]*)?"><\/script>/, () => '<script>' + js.replaceAll('</script', '<\\/script') + '<\/script>');
    download(out, `彩棠项目驾驶舱-${source.asOf}.html`, 'text/html;charset=utf-8');
    toast('已导出，可双击 HTML 文件离线汇报');
  } catch (error) { toast('导出失败：' + error.message); }
}
async function readXlsx(buffer){const bytes=new Uint8Array(buffer),dv=new DataView(buffer),decoder=new TextDecoder();let eoc=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(dv.getUint32(i,true)===0x06054b50){eoc=i;break}}if(eoc<0)throw Error('文件不是有效的 XLSX 压缩格式');let p=dv.getUint32(eoc+16,true),count=dv.getUint16(eoc+10,true),entries=new Map();for(let n=0;n<count;n++){if(dv.getUint32(p,true)!==0x02014b50)throw Error('Excel 文件目录损坏');const method=dv.getUint16(p+10,true),size=dv.getUint32(p+20,true),plain=dv.getUint32(p+24,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),offset=dv.getUint32(p+42,true),name=decoder.decode(bytes.subarray(p+46,p+46+nl));if(plain>30*1024*1024)throw Error('工作表过大，请拆分后导入');entries.set(name,{method,size,offset});p+=46+nl+el+cl}async function get(name){const entry=entries.get(name);if(!entry)return '';let p=entry.offset,start=p+30+dv.getUint16(p+26,true)+dv.getUint16(p+28,true),data=bytes.slice(start,start+entry.size);if(entry.method===8){try{data=window.pako.inflateRaw(data)}catch{throw Error('Excel 文件解压失败，请确认文件完整且未加密')}}else if(entry.method!==0)throw Error('不支持此 Excel 压缩方式');return decoder.decode(data)}function xml(s){const doc=new DOMParser().parseFromString(s,'application/xml');if(doc.getElementsByTagName('parsererror').length)throw Error('Excel XML 数据损坏');return doc}const sharedText=await get('xl/sharedStrings.xml'),shared=sharedText?[...xml(sharedText).getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join('')):[];const wb=xml(await get('xl/workbook.xml')),rels=xml(await get('xl/_rels/workbook.xml.rels')),relMap=new Map([...rels.getElementsByTagName('Relationship')].map(r=>[r.getAttribute('Id'),r.getAttribute('Target')]));let sheets=[];for(const [sheetIndex,s] of [...wb.getElementsByTagName('sheet')].entries()){let name=s.getAttribute('name');if(name!=='项目计划'&&sheetIndex!==0)continue;let target=relMap.get(s.getAttribute('r:id'));if(!target)continue;let path=target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'');const doc=xml(await get(path)),data=[];for(const row of doc.getElementsByTagName('row')){const ri=Number(row.getAttribute('r'))-1;if(ri>10000)throw Error('超出 10000 行限制');let arr=[];for(const c of row.getElementsByTagName('c')){let addr=c.getAttribute('r'),col=0;for(const letter of addr.match(/^[A-Z]+/)[0])col=col*26+letter.charCodeAt(0)-64;let type=c.getAttribute('t'),v=c.getElementsByTagName('v')[0]?.textContent;let value=type==='s'?shared[Number(v)]:type==='inlineStr'?[...c.getElementsByTagName('t')].map(t=>t.textContent).join(''):v==null?null:type==='str'?v:Number.isFinite(Number(v))?Number(v):v;arr[col-1]=value}data[ri]=arr}for(let i=0;i<data.length;i++)if(!data[i])data[i]=[];sheets.push({sheet:name,data})}const selected=selectPlanSheets(sheets);if(!selected.length)throw Error('未识别到项目进度表，请保留名称、主责部门、层级及计划/实际日期等八列表头');for(const sheet of selected){if(!isProgressSheet(sheet)&&(sheet.data[0]?.[0]!=='项目阶段'||sheet.data[0]?.[1]!=='用时'))throw Error('旧版项目计划的表头不匹配')}return selected}
function parseCsv(text){let rows=[],row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(v=>v.trim()))rows.push(row);if(quoted)throw Error('CSV 引号未闭合');return rows}
function validateStages(stages){if(!Array.isArray(stages)||![5,6].includes(stages.length)||stages.some((s,i)=>s.name!==STAGE_NAMES[i]))throw Error('阶段名称和顺序应为启动、规划阶段、调研阶段、详细设计阶段、实施落地阶段、上线试运行（兼容旧版五阶段）');for(const s of stages){if(!s.owner||!date(s.start)||!date(s.end)||date(s.start)>date(s.end))throw Error(s.name+'的主责部门或计划日期无效');if(!['已完成','进行中','待启动','已延期'].includes(status(s.status)))throw Error(s.name+'的阶段状态无效');for(const key of ['actualStart','actualEnd'])if(s[key]&&!date(s[key]))throw Error(s.name+'的实际日期无效');if(s.actualEnd&&s.actualStart&&s.actualEnd<s.actualStart)throw Error(s.name+'的实际结束早于开始')}}
function taskKey(t){return [t.sheet,t.module||t.group||'',t.root||'',t.level||'',t.name].join('|')}
function compare(before,after){let oldItems=before.plans,newItems=after.plans,old=new Map(oldItems.map(t=>[taskKey(t),t])),changes=[];for(const t of newItems){let p=old.get(taskKey(t));if(!p)changes.push({type:'新增',name:t.name});else{let keys=['status','start','end','actualStart','actualEnd','owner','note','output','rawStatus'];let changed=keys.filter(k=>(p[k]||'')!==(t[k]||''));if(changed.length)changes.push({type:'变更',name:t.name,desc:changed.map(k=>({status:'状态',start:'计划开始',end:'计划结束',actualStart:'实际开始',actualEnd:'实际结束',owner:'负责人',note:'备注',output:'产出物',rawStatus:'原始状态'}[k])).join('、')});old.delete(taskKey(t))}}for(const t of old.values())changes.push({type:'移除',name:t.name});after.stages.forEach((s,i)=>{if(JSON.stringify(s)!==JSON.stringify(before.stages[i]))changes.push({type:'阶段更新',name:s.name})});return changes}
async function importFile(file){await historyReady;$('#fileInput').value='';pendingImport=null;$('#uploadContent').innerHTML='<div class="dialog-body"><h2>正在读取本周数据</h2><p>文件只在当前页面解析，请稍候…</p></div>';$('#uploadDialog').showModal();try{if(file.size>10*1024*1024)throw Error('文件超过 10 MB，请精简后上传');let next=structuredClone(source),extension=file.name.split('.').pop().toLowerCase();if(extension==='xlsx'){next.sheets=await readXlsx(await file.arrayBuffer());next.sourceFile=file.name;}else if(extension==='csv'){const rows=parseCsv((await file.text()).replace(/^\ufeff/,'')),expected=['项目阶段','主责部门','计划开始时间','计划结束时间','实际开始时间','实际结束时间','阶段状态'];if(expected.some((h,i)=>rows[0]?.[i]?.trim()!==h))throw Error('CSV 表头不匹配，请按总阶段更新表的列顺序填写');next.stages=rows.slice(1).map(r=>({name:r[0]?.trim(),owner:r[1]?.trim(),start:date(r[2]),end:date(r[3]),actualStart:date(r[4]),actualEnd:date(r[5]),status:r[6]?.trim()}))}else if(extension==='json'){next=JSON.parse(await file.text());if(!Array.isArray(next.sheets)||next.sheets.some(s=>!Array.isArray(s.data)))throw Error('JSON 不是有效的看板数据快照')}else throw Error('请上传 .xlsx、.csv 或 .json 文件');next.sheets=selectPlanSheets(next.sheets);if(!next.sheets.length)throw Error('快照中缺少项目进度表');next.baselineRevision=window.INITIAL_DATA.baselineRevision;if(next.sheets.some(isProgressSheet)){if(extension==='csv'){const stageRows=next.sheets[0].data.filter(r=>r[2]==='阶段');if(stageRows.length!==next.stages.length)throw Error('CSV 阶段数量应与当前进度表一致');stageRows.forEach((r,i)=>{const st=next.stages[i];if(st.name!==r[0])throw Error('CSV 阶段顺序不匹配');r[1]=st.owner;r[3]=st.start;r[4]=st.end;r[5]=st.actualStart||'/';r[6]=st.actualEnd||'/';r[7]=st.status})}next.stages=parseProgress(next).stages}validateStages(next.stages);next.stages=next.stages.map(s=>({...s,start:date(s.start),end:date(s.end),actualStart:date(s.actualStart),actualEnd:date(s.actualEnd)}));let nm=parseModel(next),changes=compare(model,nm);pendingImport={source:next,model:nm,changes,name:file.name,file};$('#uploadContent').innerHTML=`<div class="drawer-header"><span>更新预览 / ${esc(file.name)}</span><button class="icon-btn" data-close="uploadDialog" aria-label="关闭更新预览">${icon('close')}</button></div><div class="dialog-body"><h2>本周数据已准备就绪</h2><p>确认变更后更新当前看板。Excel 按表头读取项目进度表，保留原表层级、日期与状态。</p><div class="preview-stats"><div><b>${nm.nodes?.length||nm.plans.length}</b><small>原表记录</small></div><div><b>${nm.stages.length}</b><small>总管理阶段</small></div><div><b>${changes.length}</b><small>检测到的差异</small></div></div><label style="font-size:12px;color:#7b89a7">报告基准日期 <input class="date-input" id="importAsOf" type="date" value="${esc(date(next.asOf)||source.asOf)}"></label><p>报告基准记录本次数据的截止日期；甘特图的今天标线按北京时间自动更新。</p><div class="diff-list">${changes.length?changes.slice(0,100).map(c=>`<div class="diff-row"><span class="badge ${c.type==='移除'?'late':'active'}">${c.type}</span> ${esc(c.name)}${c.desc?'<small style="color:#9aa6bd"> · '+esc(c.desc)+'</small>':''}</div>`).join(''):'<div class="diff-row">与当前数据一致，未发现任务字段变化。</div>'}</div>${changes.length>100?'<p>仅展示前 100 项差异，应用时包含全部变更。</p>':''}</div><div class="dialog-actions"><button class="btn" data-close="uploadDialog">取消</button><button class="btn primary" id="applyImport">确认更新看板</button></div>`;$$('[data-close="uploadDialog"]').forEach(b=>b.onclick=()=>$('#uploadDialog').close());$('#applyImport').onclick=applyImport}catch(e){$('#uploadContent').innerHTML=`<div class="dialog-body"><h2>暂时无法导入</h2><div class="error-box">${esc(e.message)}</div><p>当前看板数据未发生改变。</p></div><div class="dialog-actions"><button class="btn" id="closeImportError">关闭</button><button class="btn primary" id="retryImport">重新选择文件</button></div>`;$('#closeImportError').onclick=()=>$('#uploadDialog').close();$('#retryImport').onclick=()=>{$('#uploadDialog').close();$('#fileInput').click()}}}
$$('.nav').forEach(b=>b.onclick=()=>b.dataset.view==='detail'?showAllPlans():go(b.dataset.view));$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('当前窗口不支持全屏，可在浏览器中按 F11')}};$('#fileInput').onchange=e=>{if(e.target.files[0])importFile(e.target.files[0])};$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){if(savingImport)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));render();historyReady=initializeHistory();
scheduleDayRefresh();
window.addEventListener('focus', refreshCurrentDay);
window.addEventListener('resize', positionGanttLabels);
window.addEventListener('pageshow', refreshCurrentDay);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshCurrentDay(); });
$('#uploadDialog').addEventListener('cancel',e=>{if(savingImport)e.preventDefault()});
if(document.modelContext?.registerTool){const life=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'read_project_snapshot',title:'读取项目快照',description:'读取当前彩棠看板的阶段和任务记录数，不修改数据。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){if(!input||Object.keys(input).length)throw Error('不接受参数');return {asOf:source.asOf,stages:model.stages,planRecords:model.plans.length,planItems:planRows().filter(p=>p.leaf).length,sourceSheet:model.sheet||'项目计划'}}},{signal:life.signal})).catch(()=>{});window.addEventListener('pagehide',()=>life.abort(),{once:true})}catch{}}
