import { getSituacionTributaria, type SituacionTributaria } from '../index';

describe('Obtiene y parsea correctamente la situacion tributaria de SII de Haulmer', () => {
  let situacionTributaria: SituacionTributaria;

  beforeAll(async () => {
    situacionTributaria = await getSituacionTributaria('76795561', '8');
  });

  test('situacionTributaria está definido', () => {
    expect(situacionTributaria).toBeDefined();
  });

  test('El rut es correcto', () => {
    expect(situacionTributaria.rut).toBe('76795561-8');
  });

  test('La razón social es correcta', () => {
    expect(situacionTributaria.razonSocial).toBe('HAULMER SPA');
  });

  test('Posee inicio de actividades', () => {
    expect(situacionTributaria.inicioActividades).toBe(true);
  });

  test('Posee la fecha de inicio de actividades', () => {
    expect(situacionTributaria.fechaInicioActividades).toBeDefined();
    expect(situacionTributaria.fechaInicioActividades!.getFullYear()).toBe(2017);
  });

  test('No debe estar autorizado para utilizar moneda extranjera', () => {
    expect(situacionTributaria.autorizadoMonedaExtranjera).toBe(false);
  });

  test('No debe ser empresa menor', () => {
    expect(situacionTributaria.empresaMenor).toBe(false);
  });

  test('Debe tener actividades', () => {
    expect(situacionTributaria.actividades).toBeDefined();
    expect(situacionTributaria.actividades!.length).toBeGreaterThan(0);
  });

  test('Debe tener la actividad de actividades de consultoria en 2017', () => {
    const actividadConsultoriaCodigo = 620200;

    const actividadConsultoria = situacionTributaria.actividades!.find(
      (actividad) => actividad.codigo === actividadConsultoriaCodigo,
    );

    expect(actividadConsultoria).toBeDefined();
    expect(actividadConsultoria!.codigo).toBe(actividadConsultoriaCodigo);
    expect(actividadConsultoria!.giro).toBe('ACTIVIDADES DE CONSULTORIA DE INFORMATICA Y DE GESTION DE INSTALACIONE');
    expect(actividadConsultoria!.categoria).toBe(1);
    expect(actividadConsultoria!.afecta).toBe(true);
    expect(actividadConsultoria!.fecha.getFullYear()).toBe(2017);
  });

  test('Debe tenenr documentos autorizados para formato no electrónico', () => {
    expect(situacionTributaria.documentosAutorizadosFormatoNoElectronico).toBeDefined();
    expect(situacionTributaria.documentosAutorizadosFormatoNoElectronico!.length).toBeGreaterThan(0);
  });

  test('Debe tener prorroga por zona de catastrofe en 2017-2018', () => {
    const textoProrroga = 'PRORROGA POR ZONA DE CATASTROFE';

    const prorrogaZonaCatastrofe = situacionTributaria.documentosAutorizadosFormatoNoElectronico!.find(
      (documento) => documento.documento === textoProrroga,
    );

    expect(prorrogaZonaCatastrofe).toBeDefined();
    expect(prorrogaZonaCatastrofe!.desde.getFullYear()).toBe(2017);
    expect(prorrogaZonaCatastrofe!.hasta.getFullYear()).toBe(2018);
  });

  test('Debe tener documentos timbrados', () => {
    expect(situacionTributaria.documentosTimbrados).toBeDefined();
    expect(situacionTributaria.documentosTimbrados!.length).toBeGreaterThan(0);
  });

  test('Debe tener timbres de boleta electronica con un año asociado', () => {
    const textoBoleta = 'Boleta Exenta Electronica';

    const timbreBoletaElectronica = situacionTributaria.documentosTimbrados!.find(
      (documento) => documento.documento === textoBoleta,
    );

    expect(timbreBoletaElectronica).toBeDefined();
    expect(typeof timbreBoletaElectronica!.ultimoTimbrajeYear).toBe('number');
    expect(timbreBoletaElectronica!.ultimoTimbrajeYear).toBeGreaterThan(2000);
    expect(timbreBoletaElectronica!.ultimoTimbrajeYear).toBeLessThan(3000);
  });
});
