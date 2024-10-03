//userModel.js
import { DataTypes, Op } from 'sequelize';
import postgresConnection from '../config/databases/postgreconn.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const User = postgresConnection.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail:true
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    google_auth_id: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    last_login: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

User.beforeCreate(async (user) => {
    if (user.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        } catch (error) {
            throw new Error("Error hashing password");
        }
    }
});

User.prototype.getJWTToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

User.prototype.comparePassword = async function (enteredPassword) {
    if (!this.password) return false; // In case it's a Google Auth user without a password
    return await bcrypt.compare(enteredPassword, this.password);
};

User.isEmailTaken = async function (email, excludeUserId = null) {
    const user = await this.findOne({
        where: { email, ...(excludeUserId && { id: { [Op.ne]: excludeUserId } }) },
    });
    return !!user;
};

export default User;
