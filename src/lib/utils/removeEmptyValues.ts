


// removes undefined null and '' values recursively
const removeEmptyValues = (val: any): any => {
    if (!val && typeof val !== 'number' && typeof val !== 'boolean') {
        return;
    }
    if (typeof val !== 'object') {
        return val;
    }
    if (Array.isArray(val)) {
        const newVal = val.map(removeEmptyValues).filter(value => !!value);
        return newVal.length > 0 ? newVal : undefined;
    }
    const newVal = Object.keys(val).reduce((accum: any, key: string) => {
        const newVal = removeEmptyValues(val[key]);
        if (newVal || newVal === 0) {
            accum[key] = newVal;
        }
        return accum;
    }, {});
    return Object.keys(newVal).length > 0 ? newVal : undefined;
};

export default removeEmptyValues;

