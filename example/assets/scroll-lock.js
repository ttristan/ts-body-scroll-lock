
const lockBodyScroll = (container) => {
  getSystemJsModule("lockBodyScroll").then((module) => {
    module(container);
  });
};

const removeScrollLock = (container) => {
  getSystemJsModule("removeScrollLock").then((module) => {
    module(container);
  });
};

const useBodyScrollLock = (id, container, content) => {
  getSystemJsModule("useBodyScrollLock").then((_useBodyScrollLock) => {
    _useBodyScrollLock(id, container, content);
  });
};

const getSystemJsModule = (moduleName = "default") => {
  return System.import("../dist/browser/systemjs-bundle.js")
    .then((bundle) => {
      return bundle[moduleName];
    })
    .catch(console.error.bind(console));
};
