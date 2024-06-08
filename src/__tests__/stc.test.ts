import { getStc } from "../stc";

describe('Carga la página correspondiente a STC', () => {
    let stc: string;

    beforeAll(async () => {
        stc = await getStc('76795561', '8');
    });

    test('STC está definido', () => {
        expect(stc).toBeDefined();
    });

    test('STC no está vacío', () => {
        expect(stc.length).not.toBe(0);
    });

    test('STC contiene HAULMER', () => {
        expect(stc).toContain('HAULMER');
    });
});
