import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Mail, Phone, MapPin, ShieldCheck, ArrowLeft, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import api from '../../utils/api';
import { maskEmail, maskPhone } from '../../utils/masking';

const InternPublicProfile = () => {
    const { internId } = useParams();
    const [intern, setIntern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    const profileUrl = useMemo(() => {
        if (!internId) return '';
        return `${window.location.origin}/intern-profile/${internId}`;
    }, [internId]);

    useEffect(() => {
        const fetchIntern = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(`/interns/public/${internId}`);
                setIntern(response.data.data || null);
            } catch (err) {
                setError(err.response?.data?.error || 'Intern profile not found');
            } finally {
                setLoading(false);
            }
        };

        if (internId) {
            fetchIntern();
        }
    }, [internId]);

    const handleDownloadQr = (format = 'image') => {
        if (!intern) return;

        const svgElement = document.querySelector('[data-intern-qr-preview] svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        let svgSource = serializer.serializeToString(svgElement);
        if (!svgSource.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgSource = svgSource.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!svgSource.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
            svgSource = svgSource.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const blob = new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const pngUrl = canvas.toDataURL('image/png');
            const safeName = intern.name ? intern.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'intern';

            if (format === 'pdf') {
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [500, 500]
                });
                doc.addImage(pngUrl, 'PNG', 0, 0, 500, 500);
                doc.save(`${safeName}-qr.pdf`);
            } else {
                const anchor = document.createElement('a');
                anchor.href = pngUrl;
                anchor.download = `${safeName}-qr.png`;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827_0%,_#0f172a_40%,_#020617_100%)] px-4 py-10 sm:px-6 lg:px-8">
            <Helmet>
                <title>{intern ? `${intern.name} | Zentro Solutions` : 'Intern Profile | Zentro Solutions'}</title>
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="w-full rounded-[2rem] border border-white/10 bg-white/95 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 lg:p-8">
                    <div className="mb-5 flex justify-start">
                        <Link to="/intern-peoples" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5">
                            <ArrowLeft size={16} /> Back to Intern Peoples
                        </Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
                            {loading ? (
                                <div className="flex min-h-[260px] items-center justify-center text-slate-500">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading intern profile...
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">{error}</div>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-2xl font-black text-white shadow-lg">
                                            {intern?.photoUrl ? (
                                                <img src={intern.photoUrl} alt={intern.name} className="h-full w-full object-cover" />
                                            ) : (
                                                intern?.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'IN'
                                            )}
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                                <ShieldCheck size={14} /> Verified Intern
                                            </span>
                                            <h1 className="mt-3 text-3xl font-black text-slate-950">{intern?.name}</h1>
                                            <p className="mt-1 text-slate-500">Public profile verification page for QR scanning.</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email</p>
                                            <div className="mt-2 flex items-center gap-2 text-slate-700">
                                                <Mail size={16} className="text-indigo-600" /> {maskEmail(intern?.email)}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Phone</p>
                                            <div className="mt-2 flex items-center gap-2 text-slate-700">
                                                <Phone size={16} className="text-indigo-600" /> {maskPhone(intern?.phone) || 'Not provided'}
                                            </div>
                                        </div>
                                        {intern?.internId && (
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Intern ID</p>
                                                <div className="mt-2 flex items-center gap-2 text-slate-700 font-semibold">
                                                    {intern.internId}
                                                </div>
                                            </div>
                                        )}
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Batch</p>
                                            <div className="mt-2 flex items-center gap-2 text-slate-700">
                                                <MapPin size={16} className="text-indigo-600" /> {intern?.batch || 'Not assigned'}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Stack</p>
                                            <div className="mt-2 text-slate-700">{intern?.stack || 'Not listed'}</div>
                                        </div>
                                    </div>

                                    {intern?.summary && (
                                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-slate-600">
                                            {intern.summary}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-[#0A0B1A] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.20)]">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">QR Code</p>
                            <h2 className="mt-3 text-2xl font-black">Scan to verify profile</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                This QR opens the public intern profile page in the website.
                            </p>

                            <div data-intern-qr-preview className="mt-8 flex items-center justify-center rounded-[1.75rem] bg-white p-6 shadow-inner">
                                {profileUrl && <QRCodeSVG value={profileUrl} size={220} includeMargin />}
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowDownloadModal(true)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 shadow-lg"
                            >
                                <Download size={18} /> Download QR Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDownloadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#0A0B1A] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
                        <h3 className="text-xl font-black text-white">Choose Download Format</h3>
                        <p className="mt-2 text-sm text-slate-300">Would you like to download the QR code as an image or a PDF document?</p>
                        
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    handleDownloadQr('image');
                                    setShowDownloadModal(false);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 shadow-md"
                            >
                                Download as Image (PNG)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleDownloadQr('pdf');
                                    setShowDownloadModal(false);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 font-bold text-white transition hover:bg-white/15 shadow-md"
                            >
                                Download as PDF
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDownloadModal(false)}
                                className="mt-1 text-sm font-semibold text-slate-400 hover:text-white transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternPublicProfile;