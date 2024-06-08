# 🚀 situacion-tributaria-sii

[![npm version](https://badge.fury.io/js/situacion-tributaria-sii.svg)](https://badge.fury.io/js/situacion-tributaria-sii)

Liberia para obtener la situación tributaria de un contribuyente en el SII.

## Instalación

```bash
npm install situacion-tributaria-sii
```

## Ejemplo de uso

```javascript
const { getSituacionTributaria } = require('situacion-tributaria-sii');

async function obtenerDatosTributarios() {
  const rut = '11111111';
  const dv = '1';
  const situacionTributaria = await getSituacionTributaria(rut, dv);
  console.log(situacionTributaria);
}
```

```typescript
import { getSituacionTributaria } from 'situacion-tributaria-sii';

async function obtenerDatosTributarios() {
  const rut = '11111111';
  const dv = '1';
  const situacionTributaria = await getSituacionTributaria(rut, dv);
  console.log(situacionTributaria);
}
```

## Ejemplo de respuesta

```json
{
  "rut": "11111111-1",
  "razonSocial": "JUANA DEL CARMEN PONCE VENEGAS",
  "inicioActividades": true,
  "fechaInicioActividades": "2017-10-17T00:00:00.000Z",
  "autorizadoMonedaExtranjera": false,
  "empresaMenor": false,
  "actividades": [
    {
      "giro": "ACTIVIDADES DE CONSULTORIA DE INFORMATICA Y DE GESTION DE INSTALACIONE",
      "codigo": 620200,
      "categoria": "Primera",
      "afecta": true,
      "fecha": "2017-10-17T00:00:00.000Z"
    }
  ],
  "documentosAutorizadosFormatoNoElectronico": [
    {
      "desde": "2017-11-21T00:00:00.000Z",
      "hasta": "2018-02-01T00:00:00.000Z",
      "documento": "PRORROGA POR ZONA DE CATASTROFE"
    }
  ],
  "documentosTimbrados": [
    {
      "documento": "Boleta Electronica",
      "ultimoTimbrajeYear": 2024
    },
    {
      "documento": "Boleta Exenta Electronica",
      "ultimoTimbrajeYear": 2023
    }
  ]
}
```

## License

#### The MIT License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
