import React, { useRef } from 'react';
import { IoClose, IoCloudDownloadOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const CertificateModal = ({ isOpen, onClose, data }) => {
    const certificateRef = useRef();

    if (!isOpen || !data) return null;

    const downloadCertificate = async () => {
        const id = toast.loading("Finalizing your high-resolution certificate...");
        try {
            const element = certificateRef.current;
            if (!element) throw new Error("Certificate element is not ready");

            // Wait for fonts to be ready
            await document.fonts.ready;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${(data.studentName || "Student").replace(/\s+/g, '_')}_Certificate.pdf`);

            toast.update(id, { render: "Certificate Saved!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error("PDF Generation Failure:", error);
            toast.update(id, { render: `Error: ${error.message || "Failed to generate PDF"}`, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 200, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(40px)' }}>
            <div className="relative w-full max-w-[1140px] flex flex-col items-center py-12 mb-auto mt-auto">

                {/* Close Button */}
                <div className="w-full max-w-[1000px] flex justify-end mb-4">
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 p-2 font-bold uppercase tracking-[2px] text-[10px]">
                        <IoClose size={20} /> Close
                    </button>
                </div>

                {/* Certificate Wrapper for Scrolling on small screens */}
                <div className="w-full overflow-x-auto flex justify-center pb-4 scrollbar-hide">
                    {/* Certificate Content */}
                    <div
                        ref={certificateRef}
                        style={{
                            width: '1000px',
                            height: '707px',
                            border: '30px solid #0f172a',
                            padding: '40px',
                            fontFamily: 'serif',
                            backgroundColor: '#ffffff',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Borders */}
                        <div style={{ position: 'absolute', inset: '5px', border: '5px solid #c5a059', pointerEvents: 'none', borderStyle: 'solid', boxSizing: 'border-box' }}></div>
                        <div style={{ position: 'absolute', inset: '12px', border: '1px solid #0f172a', pointerEvents: 'none', borderStyle: 'solid', boxSizing: 'border-box' }}></div>

                        {/* Header Section */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <div style={{ fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '6px', fontSize: '12px', color: '#c5a059', fontFamily: 'sans-serif' }}>
                                Official Digital Certification
                            </div>
                            <div style={{ fontWeight: '900', fontSize: '42px', color: '#0f172a', fontFamily: 'sans-serif' }}>
                                EduSmart<span style={{ color: '#c5a059' }}>.</span> Learning
                            </div>
                        </div>

                        {/* Title Section */}
                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <div style={{ fontStyle: 'italic', fontWeight: '800', fontSize: '64px', lineHeight: '1', color: '#0f172a', marginBottom: '10px' }}>
                                Certificate of Completion
                            </div>
                            <p style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '4px', color: '#6b7280', margin: '0', fontWeight: '600' }}>
                                This prestigious award is presented to
                            </p>
                        </div>

                        {/* Student Name Section */}
                        <div style={{ marginTop: '30px', borderBottom: '2px solid #e5e7eb', width: '70%', paddingBottom: '10px', textAlign: 'center' }}>
                            <div style={{ fontWeight: '800', textTransform: 'capitalize', fontSize: '68px', lineHeight: '1', color: '#1e3a8a' }}>
                                {data.studentName}
                            </div>
                        </div>

                        {/* Course Info Section */}
                        <div style={{ marginTop: '25px', maxWidth: '750px', textAlign: 'center' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '10px', fontSize: '16px', color: '#475569', lineHeight: '1.5' }}>
                                In recognition of successful mastery and fulfillment of all academic requirements for the program in
                            </p>
                            <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '32px', lineHeight: '1.2', color: '#312e81' }}>
                                {data.courseTitle}
                            </div>
                        </div>

                        {/* Metrics Section */}
                        <div style={{ marginTop: '40px', width: '85%', display: 'flex', justifyContent: 'center', gap: '60px', paddingTop: '25px', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>Lectures</div>
                                <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e3a8a' }}>{data.videoScore || 0}%</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>Assignments</div>
                                <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e3a8a' }}>{data.assignmentScore || 0}/30</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>Quiz</div>
                                <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e3a8a' }}>{data.quizScore || 0}%</div>
                            </div>
                            <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '60px', textAlign: 'center' }}>
                                <div style={{ textTransform: 'uppercase', color: '#6b7280', fontSize: '11px', fontFamily: 'sans-serif', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>Grade</div>
                                <div style={{ fontWeight: '900', fontSize: '28px', color: '#c5a059' }}>{data.finalScore || 0}%</div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div style={{ position: 'absolute', bottom: '60px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 80px', boxSizing: 'border-box' }}>
                            <div style={{ width: '220px', textAlign: 'center' }}>
                                <div style={{ fontStyle: 'italic', borderBottom: '1px solid #d1d5db', paddingBottom: '10px', fontSize: '22px', color: '#1e3a8a', fontFamily: 'serif' }}>EduSmart AI</div>
                                <div style={{ textTransform: 'uppercase', color: '#6b7280', marginTop: '10px', fontSize: '10px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '1px' }}>Registrar</div>
                            </div>

                            {/* Seal */}
                            <div style={{
                                width: '110px', height: '110px', backgroundColor: '#c5a059',
                                border: '5px solid #ae8a41', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(197, 160, 89, 0.3)',
                                marginBottom: '-10px'
                            }}>
                                <IoShieldCheckmarkOutline size={55} color="white" />
                            </div>

                            <div style={{ width: '220px', textAlign: 'center' }}>
                                <div style={{ fontWeight: '700', borderBottom: '1px solid #d1d5db', paddingBottom: '10px', fontSize: '20px', fontFamily: 'sans-serif', color: '#1e3a8a' }}>
                                    {new Date(data.completionDate).toLocaleDateString()}
                                </div>
                                <div style={{ textTransform: 'uppercase', color: '#6b7280', marginTop: '10px', fontSize: '10px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '1px' }}>Date of Issuance</div>
                            </div>
                        </div>

                        {/* Certificate ID */}
                        <div style={{ position: 'absolute', bottom: '25px', left: '40px', color: '#9ca3af', fontWeight: '400', opacity: '0.6', fontSize: '10px', fontFamily: 'monospace' }}>
                            VERIFICATION ID: {data.certificateId || "EDU-CERT-8821"}
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button onClick={downloadCertificate} className="mt-10 flex items-center gap-3 rounded-full px-12 py-4 border-0 shadow-xl text-white font-extrabold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c5a059]/40"
                    style={{ backgroundColor: '#c5a059', fontSize: '18px' }}>
                    <IoCloudDownloadOutline size={28} /> Download Certificate
                </button>
            </div>
        </div>
    );
};

export default CertificateModal;