const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { mailVerify } = require('../../util/verify-mail');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find().sort({ createdAt: -1 });
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },

    },
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, { registerInput: { username, email, password, confirmPassword,
            role, isVerified, verifyToken } },
            context,
            info) {
            
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username });
            password = await bcrypt.hash(password, 12);
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                role,
                isVerified,
                verifyToken
            });
            const res = await newUser.save();
            const token = generateToken(res);
            //mailVerify(username, token);
            return {
                ...res._doc,
                id: res._id,
                token
            };
        },

    }
}