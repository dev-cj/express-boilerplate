const { user_req_body } = require('./../allowed_config/')

const validateReq = {
  register: user_req_body.register_body_array,
  login: user_req_body.login_body_array,

  update_user_profile: user_req_body.update_user_profile,
}

module.exports = validateReq
