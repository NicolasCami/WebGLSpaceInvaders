/**
 * Return a random element of an array.
 * @param  {any[]} arr The array.
 * @return {any}       A random element of the array.
 */
function randFromArray(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}
// polyfill
if (!Date.now) {
    Date.now = function () { return new Date().getTime(); };
}

//# sourceMappingURL=functions.js.map
