/**
 * Representa los datos de respuesta al obtener un captcha.
 */
interface ViewCaptchaResponseData {
  /**
   * Código numérico de la respuesta.
   */
  codigorespuesta: number;
  /**
   * Descripción textual de la respuesta.
   */
  glosarespuesta: string;
  /**
   * Imagen del captcha (actualmente no se utiliza, por eso es null).
   */
  imgCaptcha: null;
  /**
   * Texto del captcha en base64.
   */
  txtCaptcha: string;
  /**
   * Largo del captcha (actualmente no se utiliza, por eso es null).
   */
  largoCaptcha: null;
  /**
   * Indica si el captcha es válido o no (por alguna razon siempre retorna false).
   */
  validez: boolean;
}

/**
 * Representa los datos del captcha utilizados en la aplicación.
 */
export interface Captcha {
  /**
   * Texto del captcha en base64.
   */
  txtCaptcha: string;
  /**
   * Texto del código del captcha resuelto.
   */
  txtCode: string;
}

/**
 * Obtiene un captcha desde el servidor del SII.
 *
 * Realiza una solicitud POST al servidor del SII para obtener los datos de un captcha,
 * luego extrae el código del texto decodificado.
 *
 * @returns {Promise<Captcha>} Una promesa que resuelve a un objeto `Captcha` con el texto del captcha y un código extraído.
 */
export async function getCaptcha(): Promise<Captcha> {
  const url = 'https://zeus.sii.cl/cvc_cgi/stc/CViewCaptcha.cgi';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      oper: '0',
    }),
  };

  const response = await fetch(url, options);

  // Verifica si la respuesta es exitosa
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as ViewCaptchaResponseData;

  // Extrae el texto en base64 del captcha de los datos de respuesta
  const txtCaptcha = data.txtCaptcha;

  // Decodifica el texto del captcha de base64 a utf-8
  const decodedTxtCaptcha = Buffer.from(txtCaptcha, 'base64').toString('utf-8');

  // El código de resolución del captcha se encuentra en los caracteres 36 a 40 del texto decodificado
  const txtCode = decodedTxtCaptcha.slice(36, 40);

  return {
    txtCaptcha,
    txtCode,
  };
}
