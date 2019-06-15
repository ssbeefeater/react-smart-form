import removeEmptyValues from '../../src/lib/utils/removeEmptyValues';

describe('removeEmptyValues', () => {
    test('expect the correct value', () => {
        expect(removeEmptyValues({
            val0: { a: null },
            val1: '',
            val2: { a: { a: null, b: { a: null } }, c: {} },
            val4: [null, 1, 2, null, { a: 0, b: 1, c: { a: null, b: { a: null, b: '', c: undefined, d: '1' } } }],
        })).toEqual({ 'val4': [1, 2, { a: 0, 'b': 1, 'c': { 'b': { 'd': '1' } } }] });
    });
});
