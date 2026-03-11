const express = require('express');
const router = express.Router();
const { createUser, getUsers, userInfo, createRole, signIn, getUserAccess, updateUserProfileImage, addTeamMember,
  getMyTeam, deleteAllUsers
 } = require('../controllers/Usercontroller');
const { sendOtp, verifyOtp } = require('../controllers/Otpcontroller');
const authMiddleware = require('../controllers/authMiddleware');
const upload = require('../controllers/image');

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Sign In
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: string
 *               password:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Login successful
 */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Sign In
 *     tags: [Users]
 */
router.post('/login', signIn);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/add-team-member:
 *   post:
 *     summary: Add team member using team code
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *               - address
 *               - teamCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: string
 *               email:
 *                 type: string
 *                 example: string
 *               mobile:
 *                 type: string
 *                 example: string
 *               password:
 *                 type: string
 *                 example: string
 *               address:
 *                 type: string
 *                 example: string
 *               teamCode:
 *                 type: string
 *                 example: string
 *     responses:
 *       201:
 *         description: Team member added successfully
 *       400:
 *         description: Email already exists
 *       404:
 *         description: Invalid team code
 */
router.post('/add-team-member', authMiddleware, addTeamMember);

/**
 * @swagger
 * /api/users/my-team:
 *   get:
 *     summary: Get team members of logged-in admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of team members
 */
router.get('/my-team', authMiddleware, getMyTeam);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/delete-all:
 *   delete:
 *     summary: Delete all users
 *     description: Remove all users from the database (Admin + Team Members)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/delete-all', deleteAllUsers);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authMiddleware, getUsers);


/**
 * @swagger
 * /api/users/info:
 *   get:
 *     summary: Get user info by userId
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information
 */
router.get('/info', authMiddleware, userInfo);

/**
 * @swagger
 * /api/users/profile-pic:
 *   put:
 *     summary: Upload user profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 */
router.put(
  '/profile-pic',
  authMiddleware,
  upload.single('profilePic'),
  updateUserProfileImage
);

/**
 * @swagger
 * /api/users/roles:
 *   post:
 *     summary: Create dynamic role and assign permissions to users
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - emails
 *               - permissions
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: Admin
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - pavankumarp3699@gmail.com
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - edit_access
 *     responses:
 *       201:
 *         description: Role created and assigned successfully
 *       400:
 *         description: Role already exists or invalid data
 *       500:
 *         description: Server error
 */
router.post('/roles', authMiddleware, createRole);


/**
 * @swagger
 * /api/users/user-access/{email}:
 *   get:
 *     summary: Get user role and permissions
 *     description: Returns the role and permissions assigned to a user based on their email.
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user
 *         schema:
 *           type: string
 *           example: pavankumarp3699@gmail.com
 *     responses:
 *       200:
 *         description: User role and permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: pavankumarp3699@gmail.com
 *                 role:
 *                   type: string
 *                   example: Admin
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - edit_access
 *                     - delete_access
 *       404:
 *         description: User role not found
 *         content:
 *           application/json:
 *             example:
 *               message: User has no role assigned
 *       500:
 *         description: Internal server error
 */
router.get('/user-access/:email',authMiddleware, getUserAccess);


/**
 * @swagger
 * /api/otp/send-otp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/send-otp', sendOtp);


/**
 * @swagger
 * /api/otp/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verify-otp', verifyOtp);


module.exports = router;