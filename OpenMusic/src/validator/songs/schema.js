const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title:
    Joi.string()
      .required(),
  year:
    Joi.number()
      .min(1900)
      .max(2030)
      .required(),
  performer:
    Joi.string()
      .required(),
  genre:
    Joi.string()
      .required(),
  duration:
    Joi.number()
      .required(),
});

module.exports = { SongPayloadSchema };
