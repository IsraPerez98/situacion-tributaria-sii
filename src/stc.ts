import { getCaptcha } from './captcha';

/**
 * Obtiene la situacion tributaria desde el SII.
 *
 *
 * @param {string} rut - El RUT del contribuyente sin dígito verificador.
 * @param {string} dv - El dígito verificador del RUT.
 * @returns {Promise<string>} Una promesa que resuelve a un string con el HTML de la página de la situación tributaria.
 */
export async function getStc(rut: string, dv: string): Promise<string> {
  // Obtiene un captcha válido para la solicitud
  const captcha = await getCaptcha();

  // URL del servicio del SII para obtener la situación tributaria
  const url = 'https://zeus.sii.cl/cvc_cgi/stc/getstc';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      RUT: rut, // RUT del contribuyente
      DV: dv, // Dígito verificador del RUT
      PRG: 'STC',
      OPC: 'NOR',
      txt_code: captcha.txtCode, // Código del captcha resuelto
      txt_captcha: captcha.txtCaptcha, // Texto del captcha en base64
    }),
  };

  const response = await fetch(url, options);

  // Verifica si la respuesta es exitosa
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text();
}
