const router            = express.Router();
const Admin             = require('../route-handler/admin');
const validate          = require('../validation/admin');
const Token             = require('../lib/token.js')

router.use(express.json());

router.post('/login',validate.validateLogin,Admin.login);

router.post('/assign/driver',Token.accessToken,Admin.assignDriver);

module.exports = router;