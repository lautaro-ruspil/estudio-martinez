import { MapPin, Phone, Clock } from "lucide-react";
import { useContactForm } from "../../hooks/useContactForm";
import { Button, Input, Textarea } from "../ui";
import { BUSINESS_INFO } from "../../config/site";
import { ICON_SIZES } from "../../constants/iconSizes";

export function Contact() {
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        submitStatus,
        handleSubmit,
        handleChange,
        handleBlur,
    } = useContactForm();

    return (
        <section
            id="contacto"
            className="section-spacing bg-slate-50"
            aria-labelledby="contact-heading"
        >
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2
                        id="contact-heading"
                        className="text-h2 font-bold text-secondary-900 mb-4"
                    >
                        Contactanos
                    </h2>
                    <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
                        Dejanos tu consulta y te respondemos a la brevedad.
                        <span className="block mt-2 font-medium text-slate-800">
                            La primera consulta es sin cargo.
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 max-w-6xl mx-auto">
                    {/* FORM */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-soft border border-slate-200">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            noValidate
                        >
                            <Input
                                label="Nombre completo"
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                onBlur={() => handleBlur("name")}
                                error={touched.name ? errors.name : undefined}
                                isValid={
                                    touched.name &&
                                    !errors.name &&
                                    formData.name.length > 0
                                }
                                placeholder="Juan Pérez"
                                required
                                maxLength={80}
                                autoComplete="name"
                                disabled={isSubmitting}
                            />

                            <Input
                                label="Email"
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                onBlur={() => handleBlur("email")}
                                error={touched.email ? errors.email : undefined}
                                isValid={
                                    touched.email &&
                                    !errors.email &&
                                    formData.email.length > 0
                                }
                                placeholder="juan@ejemplo.com"
                                required
                                maxLength={120}
                                autoComplete="email"
                                disabled={isSubmitting}
                            />

                            <Input
                                label="Teléfono"
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                onBlur={() => handleBlur("phone")}
                                error={touched.phone ? errors.phone : undefined}
                                isValid={
                                    touched.phone &&
                                    !errors.phone &&
                                    formData.phone.length > 0
                                }
                                placeholder={BUSINESS_INFO.contact.phone}
                                required
                                maxLength={20}
                                autoComplete="tel"
                                disabled={isSubmitting}
                            />

                            <Textarea
                                label="¿En qué podemos ayudarte?"
                                id="message"
                                value={formData.message}
                                onChange={(e) =>
                                    handleChange("message", e.target.value)
                                }
                                onBlur={() => handleBlur("message")}
                                error={
                                    touched.message ? errors.message : undefined
                                }
                                isValid={
                                    touched.message &&
                                    !errors.message &&
                                    formData.message.length > 0
                                }
                                placeholder="Contanos brevemente tu situación..."
                                rows={5}
                                required
                                maxLength={1000}
                                disabled={isSubmitting}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting
                                    ? "Enviando..."
                                    : "Enviar consulta"}
                            </Button>

                            {/* Success message */}
                            {submitStatus === "success" && (
                                <div
                                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-xl mt-4"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <p className="font-medium">
                                        ¡Mensaje enviado con éxito!
                                    </p>
                                    <p className="text-sm mt-1">
                                        Te vamos a responder a la brevedad.
                                    </p>
                                </div>
                            )}

                            {/* Error message */}
                            {submitStatus === "error" && (
                                <div
                                    className="bg-red-50 border border-red-200 text-red-800 px-4 py-4 rounded-xl mt-4"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    <p className="font-medium">
                                        Ocurrió un error al enviar el mensaje.
                                    </p>
                                    <p className="text-sm mt-1">
                                        Por favor intentá nuevamente.
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* INFO */}
                    <div className="space-y-10">
                        {/* Dirección */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin
                                    className={`${ICON_SIZES.sm} text-primary-600`}
                                />
                                <h3 className="font-semibold text-slate-900">
                                    Dirección
                                </h3>
                            </div>

                            <address className="not-italic text-slate-600 leading-relaxed">
                                <p>{BUSINESS_INFO.address.street}</p>
                                <p>
                                    {BUSINESS_INFO.address.city},{" "}
                                    {BUSINESS_INFO.address.state}
                                </p>
                                <p className="text-sm text-slate-500 mt-2">
                                    {BUSINESS_INFO.address.reference}
                                </p>
                            </address>

                            <a
                                href={BUSINESS_INFO.contact.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 mt-3 inline-block underline"
                            >
                                Ver en Google Maps →
                            </a>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Phone
                                    className={`${ICON_SIZES.sm} text-primary-600`}
                                />
                                <h3 className="font-semibold text-slate-900">
                                    Teléfono
                                </h3>
                            </div>

                            <p className="text-slate-600">
                                {BUSINESS_INFO.contact.phone}
                            </p>

                            <a
                                href={BUSINESS_INFO.contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 mt-3 inline-block underline"
                            >
                                Enviarnos un WhatsApp →
                            </a>
                        </div>

                        {/* Horarios */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Clock
                                    className={`${ICON_SIZES.sm} text-primary-600`}
                                />
                                <h3 className="font-semibold text-slate-900">
                                    Horarios
                                </h3>
                            </div>

                            <div className="text-slate-600 space-y-2">
                                <div>
                                    <p className="font-medium">
                                        Lunes a Viernes
                                    </p>
                                    <p className="text-sm">
                                        {BUSINESS_INFO.schedule.weekdays}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Sábados</p>
                                    <p className="text-sm">
                                        {BUSINESS_INFO.schedule.saturday}
                                    </p>
                                </div>

                                <p className="text-sm text-primary-600 font-medium pt-2">
                                    {BUSINESS_INFO.schedule.note}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
