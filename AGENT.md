# Restricciones

*Disponibilidad de horarios*: No se pueden asignar dos citas a la misma hora para el mismo veterinario.  
*Capacidad máxima de atención*: Cada veterinario tiene un límite de consultas por día.  
*Recursos de inventario*: No se pueden recetar o asignar tratamientos si no hay stock suficiente de medicamentos o insumos.  
*Acceso por rol*: Los veterinarios solo pueden editar historias clínicas, los recepcionistas solo agendar y facturar, y el gerente tiene
permisos globales.  
*Cumplimiento sanitario*: no se puede omitir la carga de datos obligatorios en vacunas y tratamientos (ej. fecha de aplicación, lote de
vacuna).

# Validaciones

*Datos de la mascota completos*: Nombre, especie, raza, edad y dueño registrado.  
*Datos del dueño válidos*: Nombre, teléfono y al menos un medio de contacto (email o WhatsApp).  
*Validar duplicados*: No registrar la misma mascota dos veces con distinto nombre (ej. “Firulais” y “Firulais M.”).  
*Validar stock al momento de facturar*: el sistema debe descontar insumos o medicamentos en tiempo real.  
*Validar facturación*: los montos facturados deben coincidir con los servicios/medicamentos cargados.  
*Validar permisos*: solo personal autorizado puede aprobar descuentos o modificar precios.  
*Validar agenda*: no permitir superposición de citas en el mismo consultorio/veterinario.

# Inferencias (Inteligencia en la decisión)
*Inferir recordatorios automáticos*: el sistema genera alertas para próximas vacunas, chequeos o turnos pendientes.  
*Inferir prioridad de atención*: emergencias (ej. accidente o intoxicación) tienen prioridad sobre consultas programadas.  
*Inferir disponibilidad de veterinarios*: si un veterinario falta, reasignar automáticamente sus citas a otros con disponibilidad.  
*Inferir necesidades de stock*: si un medicamento baja de cierto umbral, generar alerta de reposición automática.  
*Inferir facturación recurrente*: identificar clientes frecuentes para ofrecer planes de salud o descuentos.