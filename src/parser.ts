import { HTMLElement, parse } from 'node-html-parser';

import { getStc } from './stc';

/**
 * Representa la situación tributaria de una entidad.
 */
export interface SituacionTributaria {
  /**
   * RUT de la entidad.
   */
  rut: string;
  /**
   * Razón social de la entidad.
   */
  razonSocial: string;
  /**
   * Indica si la entidad ha iniciado actividades.
   */
  inicioActividades: boolean;
  /**
   * Fecha de inicio de actividades, si aplica.
   */
  fechaInicioActividades?: Date;
  /**
   * Indica si la entidad está autorizada para operar en moneda extranjera.
   */
  autorizadoMonedaExtranjera: boolean;
  /**
   * Indica si la entidad es considerada de menor tamaño.
   */
  empresaMenor: boolean;
  /**
   * Lista de actividades económicas de la entidad.
   */
  actividades: Actividad[];
  /**
   * Documentos autorizados para uso en formato no electrónico.
   */
  documentosAutorizadosFormatoNoElectronico: DocumentoAutorizadoFormatoNoEletronico[];
  /**
   * Documentos con ultimo año de timbraje.
   */
  documentosTimbrados: DocumentoTimbrado[];
}

/**
 * Representa una actividad económica.
 */
export interface Actividad {
  /**
   * Descripción del giro de la actividad.
   */
  giro: string;
  /**
   * Código de la actividad.
   */
  codigo: number;
  /**
   * Categoría tributaria de la actividad.
   */
  categoria: number;
  /**
   * Indica si la actividad está afecta a impuestos.
   */
  afecta: boolean;
  /**
   * Fecha de inicio de la actividad.
   */
  fecha: Date;
}

/**
 * Documento autorizado para uso en formato no electrónico.
 */
export interface DocumentoAutorizadoFormatoNoEletronico {
  /**
   * Fecha desde la cual el documento está autorizado.
   */
  desde: Date;
  /**
   * Fecha hasta la cual el documento está autorizado.
   */
  hasta: Date;
  /**
   * Tipo de documento autorizado.
   */
  documento: string;
}

/**
 * Representa un documento con timbraje vigente.
 */
export interface DocumentoTimbrado {
  /**
   * Tipo de documento.
   */
  documento: string;
  /**
   * Año del último timbraje realizado.
   */
  ultimoTimbrajeYear: number;
}

/**
 * Convierte una cadena de texto que representa una fecha en el formato "dd-mm-yyyy" a un objeto Date.
 *
 * @param {string} dateString - La cadena de texto que representa la fecha en el formato "dd-mm-yyyy".
 * @returns {Date} Un objeto Date que representa la fecha especificada.
 */
function toDate(dateString: string): Date {
  const [day, month, year] = dateString.split('-');

  return new Date(`${year}-${month}-${day}`);
}

/**
 * Obtiene la razón social del contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará la razón social.
 * @returns {string} La razón social extraída del elemento encontrado.
 * @throws {Error} Lanza un error si no se encuentra el elemento con la razón social.
 */
function getRazonSocial(contenedorElement: HTMLElement): string {
  const razonSocialElement = contenedorElement.querySelector('div:nth-child(4)');

  if (!razonSocialElement) {
    throw new Error('No se encontró la razón social');
  }

  return razonSocialElement.text.trim();
}

/**
 * Determina si un contribuyente ha iniciado actividades según la información encontrada en un elemento contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará la información de inicio de actividades.
 * @returns {boolean} `true` si el contribuyente ha iniciado actividades, de lo contrario `false`.
 * @throws {Error} Lanza un error si no se encuentra el elemento con la información de inicio de actividades.
 */
function getInicioActividades(contenedorElement: HTMLElement): boolean {
  const inicioActividadesElement = contenedorElement.querySelectorAll('span').find((element) => {
    return element.text.includes('Contribuyente presenta Inicio de Actividades');
  });

  if (!inicioActividadesElement) {
    throw new Error('No se encontró el inicio de actividades');
  }

  return inicioActividadesElement.text.trim() === 'Contribuyente presenta Inicio de Actividades: SI';
}

/**
 * Obtiene la fecha de inicio de actividades de un contribuyente a partir de un elemento contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará la fecha de inicio de actividades.
 * @returns {Date | null} Un objeto `Date` que representa la fecha de inicio de actividades si se encuentra, de lo contrario `null`.
 */
