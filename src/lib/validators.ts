function validateEmail(value: string) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(value);
}

export const email = (message: string | boolean = true) => (value: string) => {
    if (!validateEmail(value)) {
        return message;
    }
    return false;
};

export const number = (message: string | boolean = true) => (value: string) => {
    if (!Number(value)) {
        return message;
    }
    return false;
};

export const required = (message: string | boolean = true) => (value: string) => {
    if (!value) {
        return message;
    }
    return false;
};

export const length = (message: string | boolean = true, options = { min: 1, max: 9 }) => (value: string) => {
    const valueLength = value.length;
    const { min, max } = options;
    if (valueLength < min || valueLength > max) {
        return message;
    }
    return false;
};

export default {
    email,
    number,
    required,
    length,
};