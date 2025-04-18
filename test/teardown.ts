module.exports = async () => {
  if (global.app) {
    await global.app.close();
  }
}; 