// Production uses an in-browser plan and a prefilled email packet until a verified
// storage endpoint exists.
window.MCPScanQuizConfig = {
 endpoint: ['127.0.0.1','localhost'].includes(location.hostname) ? '/api/quiz' : null,
 headers: {}
};
