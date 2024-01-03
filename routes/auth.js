import { Router } from 'express';
import { allUsers, login, profile, signup } from '../controllers/auth.js';
import validate from '../middlewares/validate.js';
import { signupValidation } from '../validations/authValidation.js';
import { isAuth } from '../middlewares/isAuth.js';
const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users/:userId', isAuth, allUsers);

export default router;
