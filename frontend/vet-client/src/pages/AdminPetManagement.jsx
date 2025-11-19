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
            console.error('Error loading pet:', error);
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
            console.error('Error updating pet:', error);
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
                console.error('Error deleting pet:', error);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Mascota - Panel Admin
                    </h1>
                    <p className="text-gray-600">ID: {pet.id}</p>
                </div>
                <button
                    onClick={() => navigate('/mypets')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    ← Volver
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                {/* Información del dueño */}
                {pet.users && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">👤 Información del Dueño</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <p className="text-blue-700 font-medium">Nombre:</p>
                                <p className="text-gray-800">{pet.users.name}</p>
                            </div>
                            <div>
                                <p className="text-blue-700 font-medium">Email:</p>
                                <p className="text-gray-800">{pet.users.email}</p>
                            </div>
                            <div>
                                <p className="text-blue-700 font-medium">Teléfono:</p>
                                <p className="text-gray-800">{pet.users.phone || 'No registrado'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Edit Mode */}
                <div className="flex justify-end gap-3">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ✖️ Cancelar
                        </button>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Imagen de la mascota */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            📷 Imagen de la Mascota
                        </label>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Preview de la imagen */}
                            <div className="w-48 h-48 rounded-lg border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center">
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
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={!editing}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Especie
                            </label>
                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Raza
                            </label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Edad
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sexo
                            </label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                disabled={!editing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Historia Clínica */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            📋 Historia Clínica
                        </label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            disabled={!editing}
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Registros médicos, tratamientos, observaciones..."
                        />
                    </div>

                    {/* Botones de acción */}
                    {editing && (
                        <div className="flex justify-between pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                            >
                                🗑️ Marcar como Fallecida
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                                💾 Guardar Cambios
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminPetManagement;
