import apiError from "./apiError.js";

const AsyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export default AsyncHandler;