function getFechaInicioActividades(contenedorElement: HTMLElement): Date | null {
  const fechaInicioActividadesElement = contenedorElement.querySelectorAll('span').find((element) => {
    return element.text.includes('Fecha de Inicio de Actividades');
  });

  if (!fechaInicioActividadesElement) {
    // No se encontró la fecha de inicio de actividades
    return null;
  }

  const dateStr = fechaInicioActividadesElement.text.replace('Fecha de Inicio de Actividades:', '').trim();

  return toDate(dateStr);
}

/**
 * Determina si un contribuyente está autorizado para declarar y pagar impuestos en moneda extranjera.
 *
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará la información de autorización.
 * @returns {boolean} `true` si el contribuyente está autorizado para manejar impuestos en moneda extranjera, de lo contrario `false`.
 * @throws {Error} Lanza un error si no se encuentra el elemento con la información de autorización para moneda extranjera.
 */
function getAutorizadoMonedaExtranjera(contenedorElement: HTMLElement): boolean {
  const autorizadoMonedaExtranjeraElement = contenedorElement.querySelectorAll('span').find((element) => {
    return element.text.includes('Contribuyente autorizado para declarar y pagar sus impuestos en moneda extranjera');
  });

  if (!autorizadoMonedaExtranjeraElement) {
    throw new Error('No se encontró el campo de autorización para moneda extranjera');
  }

  return (
    autorizadoMonedaExtranjeraElement.text.trim() !==
    'Contribuyente autorizado para declarar y pagar sus impuestos en moneda extranjera: NO'
  );
}

/**
 * Determina si un contribuyente es considerado como Empresa de Menor Tamaño.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará la información.
 * @returns {boolean} `true` si el contribuyente es considerado como Empresa de Menor Tamaño, 'false' en caso contrario.
 * @throws {Error} Lanza un error si no se encuentra el elemento con la información de Empresa de Menor Tamaño.
 */
function getEmpresaMenorTamaño(contenedorElement: HTMLElement): boolean {
  const empresaMenorTamañoElement = contenedorElement.querySelectorAll('span').find((element) => {
    return element.text.includes('Contribuyente es Empresa de Menor');
  });

  if (!empresaMenorTamañoElement) {
    throw new Error('No se encontró el campo de empresa de menor tamaño');
  }

  const empresaMenorTamañoWords = empresaMenorTamañoElement.text.split(' ');

  return empresaMenorTamañoWords[empresaMenorTamañoWords.length - 1] === 'SI';
}

/**
 * Extrae la lista de actividades económicas de un contribuyente desde un elemento contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará y extraerá la información de actividades económicas.
 * @returns {Actividad[]} Un arreglo de objetos `Actividad` que representan las actividades económicas del contribuyente.
 * @throws {Error} Lanza un error si no se encuentra la tabla de actividades o si falta información en alguna de las filas.
 */
function getActividades(contenedorElement: HTMLElement): Actividad[] {
  const actividadesTablaElement = contenedorElement.querySelectorAll('table.tabla').find((element) => {
    return element.text.includes('Actividades');
  });

  if (!actividadesTablaElement) {
    //throw new Error('No se encontró la tabla de actividades');
    return [];
  }

  const actividadesRowsElements = actividadesTablaElement.querySelectorAll('tr');

  if (!actividadesRowsElements) {
    //throw new Error('No se encontraron las filas de actividades');
    return [];
  }

  const actividades: Actividad[] = [];

  for (let rowIndex = 1; rowIndex < actividadesRowsElements.length; rowIndex++) {
    const rowElement = actividadesRowsElements[rowIndex];

    const columnsElements = rowElement.querySelectorAll('td');

    if (!columnsElements) {
      //throw new Error('No se encontraron las columnas de la fila de actividades');
      return [];
    }

    const giro = columnsElements[0].text.trim();
    const codigo = parseInt(columnsElements[1].text.trim());
    const categoria = columnsElements[2].text.trim() === 'Primera' ? 1 : 2;
    const afecta = columnsElements[3].text.trim() === 'Si';
    const fecha = toDate(columnsElements[4].text.trim());

    actividades.push({ giro, codigo, categoria, afecta, fecha });
  }

  return actividades;
}

/**
 * Extrae una lista de documentos autorizados para emitir en formato no electrónico desde un elemento contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará y extraerá la información de documentos autorizados.
 * @returns {DocumentoAutorizadoFormatoNoElectronico[]} Un arreglo de objetos `DocumentoAutorizadoFormatoNoElectronico` que representan los documentos autorizados para emitir en formato no electrónico.
 */
