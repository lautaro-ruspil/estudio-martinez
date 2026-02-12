export const SITE_CONFIG = {
    name: "Martínez & Asociados",
    description:
        "Estudio contable con más de 30 años de trayectoria en Olavarría. Servicios contables para monotributistas, empresas y comercios.",
    url: "https://estudiomartinez.com.ar",
    locale: "es_AR",
    keywords: [
        "contador olavarría",
        "estudio contable olavarría",
        "monotributo olavarría",
        "liquidación de sueldos",
        "impuestos afip",
        "contador público olavarría",
    ],
} as const;

export const BUSINESS_INFO = {
    legalName: "Martínez & Asociados",
    owner: "Lic. Roberto Martínez",
    title: "Contador Público",
    license: "Mat. 12.456 - CPCE Buenos Aires",
    established: 1994,
    clientCount: "120+",
    experience: "30",
    address: {
        street: "Av. Colón 2847",
        city: "Olavarría",
        state: "Buenos Aires",
        country: "Argentina",
        reference: "Entre Rivadavia y Moreno",
        coordinates: {
            lat: -36.8927,
            lng: -60.3225,
        },
    },
    contact: {
        phone: "(02284) 15-225443",
        phoneRaw: "5492284225443",
        email: "info@estudiomartinez.com.ar",
        whatsapp: "https://wa.me/5492284225443",
        googleMaps:
            "https://www.google.com/maps?q=Av.+Colón+2847,+Olavarría,+Buenos+Aires",
    },
    schedule: {
        weekdays: "9:00 - 13:00 / 16:00 - 20:00",
        saturday: "9:00 - 13:00",
        sunday: "Cerrado",
        note: "Atendemos con turno previo",
    },
} as const;
