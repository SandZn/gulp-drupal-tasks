/**
 * Loop through an array of asset package objects, merging the source definitions
 * into a single glob.
 *
 * @param packs
 */
module.exports = function(packs) {
  return packs.reduce(function (out, item) {
    return out.concat(item.src);
  }, []);
};
