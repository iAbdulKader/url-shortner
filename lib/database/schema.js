const yup = require("yup");

const schema = yup.object().shape({
  slug: yup.string().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
})

export default schema;