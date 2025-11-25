import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getPetById, updatePet, deletePet } from '../services/pets.service';
import Swal from 'sweetalert2';

const AdminPetManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState(null);
    const [editing, setEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        birth_date: '',
        history: '',
        vaccines: [],
        image: ''
    });

    useEffect(() => {
        if (!isAdmin) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Solo los administradores pueden acceder a esta página',
            }).then(() => navigate('/mypets'));
            return;
        }
        loadPet();
    }, [id, isAdmin]);

    const loadPet = async () => {
        try {
            setLoading(true);
            const data = await getPetById(id);
            setPet(data);
            setFormData({
                name: data.name || '',
                species: data.species || '',
                breed: data.breed || '',
                age: data.age || '',
                sex: data.sex || '',
                birth_date: data.birth_date || '',
                history: data.history || '',
                vaccines: data.vaccines || [],
                image: data.image || ''
            });
            setImagePreview(data.image || null);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información de la mascota',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación adicional para birth_date
        if (formData.birth_date) {
            const selectedDate = new Date(formData.birth_date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                Swal.fire({
                    icon: "error",
                    title: "Fecha inválida",
                    text: "La fecha de nacimiento no puede ser posterior a la fecha actual.",
                    confirmButtonColor: "#d33",
                });
                return;
            }

            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 200);
            minDate.setHours(0, 0, 0, 0);

            if (selectedDate < minDate) {
                Swal.fire({
                    icon: "error",
                    title: "Fecha inválida",
                    text: "La fecha de nacimiento no puede ser mayor a 200 años en el pasado.",
                    confirmButtonColor: "#d33",
                });
                return;
            }
        }

        try {
            Swal.fire({
                title: 'Guardando cambios...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await updatePet(id, formData);

            await Swal.fire({
                icon: 'success',
                title: 'Cambios guardados',
                text: 'La información de la mascota se actualizó correctamente',
                timer: 2000,
            });

            setEditing(false);
            loadPet();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron guardar los cambios',
            });
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Marcar mascota como fallecida?',
            text: 'Esta acción desactivará la mascota (is_active = false)',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Desactivando mascota...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await deletePet(id);

                await Swal.fire({
                    icon: 'success',
                    title: 'Mascota desactivada',
                    text: 'La mascota ha sido marcada como inactiva',
                    timer: 2000,
                });

                navigate('/mypets');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo desactivar la mascota',
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mascota no encontrada</h2>
                    <button
                        onClick={() => navigate('/mypets')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Volver a Mis Mascotas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen px-4 py-8">
            {/* Imagen de fondo */}
            <img
                src="/fondo1.jpg"
                alt="Fondo veterinaria"
                className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
            />

            {/* Overlay oscuro */}
            <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-[-1]"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                            Gestión de Mascota - Panel Admin
                        </h1>
                        <p className="text-white font-semibold" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}>ID: {pet.id}</p>
                    </div>
                    <button
                        onClick={() => navigate('/mypets')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg"
                    >
                        ← Volver
                    </button>
                </div>

                {/* Main Content */}
                <div
                    className="rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 border-2 border-white/30"
                    style={{
                        background: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)"
                    }}
                >
                {/* Información del dueño */}
                {pet.users && (
                    <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/30">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>👤 Información del Dueño</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div>
                                <p className="text-blue-300 font-medium">Nombre:</p>
                                <p className="text-white break-words">{pet.users.name}</p>
                            </div>
                            <div>
                                <p className="text-blue-300 font-medium">Email:</p>
                                <p className="text-white break-words">{pet.users.email}</p>
                            </div>
                            <div>
                                <p className="text-blue-300 font-medium">Teléfono:</p>
                                <p className="text-white">{pet.users.phone || 'No registrado'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Edit Mode */}
                <div className="flex justify-end gap-2 sm:gap-3">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                        >
                            ✏️ Editar Información
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setEditing(false);
                                setFormData({
                                    name: pet.name || '',
                                    species: pet.species || '',
                                    breed: pet.breed || '',
                                    age: pet.age || '',
                                    sex: pet.sex || '',
                                    birth_date: pet.birth_date || '',
                                    history: pet.history || '',
                                    vaccines: pet.vaccines || [],
                                    image: pet.image || ''
                                });
                                setImagePreview(pet.image || null);
                                setImageFile(null);
                            }}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                        >
                            ✖️ Cancelar
                        </button>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Imagen de la mascota */}
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-4 sm:p-5 md:p-6 bg-white/10 backdrop-blur-sm">
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                            📷 Imagen de la Mascota
                        </label>
                        <div className="flex flex-col sm:flex-col md:flex-row gap-3 sm:gap-4 items-center">
                            {/* Preview de la imagen */}
                            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg border-2 border-white/30 overflow-hidden bg-white/5 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <svg
                                            className="w-16 h-16 mx-auto mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-sm">Sin imagen</p>
                                    </div>
                                )}
                            </div>

                            {/* Input de archivo */}
                            <div className="flex-1 w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={!editing}
                                    className="w-full text-xs sm:text-sm text-white file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 disabled:opacity-50 file:cursor-pointer"
                                />
                                <p className="text-xs text-gray-300 mt-2" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información Básica */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 placeholder-white/60 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Especie
                            </label>
                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 placeholder-white/60 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Raza
                            </label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 placeholder-white/60 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Edad
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 placeholder-white/60 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Sexo
                            </label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 backdrop-blur-sm"
                                required
                            >
                                <option value="" className="bg-gray-800">Seleccionar</option>
                                <option value="Macho" className="bg-gray-800">Macho</option>
                                <option value="Hembra" className="bg-gray-800">Hembra</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                disabled={!editing}
                                max={(() => {
                                    const today = new Date();
                                    return today.toISOString().split('T')[0];
                                })()}
                                min={(() => {
                                    const minDate = new Date();
                                    minDate.setFullYear(minDate.getFullYear() - 200);
                                    return minDate.toISOString().split('T')[0];
                                })()}
                                className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    {/* Historia Clínica */}
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                            📋 Historia Clínica
                        </label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            disabled={!editing}
                            rows="6"
                            className="w-full px-3 py-2 text-sm sm:text-base bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 placeholder-white/60 backdrop-blur-sm resize-vertical"
                            placeholder="Registros médicos, tratamientos, observaciones..."
                        />
                    </div>

                    {/* Botones de acción */}
                    {editing && (
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-white/30">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-md"
                            >
                                🗑️ Marcar como Fallecida
                            </button>
                            <button
                                type="submit"
                                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-md"
                            >
                                💾 Guardar Cambios
                            </button>
                        </div>
                    )}
                </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPetManagement;
