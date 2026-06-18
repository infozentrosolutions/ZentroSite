import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { BadgeCheck, FileUp, Loader2, LogOut, Mail, Phone, Plus, RefreshCw, ShieldAlert, Trash2, Upload, UserCircle2, Users, QrCode, Download, ExternalLink, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QRCodeSVG } from 'qrcode.react';

const defaultInternForm = {
    name: '',
    email: '',
    phone: '',
    role: 'Intern',
    batch: '',
    stack: '',
    summary: '',
    photoUrl: ''
};

const sanitizeKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const getField = (source, keys) => {
    for (const key of keys) {
        const value = source[key];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return String(value).trim();
        }
    }
    return '';
};

const normalizeExcelRow = (row) => {
    const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
        acc[sanitizeKey(key)] = value;
        return acc;
    }, {});

    return {
        name: getField(normalizedRow, ['name', 'fullname', 'internname', 'studentname']),
        email: getField(normalizedRow, ['email', 'emailaddress', 'mail']),
        phone: getField(normalizedRow, ['phone', 'phonenumber', 'mobile', 'contact']),
        role: getField(normalizedRow, ['role', 'designation', 'position']) || 'Intern',
        batch: getField(normalizedRow, ['batch', 'batchname']),
        stack: getField(normalizedRow, ['stack', 'skills', 'skillset', 'technology', 'domain']),
        summary: getField(normalizedRow, ['summary', 'description', 'about', 'profile']),
        photoUrl: getField(normalizedRow, ['photourl', 'photo', 'image', 'avatar'])
    };
};

const InternCard = ({ intern, canDelete, onDelete, onSelect }) => {
    const initials = intern?.name ? intern.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() : 'IN';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35 }}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(intern)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(intern);
                }
            }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-transform hover:-translate-y-1"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-cyan-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-lg font-black text-white shadow-lg">
                        {intern.photoUrl ? (
                            <img src={intern.photoUrl} alt={intern.name} className="h-full w-full rounded-2xl object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold leading-tight text-slate-950">{intern.name}</h3>
                            {intern.status === 'active' && <BadgeCheck size={16} className="text-emerald-500" />}
                        </div>
                        <p className="text-sm font-medium text-indigo-700">{intern.role || 'Intern'}</p>
                        <p className="mt-1 text-sm text-slate-500">{intern.batch || 'Open Batch'}{intern.stack ? ` • ${intern.stack}` : ''}</p>
                    </div>
                </div>
                {canDelete && (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(intern._id);
                        }}
                        className="rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                        title="Remove intern"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="relative mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-indigo-600" />
                    <span className="truncate">{intern.email}</span>
                </div>
                {intern.phone && (
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-indigo-600" />
                        <span>{intern.phone}</span>
                    </div>
                )}
                {intern.summary && <p className="pt-2 leading-relaxed text-slate-500">{intern.summary}</p>}
            </div>
        </motion.div>
    );
};

