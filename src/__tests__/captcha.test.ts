import { getCaptcha, Captcha } from '../captcha';

describe('Obtiene el captcha de SII', () => {
    let captcha: Captcha;

    beforeAll(async () => {
        captcha = await getCaptcha();
    });

    test('Captcha está definido', () => {
        expect(captcha).toBeDefined();
    });

    test('Captcha no está vacío', () => {
        expect(captcha.txtCaptcha.length).not.toBe(0);
        expect(captcha.txtCode.length).not.toBe(0);
    });

    test('Captcha contiene txtCaptcha y txtCode', () => {
        expect(captcha.txtCaptcha).toBeDefined();
        expect(captcha.txtCode).toBeDefined();
    });

    test('txtCaptcha y txtCode son strings', () => {
        expect(typeof captcha.txtCaptcha).toBe('string');
        expect(typeof captcha.txtCode).toBe('string');
    });

    test('txtCaptcha y txtCode no están vacíos', () => {
        expect(captcha.txtCaptcha.length).not.toBe(0);
        expect(captcha.txtCode.length).not.toBe(0);
    });
});
