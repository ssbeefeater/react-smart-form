// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

export const email = (message = true) => (value) => {
    if (!validateEmail(value)) {
        return message;
    }
    return false;
};

export const number = (message = true) => (value) => {
    if (!Number(value)) {
        return message;
    }
    return false;
};

export const required = (message = true) => (value) => {
    if (!value) {
        return message;
    }
    return false;
};

export const length = (message = true, options = { min: 1, max: 9 }) => (value) => {
    const valueLength = value.length;
    const { min, max } = options;
    if (valueLength < min || valueLength > max) {
        return message;
    }
    return false;
};

export default {
    email,
    required,
    length,
};
