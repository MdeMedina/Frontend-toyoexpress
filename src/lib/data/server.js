const backendUrl = () => {
  return process.env.REACT_APP_BACKEND;
};

const frontUrl = () => {
  return process.env.REACT_APP_FRONTEND;
};

module.exports = {
  backendUrl,
  frontUrl,
};
