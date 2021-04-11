import {Roles} from "../model/class";

const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

export function generateUuid() {
    return uuid.v4();
}

export const auth = (req, res, next) => {
    jwt.verify(req.headers['authorization'], process.env.JWT_SECRET, (err, decoded) => {
        if (err) res.status(401).json({message: 'Unauthorized'});
        else {
            req.user = decoded;
            next();
        }
    });
};

export const authOptional = (req, res, next) => {
    req.headers['authorization'] ?
        jwt.verify(req.headers['authorization'], process.env.JWT_SECRET, (err, decoded) => {
            req.user = !err ? decoded : null;
            next();
        }) : next();
};

export async function getJwt(data: any) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, process.env.JWT_SECRET, (err, token) => {
            err ? reject(err) : resolve(token)
        });
    });
}

export function createUserGetType(type) {
    switch (type) {
        case Roles.SuperAdmin:
            return Roles.Admin;
        case Roles.Admin:
            return Roles.PartnerAdmin;
        case Roles.PartnerAdmin:
            return Roles.PartnerUser;
        default:
            return -1;
    }
}

export function validatePrivilegies(allowed) {
    return (req, res, next) => {
        let type = req.user.UserType;
        let canAccess = allowed.indexOf(type) !== -1;
        if (!canAccess) {
            res.status(401).json({message: "You do not have privilege to access this endpoint."})
        } else {
            next();
        }
    }
}

export function serialize(obj, from): any {
    let serializedObj = {};
    Object.keys(from).forEach(x => {
        serializedObj[x] = obj[x]
    });
    return serializedObj;
}

export function _sendSMS(phoneNumber, content) {
    return axios.post('http://services.vertex.com.mk:3800/api/sms/send/', {
        "CompanyName": "Компанија Боранија",
        "CompanyId": "NEMAUSER",
        "CompanyExtension": "001",
        "UserName": "VmVycFNtc0FkbWlu",
        "Password": "cTc1Y1U0WnZUZmViSHVWRw==",
        "SmsMessages": [{"Message": content, "Phones": phoneNumber}],
        "WorkingYear": 2020
    })
}
