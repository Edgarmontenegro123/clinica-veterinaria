export default function OspanPage() {
  const plans = [
    {
      id: 1,
      name: "Plan 100",
      color: "bg-sky-400",
      borderColor: "border-sky-400",
      textColor: "text-white",
      services: {
        "Atención clínica (horario diurno)": [
          { name: "Consultas y controles clínica general", coverage: "50%" },
          { name: "Colocación de microchip", coverage: "10%" },
          { name: "Corte de uña y limpieza de oídos", coverage: "100%" },
          { name: "Enfermería Clínica", coverage: "100%" },
          { name: "Certificado de salud", coverage: "50%" },
          { name: "Horas de parto", coverage: "50%" },
          { name: "Observación veterinaria", coverage: "50%" },
        ],
        "Consulta a domicilio": [
          { name: "Consultar zonas de atención domiciliaria", coverage: "50%" },
          { name: "Vacunas a domicilio", coverage: "20%" },
        ],
        "Atención clínica (horario guardia)": [
          { name: "Consultas y controles clínica general", coverage: "25%" },
        ],
        "Telemedicina": [{ name: "", coverage: "100%" }],
        "Vacunas": [{ name: "", coverage: "60%" }],
        "Internación": [{ name: "", coverage: "" }],
        "Transfusión de sangre": [{ name: "", coverage: "10%" }],
        "Cirugías": [
          { name: "Cirugías generales", coverage: "" },
          { name: "Cirugías especiales", coverage: "" },
        ],
        "Endoscopías": [{ name: "", coverage: "" }],
        "Control Médico Integral": [
          { name: "CMI", coverage: "10%" },
        ],
        "Diagnóstico por imágenes (horario diurno)": [
          { name: "Ecografías", coverage: "10%" },
          { name: "Radiografías", coverage: "10%" },
        ],
        "Laboratorio": [
          { name: "Análisis clínicos generales", coverage: "10%" },
          { name: "Análisis clínicos especiales", coverage: "" },
        ],
        "Especialidades": [
          { name: "Medicina felina", coverage: "" },
          { name: "Dermatología", coverage: "" },
          { name: "Oftalmología", coverage: "" },
          { name: "Endocrinología", coverage: "" },
          { name: "Cardiología", coverage: "10%" },
        ],
        "Petshop & Farmacia": [
          { name: "Alimentos y accesorios", coverage: "10%" },
          { name: "Farmacia", coverage: "20%" },
          { name: "Baño y corte", coverage: "" },
        ],
        "Hoteles y Guarderías": [
          { name: "Hotel para Felinos Miahmosos", coverage: "5%" },
          { name: "Guardería Pampa Dog", coverage: "5%" },
        ],
        "Traslados": [{ name: "", coverage: "10%" }],
      }
    },
    {
      id: 2,
      name: "Plan 200",
      color: "bg-blue-900",
      borderColor: "border-blue-900",
      textColor: "text-white",
      services: {
        "Atención clínica (horario diurno)": [
          { name: "Consultas y controles clínica general", coverage: "100%" },
          { name: "Colocación de microchip", coverage: "25%" },
          { name: "Corte de uña y limpieza de oídos", coverage: "100%" },
          { name: "Enfermería Clínica", coverage: "100%" },
          { name: "Certificado de salud", coverage: "100%" },
          { name: "Horas de parto", coverage: "100%" },
          { name: "Observación veterinaria", coverage: "100%" },
        ],
        "Consulta a domicilio": [
          { name: "Consultar zonas de atención domiciliaria", coverage: "100%" },
          { name: "Vacunas a domicilio", coverage: "20%" },
        ],
        "Atención clínica (horario guardia)": [
          { name: "Consultas y controles clínica general", coverage: "60%" },
        ],
        "Telemedicina": [{ name: "", coverage: "100%" }],
        "Vacunas": [{ name: "", coverage: "100%" }],
        "Internación": [{ name: "", coverage: "20%" }],
        "Transfusión de sangre": [{ name: "", coverage: "" }],
        "Cirugías": [
          { name: "Cirugías generales", coverage: "" },
          { name: "Cirugías especiales", coverage: "" },
        ],
        "Endoscopías": [{ name: "", coverage: "" }],
        "Control Médico Integral": [
          { name: "CMI", coverage: "20%" },
        ],
        "Diagnóstico por imágenes (horario diurno)": [
          { name: "Ecografías", coverage: "20%" },
          { name: "Radiografías", coverage: "20%" },
        ],
        "Laboratorio": [
          { name: "Análisis clínicos generales", coverage: "20%" },
          { name: "Análisis clínicos especiales", coverage: "" },
        ],
        "Especialidades": [
          { name: "Medicina felina", coverage: "" },
          { name: "Dermatología", coverage: "" },
          { name: "Oftalmología", coverage: "" },
          { name: "Endocrinología", coverage: "" },
          { name: "Cardiología", coverage: "20%" },
        ],
        "Petshop & Farmacia": [
          { name: "Alimentos y accesorios", coverage: "10%" },
          { name: "Farmacia", coverage: "20%" },
          { name: "Baño y corte", coverage: "" },
        ],
        "Hoteles y Guarderías": [
          { name: "Hotel para Felinos Miahmosos", coverage: "10%" },
          { name: "Guardería Pampa Dog", coverage: "10%" },
        ],
        "Traslados": [{ name: "", coverage: "10%" }],
      }
    },
    {
      id: 3,
      name: "Plan 300",
      color: "bg-amber-700",
      borderColor: "border-amber-700",
      textColor: "text-white",
      services: {
        "Atención clínica (horario diurno)": [
          { name: "Consultas y controles clínica general", coverage: "100%" },
          { name: "Colocación de microchip", coverage: "60%" },
          { name: "Corte de uña y limpieza de oídos", coverage: "100%" },
          { name: "Enfermería Clínica", coverage: "100%" },
          { name: "Certificado de salud", coverage: "100%" },
          { name: "Horas de parto", coverage: "20%" },
          { name: "Observación veterinaria", coverage: "100%" },
        ],
        "Consulta a domicilio": [
          { name: "Consultar zonas de atención domiciliaria", coverage: "100%" },
          { name: "Vacunas a domicilio", coverage: "30%" },
        ],
        "Atención clínica (horario guardia)": [
          { name: "Consultas y controles clínica general", coverage: "60%" },
        ],
        "Telemedicina": [{ name: "", coverage: "100%" }],
        "Vacunas": [{ name: "", coverage: "100%" }],
        "Internación": [{ name: "", coverage: "20%" }],
        "Transfusión de sangre": [{ name: "", coverage: "30%" }],
        "Cirugías": [
          { name: "Cirugías generales", coverage: "1 X AÑO" },
          { name: "Cirugías especiales", coverage: "20%" },
        ],
        "Endoscopías": [{ name: "", coverage: "" }],
        "Control Médico Integral": [
          { name: "CMI", coverage: "40%" },
        ],
        "Diagnóstico por imágenes (horario diurno)": [
          { name: "Ecografías", coverage: "40%" },
          { name: "Radiografías", coverage: "40%" },
        ],
        "Laboratorio": [
          { name: "Análisis clínicos generales", coverage: "40%" },
          { name: "Análisis clínicos especiales", coverage: "30%" },
        ],
        "Especialidades": [
          { name: "Medicina felina", coverage: "20%" },
          { name: "Dermatología", coverage: "20%" },
          { name: "Oftalmología", coverage: "20%" },
          { name: "Endocrinología", coverage: "20%" },
          { name: "Cardiología", coverage: "40%" },
        ],
        "Petshop & Farmacia": [
          { name: "Alimentos y accesorios", coverage: "15%" },
          { name: "Farmacia", coverage: "30%" },
          { name: "Baño y corte", coverage: "25%" },
        ],
        "Hoteles y Guarderías": [
          { name: "Hotel para Felinos Miahmosos", coverage: "20%" },
          { name: "Guardería Pampa Dog", coverage: "15%" },
        ],
        "Traslados": [{ name: "", coverage: "10%" }],
      }
    },
    {
      id: 4,
      name: "Plan 400",
      color: "bg-gray-900",
      borderColor: "border-gray-900",
      textColor: "text-white",
      services: {
        "Atención clínica (horario diurno)": [
          { name: "Consultas y controles clínica general", coverage: "100%" },
          { name: "Colocación de microchip", coverage: "100%" },
          { name: "Corte de uña y limpieza de oídos", coverage: "100%" },
          { name: "Enfermería Clínica", coverage: "100%" },
          { name: "Certificado de salud", coverage: "100%" },
          { name: "Horas de parto", coverage: "100%" },
          { name: "Observación veterinaria", coverage: "100%" },
        ],
        "Consulta a domicilio": [
          { name: "Consultar zonas de atención domiciliaria", coverage: "100%" },
          { name: "Vacunas a domicilio", coverage: "40%" },
        ],
        "Atención clínica (horario guardia)": [
          { name: "Consultas y controles clínica general", coverage: "80%" },
        ],
        "Telemedicina": [{ name: "", coverage: "100%" }],
        "Vacunas": [{ name: "", coverage: "100%" }],
        "Internación": [{ name: "", coverage: "100%" }],
        "Transfusión de sangre": [{ name: "", coverage: "" }],
        "Cirugías": [
          { name: "Cirugías generales", coverage: "ILIMITADO" },
          { name: "Cirugías especiales", coverage: "50%" },
        ],
        "Endoscopías": [{ name: "", coverage: "50%" }],
        "Control Médico Integral": [
          { name: "CMI", coverage: "100%" },
        ],
        "Diagnóstico por imágenes (horario diurno)": [
          { name: "Ecografías", coverage: "100%" },
          { name: "Radiografías", coverage: "100%" },
        ],
        "Laboratorio": [
          { name: "Análisis clínicos generales", coverage: "100%" },
          { name: "Análisis clínicos especiales", coverage: "40%" },
        ],
        "Especialidades": [
          { name: "Medicina felina", coverage: "40%" },
          { name: "Dermatología", coverage: "40%" },
          { name: "Oftalmología", coverage: "40%" },
          { name: "Endocrinología", coverage: "40%" },
          { name: "Cardiología", coverage: "100%" },
        ],
        "Petshop & Farmacia": [
          { name: "Alimentos y accesorios", coverage: "20%" },
          { name: "Farmacia", coverage: "40%" },
          { name: "Baño y corte", coverage: "50%" },
        ],
        "Hoteles y Guarderías": [
          { name: "Hotel para Felinos Miahmosos", coverage: "30%" },
          { name: "Guardería Pampa Dog", coverage: "20%" },
        ],
        "Traslados": [{ name: "", coverage: "10%" }],
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            OSPAN - Obra Social para Animales
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Compará los planes de cobertura y elegí el que mejor se adapte a tu mascota
          </p>
        </div>

        {/* Plans Grid - All cards visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-xl overflow-hidden border-4 ${plan.borderColor}`}
            >
              {/* Plan Header */}
              <div className={`${plan.color} ${plan.textColor} p-4 border-b-2 border-white/20`}>
                <h2 className="text-2xl font-bold text-center">{plan.name}</h2>
              </div>

              {/* Plan Services */}
              <div className={`${plan.color} p-3`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                {Object.entries(plan.services).map(([category, items]) => (
                  <div key={category} className="mb-3">
                    {items.length === 1 && !items[0].name ? (
                      // Si solo hay un item sin nombre, mostrar la categoría con el porcentaje en la misma línea
                      <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <h4 className="font-bold text-gray-900 text-xs">
                          {category}
                        </h4>
                        {items[0].coverage && (
                          <span className="text-blue-600 font-semibold text-[11px] ml-2 flex-shrink-0">
                            {items[0].coverage}
                          </span>
                        )}
                        {!items[0].coverage && (
                          <span className="text-gray-400 italic text-[11px]">-</span>
                        )}
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-gray-900 mb-1 text-xs bg-gray-100 p-2 rounded">
                          {category}
                        </h4>
                        <ul className="space-y-1 pl-2">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-[11px] leading-tight flex justify-between items-start">
                              <span className="text-gray-700 flex-1">
                                {item.name || "-"}
                              </span>
                              {item.coverage && (
                                <span className="text-blue-600 font-semibold ml-2 flex-shrink-0">
                                  {item.coverage}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
              <p className="text-gray-600">0800-OSPAN (67726)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
              <p className="text-gray-600">info@ospan.com.ar</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Dirección</h4>
              <p className="text-gray-600">Av. Veterinaria 1234, CABA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
