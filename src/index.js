import path from 'path';
import { stringifyRequest } from 'loader-utils';

module.exports = function loader() {};
module.exports.pitch = function pitch(remainingRequest) {
  if (this.cacheable) {
    this.cacheable();
  }

  const addCssPath = path.join(__dirname, './addCss.js');
  return `
    var content = require(${stringifyRequest(this, `!!${remainingRequest}`)});
    var addCss = require(${stringifyRequest(this, `!${addCssPath}`)});

    if (typeof content === 'string') {
      content = [[module.id, content, '']];
    }

    module.exports = content.locals || {};
    module.exports._getContent = function() { return content; };
    module.exports._getCss = function() { return content.toString(); };
    module.exports._getCssByIds = addCss.getCssByIds

    // Add CSS by import order
    addCss(content)
  `;
};
