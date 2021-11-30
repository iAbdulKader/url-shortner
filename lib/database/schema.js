const yup = require("yup");

const schema = yup.object().shape({
  slug: yup.string().trim().matches(/^([a-zA-Z0-9-_])*[^\s]\1*$/i),
  url: yup.string().trim().matches(/[(http(s)?):\/\/)?(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig),
})

export default schema;