function getDocumentosAutorizadosFormatoNoElectronico(
  contenedorElement: HTMLElement,
): DocumentoAutorizadoFormatoNoEletronico[] {
  const documentosAutorizadosFormatoNoElectronicoTablaElement = contenedorElement
    .querySelectorAll('table.tabla')
    .find((element) => {
      return element.text.includes('Documentos autorizados en formato no electrónico');
    });

  if (!documentosAutorizadosFormatoNoElectronicoTablaElement) {
    return [];
  }

  const documentosAutorizadosFormatoNoElectronicoRowsElements =
    documentosAutorizadosFormatoNoElectronicoTablaElement.querySelectorAll('tr');

  if (
    !documentosAutorizadosFormatoNoElectronicoRowsElements ||
    documentosAutorizadosFormatoNoElectronicoRowsElements.length < 2
  ) {
    return [];
  }

  const documentosAutorizadosFormatoNoElectronico: DocumentoAutorizadoFormatoNoEletronico[] = [];

  for (let rowIndex = 1; rowIndex < documentosAutorizadosFormatoNoElectronicoRowsElements.length; rowIndex++) {
    const rowElement = documentosAutorizadosFormatoNoElectronicoRowsElements[rowIndex];

    const columnsElements = rowElement.querySelectorAll('td');

    if (!columnsElements) {
      return [];
    }

    const desde = toDate(columnsElements[0].text.trim());
    const hasta = toDate(columnsElements[1].text.trim());
    const documento = columnsElements[2].text.trim();

    documentosAutorizadosFormatoNoElectronico.push({ desde, hasta, documento });
  }

  return documentosAutorizadosFormatoNoElectronico;
}

/**
 * Extrae una lista de documentos timbrados desde un elemento contenedor HTML.
 *
 * @param {HTMLElement} contenedorElement - El elemento contenedor HTML donde se buscará y extraerá la información de documentos timbrados.
 * @returns {DocumentoTimbrado[]} Un arreglo de objetos `DocumentoTimbrado` que representan los documentos timbrados encontrados.
 */
function getDocumentosTimbrados(contenedorElement: HTMLElement): DocumentoTimbrado[] {
  const documentosTimbradosTablaElement = contenedorElement.querySelectorAll('table.tabla').find((element) => {
    return element.text.includes('Año último timbraje');
  });

  if (!documentosTimbradosTablaElement) {
    return [];
  }

  const documentosTimbradosRowsElements = documentosTimbradosTablaElement.querySelectorAll('tr');

  if (!documentosTimbradosRowsElements || documentosTimbradosRowsElements.length < 2) {
    return [];
  }

  const documentosTimbrados: DocumentoTimbrado[] = [];

  for (let rowIndex = 1; rowIndex < documentosTimbradosRowsElements.length; rowIndex++) {
    const rowElement = documentosTimbradosRowsElements[rowIndex];

    const columnsElements = rowElement.querySelectorAll('td');

    if (!columnsElements || columnsElements.length < 2) {
      return [];
    }

    const documento = columnsElements[0].text.trim();
    const añoUltimoTimbraje = parseInt(columnsElements[1].text.trim());

    documentosTimbrados.push({ documento, ultimoTimbrajeYear: añoUltimoTimbraje });
  }

  return documentosTimbrados;
}

/**
 * Obtiene y analiza la situación tributaria de un contribuyente a partir de su RUT y dígito verificador.
 *
 * @param {string} rut - El RUT del contribuyente sin dígito verificador.
 * @param {string} dv - El dígito verificador del RUT del contribuyente.
 * @returns {Promise<SituacionTributaria>} Una promesa que resuelve a un objeto `SituacionTributaria` con la información tributaria del contribuyente.
 * @throws {Error} Lanza un error si no se encuentra el div contenedor en la respuesta HTML.
 */
export async function getAndParseStc(rut: string, dv: string): Promise<SituacionTributaria> {
  const stc = await getStc(rut, dv);

  const root = parse(stc);

  const contenedorElement = root.querySelector('div#contenedor');

  if (!contenedorElement) {
    throw new Error('No se logró cargar correctamente la situación tributaria');
  }

  return {
    rut: `${rut}-${dv}`,
    razonSocial: getRazonSocial(contenedorElement),
    inicioActividades: getInicioActividades(contenedorElement),
    fechaInicioActividades: getFechaInicioActividades(contenedorElement) || undefined,
    autorizadoMonedaExtranjera: getAutorizadoMonedaExtranjera(contenedorElement),
    empresaMenor: getEmpresaMenorTamaño(contenedorElement),
    actividades: getActividades(contenedorElement),
    documentosAutorizadosFormatoNoElectronico: getDocumentosAutorizadosFormatoNoElectronico(contenedorElement),
    documentosTimbrados: getDocumentosTimbrados(contenedorElement),
  };
}
