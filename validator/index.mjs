export class Validator {
    static validate(data, schema) {
        let props = Object.keys(schema);
        return props.every(prop => {
            let isValid = true;
            if (typeof data[prop] === 'object') {
                isValid = Validator.validate(data[prop], schema[prop])
            } else if (!data[prop]) {
                if (!(schema[prop].optional)) {
                    isValid = false;
                    throw new Error(`Data missing required ${prop} property`)
                }
            } else if (data[prop]) {
                if (!(typeof data[prop] === schema[prop].type)) {
                    isValid = false;
                    throw new Error(`${prop} property should be type of ${schema[prop].type}`)
                }
            }
            return isValid;
        })
    }
}
