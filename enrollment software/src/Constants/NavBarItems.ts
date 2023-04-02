
export interface NavItem {
  label: string;
  subLabel?: string;
  children?: { label: string; subLabel: string; href: string }[];
  href?: string;
  rol: number[];
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Oferta Académica",
    href: "/oferta-academica",
    rol: [3],
  },
  {
    label: "Estudiantes",
    rol: [3, 4],
    children: [
      {
        label: "Agregar estudiante",
        subLabel: "Formulario pequeno para agregar estudiantes",
        href: "/agregar-estudiante",
      },
      {
        label: "Buscar estudiantes",
        subLabel: "Puede buscar, editar y ver historial",
        href: "/buscar-estudiante",
      },
    ],
  },
  {
    label: "Carrera",
    rol: [3],
    children: [
      {
        label: "Hacer consultas sobre las carreras",
        subLabel: "Puede hacer operaciones CRUD y ver los cursos",
        href: "/carreras",
      },
    ],
  },
  {
    label: "Ciclos",
    href: "/ciclo",
    rol: [3],
  },
  {
    label: "Profesores",
    href: "/profesor",
    rol: [3],
  },
  {
    label: "Mis grupos",
    href: "/mis-grupos",
    rol: [2],
  },
  {
    label: "Cursos",
    href: "/cursos",
    rol: [3],
  },
  {
    label: "Seguridad",
    rol: [3],
    children: [
      {
        label: "Mantenimiento Administradores",
        subLabel: "Acciones CRUD a administradores",
        href: "/seguridad/admin",
      },
      {
        label: "Mantenimiento Matriculadores",
        subLabel: "Acciones CRUD a matriculadores",
        href: "/seguridad/matriculador",
      },
    ],
  },
  {
    label: "Mi historial",
    href: "/historial/",
    rol: [1],
  },
];
