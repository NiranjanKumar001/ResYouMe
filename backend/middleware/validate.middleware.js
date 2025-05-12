//USED FOR VALIDATING THE INPUT GIVEN BY USER TO THE SCHEMA THAT WE MADE THIS IS A FUNCTION
const { ZodError } = require('zod');
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ 
        status: 'error', 
        message: 'Validation failed',
        errors: formattedErrors 
      });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports={validate}