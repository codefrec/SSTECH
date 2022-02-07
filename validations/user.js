const Joi = require("joi");
const mongoose = require("mongoose");
module.exports.validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};
module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.query.id))
    return res.status(400).send("Invalid Id Format");

  next();
};
