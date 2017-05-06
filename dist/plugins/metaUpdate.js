"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var metaUpdate = function metaUpdate(meta) {
  if (meta) {
    var title = meta.title,
        description = meta.description;

    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute("content", description);
  }
};

exports.default = metaUpdate;