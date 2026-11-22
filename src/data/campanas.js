// Contenido de la página de campañas (migrado de campanas.html).
export const campanaDestacada = {
  id: 'reforestacion-valle',
  titulo: 'Gran Reforestación del Valle',
  descripcion:
    'Acompáñanos en esta jornada masiva para plantar 10,000 árboles nativos y restaurar el ecosistema local. Se proveerán herramientas y refrigerios.',
  fecha: '15 Octubre, 2026',
  lugar: 'Parque Nacional',
  imagen:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfLuhv4WplqnEPKGQ98sdM2A_qKTXHtObjH6o255IGasrgrwcPBIzqYH5urtlJ1CNrecGTvt1OxHPMdMJ3MSemI2a4atqMVUwNP15XKUrrs7cNRxI2a2ZzbzS6YvRIBvpSJPPzy_Ku_xPfUHs_QQ7oNTSuJf6VGl7lzzNhApDmXdSWRvuOX2rDK6TuNdnUyHzq207_r2Qlt62-ACtENrAM71GMqJupM879agrCf6mIfrVENwK5rH_SisclnSCTDN3FD1g',
};

export const campanas = [
  {
    id: 'limpieza-costas',
    etiquetas: ['Limpieza'],
    titulo: 'Limpieza de Costas',
    descripcion:
      'Ayuda a mantener nuestras playas libres de plásticos. Una mañana dedicada a preservar la vida marina.',
    fecha: '22 Octubre, 08:00 AM',
    lugar: 'Playa Sur',
    accion: 'Ver más',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfI9FaIh7oHtnGj4abgcDCFfAJKZxFwQ618FTF7KB11a-i7Oe3zrpzxn48itoF0-FZutfhy1TF-2mU2pfnpB_Y2HF1X8hE6Ec70f-EW7MWLsH4WxClUXJh9NRkW26MezSxdKWaWMfpNJrRSaw5MAp2J-IjiuSzfRoAN-I512l4kEMpP8Z83kAVUfT-lwU1ChUsHaaMD33CGunNMAhcMZtHSxcx9Dzl4WnZDNiCpy8OP5mbRlQyY8LHiQ',
    alt: 'Voluntarios realizando limpieza de costas',
  },
  {
    id: 'plantaton-urbana',
    etiquetas: ['Reforestación'],
    titulo: 'Plantatón Urbana',
    descripcion:
      'Transformemos la ciudad plantando árboles en parques locales. Trae a tu familia.',
    fecha: '05 Noviembre, 09:30 AM',
    lugar: 'Parque Central',
    accion: 'Inscribirse',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDX9FDfx34IVOsd8s6E7hUuIQfxEEH3PoWYZSV69ACvtW97HRl9D_yJd9yZckEzNw6ip1u1WpfNGdMqJtoBDgLgCCxh5dyaHfM_zuxVxuW76-Bkr4Hq7zCO1pamazdztI-ySOm0u8l3cYy9AzXngImCqLw4tYaa_v0e2VmlnMn6b07_c04U6x-35Qek-ytvc_QFBDSTs0AysFzBljYJ9zypzXk6rIwHBX9uZOgdKPvi4a0vbq-a2TuBuA',
    alt: 'Persona sosteniendo una planta para reforestación',
  },
  {
    id: 'taller-reciclaje',
    etiquetas: ['Educación', 'Taller'],
    titulo: 'Taller de Reciclaje Creativo',
    descripcion:
      'Aprende a transformar residuos en objetos útiles. Materiales incluidos.',
    fecha: '12 Noviembre, 03:00 PM',
    lugar: 'Centro Comunitario',
    accion: 'Ver más',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCMXYemWw5VJwotiADFDdC4PTJqNDrjbfot9z_fa-Ztxol_GSkoJnTA9q3H5di8KtKRaZJ1KVEOnjGM8b2oydWNOAtpnH8Pe0dmDCwPel5skF4LpfzUwS9tn3EsPSNYXDnIKhNz0g9TsGarFxNHlZpGHY95OkyPmrN-6_Gjoq1chaDji7TNCXDn5XJlaZXgx4z-Sk1PFQdVqFb319DORQeZ-a-rvVPEN4ACI7R1iWtotehMiErTMKr2w',
    alt: 'Taller de reciclaje creativo',
  },
];

// Calendario: la fila de la campaña destacada más las demás.
export const calendario = [
  { evento: campanaDestacada.titulo, categoria: 'Reforestación', fecha: '15 de octubre, 2026', lugar: campanaDestacada.lugar },
  { evento: 'Limpieza de Costas', categoria: 'Limpieza', fecha: '22 de octubre, 08:00 AM', lugar: 'Playa Sur' },
  { evento: 'Plantatón Urbana', categoria: 'Reforestación', fecha: '05 de noviembre, 09:30 AM', lugar: 'Parque Central' },
  { evento: 'Taller de Reciclaje Creativo', categoria: 'Educación', fecha: '12 de noviembre, 03:00 PM', lugar: 'Centro Comunitario' },
];
