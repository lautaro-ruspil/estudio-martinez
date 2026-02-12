import type { Service } from "../types";
import {
    FileText,
    Briefcase,
    Calculator,
    BarChart3,
    Handshake,
    Landmark,
} from "lucide-react";

export const servicesList: Service[] = [
    {
        id: "monotributo",
        title: "Monotributo",
        description:
            "Inscripción, recategorización y presentaciones mensuales. Te ayudamos a mantener tu situación al día sin complicaciones.",
        icon: FileText,
        popular: true,
    },
    {
        id: "liquidacion-sueldos",
        title: "Liquidación de Sueldos",
        description:
            "Cálculo de haberes, cargas sociales y presentación ante AFIP. Para comercios y pequeñas empresas de Olavarría.",
        icon: Briefcase,
        popular: false,
    },
    {
        id: "impuestos",
        title: "Impuestos",
        description:
            "Presentación de declaraciones juradas de IVA, Ganancias, Ingresos Brutos y demás obligaciones fiscales.",
        icon: Calculator,
        popular: false,
    },
    {
        id: "balances",
        title: "Balances",
        description:
            "Confección de estados contables anuales para empresas y monotributistas que necesiten certificación.",
        icon: BarChart3,
        popular: false,
    },
    {
        id: "asesoramiento",
        title: "Asesoramiento",
        description:
            "Consultas sobre apertura de comercios, cambio de categoría, trámites ante AFIP y planificación tributaria.",
        icon: Handshake,
        popular: false,
    },
    {
        id: "tramites",
        title: "Trámites AFIP",
        description:
            "Gestión de CUIT, clave fiscal, factura electrónica y otros trámites ante organismos oficiales.",
        icon: Landmark,
        popular: false,
    },
];