const InternPeopleHub = ({ isDashboard = false }) => {
    const { user, logout } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const role = user?.role || '';
    const navigate = useNavigate();

    const [sectionOpen, setSectionOpen] = useState(true);
    const [internPeople, setInternPeople] = useState([]);
    const [loadingInterns, setLoadingInterns] = useState(false);
    const [savingIntern, setSavingIntern] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [manualForm, setManualForm] = useState(defaultInternForm);

    const stats = useMemo(() => ([
        { label: 'Active Profiles', value: internPeople.filter(person => person.status !== 'inactive').length },
        { label: 'Total Records', value: internPeople.length },
        { label: 'Admin Mode', value: isAdmin ? 'Unlocked' : 'Locked' }
    ]), [internPeople, isAdmin]);

    const fetchInternPeople = async () => {
        setLoadingInterns(true);
        try {
            const response = await api.get('/interns');
            setInternPeople(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to load intern people');
        } finally {
            setLoadingInterns(false);
        }
    };

    useEffect(() => {
        fetchInternPeople();
    }, []);

    const handleCardClick = (intern) => {
        if (isDashboard) {
            window.open(`/intern-profile/${intern._id}`, '_blank');
        } else {
            navigate(`/intern-profile/${intern._id}`);
        }
    };

    const handleCreateIntern = async (event) => {
        event.preventDefault();
        setSavingIntern(true);

        try {
            const response = await api.post('/interns', manualForm);
            setInternPeople(prev => [response.data.data, ...prev]);
            setManualForm(defaultInternForm);
            toast.success('Intern profile added successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add intern profile');
        } finally {
            setSavingIntern(false);
        }
    };

    const handleDeleteIntern = async (id) => {
        if (!window.confirm('Remove this intern profile?')) {
            return;
        }

        try {
            await api.delete(`/interns/${id}`);
            setInternPeople(prev => prev.filter(person => person._id !== id));
            toast.success('Intern profile removed');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete intern profile');
        }
    };

    const handleExcelUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            toast.warning('Please choose an Excel file first');
            return;
        }

        setUploading(true);

        try {
            const buffer = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            const internPeopleData = rows
                .map(normalizeExcelRow)
                .filter(person => person.name && person.email);

            if (!internPeopleData.length) {
                toast.error('No valid intern rows found in the Excel file');
                return;
            }

            const response = await api.post('/interns/bulk', { internPeople: internPeopleData });
            toast.success(response.data.message || 'Excel data uploaded successfully');
            setSelectedFile(null);
            event.target.reset();
            await fetchInternPeople();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to upload Excel file');
        } finally {
            setUploading(false);
        }
    };

    // Dashboard View Render
    if (isDashboard) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 text-slate-900">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Intern Profiles Directory</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage public intern profiles. Click a card to view their profile page in a new tab.</p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <div className="space-y-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Active Profiles</p>
                                <p className="mt-2 text-2xl font-black text-slate-950">{internPeople.filter(person => person.status !== 'inactive').length}</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total Records</p>
                                <p className="mt-2 text-2xl font-black text-slate-950">{internPeople.length}</p>
                            </div>
                        </div>

                        {loadingInterns ? (
                            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-slate-500">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-600" />
                                Loading intern profiles...
                            </div>
                        ) : internPeople.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-slate-500">
                                <UserCircle2 size={42} className="mx-auto mb-4 text-slate-400" />
                                <p className="text-lg font-semibold text-slate-800">No intern profiles yet.</p>
                                <p className="mt-2 text-sm text-slate-500">Add profiles manually or import from an Excel sheet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {internPeople.map(intern => (
                                    <InternCard
                                        key={intern._id}
                                        intern={intern}
                                        canDelete={true}
                                        onDelete={handleDeleteIntern}
                                        onSelect={handleCardClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleCreateIntern} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Add Intern Profile</h3>
                                    <p className="text-xs text-gray-500">Create a new profile manually.</p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <input
                                    required
                                    type="text"
                                    placeholder="Full name"
                                    value={manualForm.name}
                                    onChange={(event) => setManualForm(prev => ({ ...prev, name: event.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email address"
                                    value={manualForm.email}
                                    onChange={(event) => setManualForm(prev => ({ ...prev, email: event.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        value={manualForm.phone}
                                        onChange={(event) => setManualForm(prev => ({ ...prev, phone: event.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Batch"
                                        value={manualForm.batch}
                                        onChange={(event) => setManualForm(prev => ({ ...prev, batch: event.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Role"
                                        value={manualForm.role}
                                        onChange={(event) => setManualForm(prev => ({ ...prev, role: event.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Stack / Skills"
                                        value={manualForm.stack}
                                        onChange={(event) => setManualForm(prev => ({ ...prev, stack: event.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <textarea
                                    rows="3"
                                    placeholder="Short summary"
                                    value={manualForm.summary}
                                    onChange={(event) => setManualForm(prev => ({ ...prev, summary: event.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <input
                                    type="url"
                                    placeholder="Photo URL (optional)"
                                    value={manualForm.photoUrl}
                                    onChange={(event) => setManualForm(prev => ({ ...prev, photoUrl: event.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    disabled={savingIntern}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {savingIntern ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                                    {savingIntern ? 'Saving...' : 'Add Profile'}
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handleExcelUpload} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                                    <Upload size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Import Excel</h3>
                                    <p className="text-xs text-gray-500">Bulk upload intern profiles.</p>
                                </div>
                            </div>

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                                className="mb-3 block w-full rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            <button
                                type="submit"
                                disabled={uploading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                            >
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp size={16} />}
                                {uploading ? 'Uploading...' : 'Import Excel Sheet'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Public View Render
    return (
        <section className="mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-[#0A0B1A] text-white shadow-[0_30px_80px_rgba(10,11,26,0.35)]">
            <ToastContainer position="top-right" autoClose={3500} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,_rgba(10,11,26,1),_rgba(17,24,39,1))]" />
            <div className="relative z-10 p-8 md:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-cyan-100">
                            Intern peoples
                        </span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Intern Peoples Directory</h2>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                            Open the directory to view every intern profile. Click a card to view their profile page.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {user && (role === 'admin' || role === 'teacher') && (
                            <button
                                type="button"
                                onClick={() => navigate(`/dashboard/${role}`)}
                                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5"
                            >
                                <Users size={16} />
                                Staff Dashboard
                            </button>
                        )}
                        {user && (
                            <button
                                type="button"
                                onClick={logout}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        )}
                    </div>
                </div>

                {sectionOpen && (
                    <div className={`mt-10 grid gap-6 ${isAdmin ? 'xl:grid-cols-[1.4fr_0.9fr]' : 'grid-cols-1'}`}>
                        <div className="space-y-6">
                            <div className="grid gap-3 sm:grid-cols-3">
                                {stats.map(stat => (
                                    <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">{stat.label}</p>
                                        <p className="mt-3 text-2xl font-black text-white">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {loadingInterns ? (
                                <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/8 text-slate-200">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Loading intern profiles...
                                </div>
                            ) : internPeople.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-white/15 bg-white/8 p-10 text-center text-slate-300">
                                    <UserCircle2 size={42} className="mx-auto mb-4 text-cyan-200" />
                                    <p className="text-lg font-semibold text-white">No intern profiles yet.</p>
                                    <p className="mt-2 text-sm text-slate-400">Add profiles manually or upload an Excel sheet to build the directory.</p>
                                </div>
                            ) : (
                                <div className={`grid gap-4 md:grid-cols-2 ${isAdmin ? '2xl:grid-cols-2' : 'lg:grid-cols-3'}`}>
                                    {internPeople.map(intern => (
                                        <InternCard
                                            key={intern._id}
                                            intern={intern}
                                            canDelete={isAdmin}
                                            onDelete={handleDeleteIntern}
                                            onSelect={handleCardClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {isAdmin && (
                            <div className="space-y-6">
                                <motion.form
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onSubmit={handleCreateIntern}
                                    className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                                >
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-100">
                                            <Plus size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-white">Add Intern</h3>
                                            <p className="text-sm text-slate-300">Create a new profile manually.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full name"
                                            value={manualForm.name}
                                            onChange={(event) => setManualForm(prev => ({ ...prev, name: event.target.value }))}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                        />
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email address"
                                            value={manualForm.email}
                                            onChange={(event) => setManualForm(prev => ({ ...prev, email: event.target.value }))}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                        />
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <input
                                                type="text"
                                                placeholder="Phone"
                                                value={manualForm.phone}
                                                onChange={(event) => setManualForm(prev => ({ ...prev, phone: event.target.value }))}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Batch"
                                                value={manualForm.batch}
                                                onChange={(event) => setManualForm(prev => ({ ...prev, batch: event.target.value }))}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <input
                                                type="text"
                                                placeholder="Role"
                                                value={manualForm.role}
                                                onChange={(event) => setManualForm(prev => ({ ...prev, role: event.target.value }))}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Stack / Skills"
                                                value={manualForm.stack}
                                                onChange={(event) => setManualForm(prev => ({ ...prev, stack: event.target.value }))}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                            />
                                        </div>
                                        <textarea
                                            rows="4"
                                            placeholder="Short summary"
                                            value={manualForm.summary}
                                            onChange={(event) => setManualForm(prev => ({ ...prev, summary: event.target.value }))}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Photo URL (optional)"
                                            value={manualForm.photoUrl}
                                            onChange={(event) => setManualForm(prev => ({ ...prev, photoUrl: event.target.value }))}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={savingIntern}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {savingIntern ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                                            {savingIntern ? 'Saving...' : 'Add Intern'}
                                        </button>
                                    </div>
                                </motion.form>

                                <motion.form
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onSubmit={handleExcelUpload}
                                    className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-2xl bg-indigo-400/15 p-3 text-indigo-100">
                                            <Upload size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-white">Upload Excel</h3>
                                            <p className="text-sm text-slate-300">Rows should include name, email, phone, batch, stack, and summary columns.</p>
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                                        className="mb-4 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-bold file:text-slate-950 hover:file:bg-cyan-300"
                                    />
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp size={16} />}
                                        {uploading ? 'Uploading...' : 'Import Excel Sheet'}
                                    </button>
                                </motion.form>

                                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                                            <p className="text-sm text-slate-300">Refresh the public list.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={fetchInternPeople}
                                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                                            >
                                                <RefreshCw size={14} />
                                                Refresh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default InternPeopleHub;