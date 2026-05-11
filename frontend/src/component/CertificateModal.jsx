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
                            padding: '60px 40px',
                            fontFamily: 'serif',
                            backgroundColor: '#ffffff',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                            flexShrink: 0,
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Decorative Borders */}
                        <div style={{ position: 'absolute', inset: '5px', border: '5px solid #c5a059', pointerEvents: 'none', borderStyle: 'solid', boxSizing: 'border-box' }}></div>
                        <div style={{ position: 'absolute', inset: '12px', border: '1px solid #0f172a', pointerEvents: 'none', borderStyle: 'solid', boxSizing: 'border-box' }}></div>

                        {/* Header */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '8px', fontSize: '10px', color: '#c5a059' }}>
                                Official Digital Verification
                            </div>
                            <div style={{ fontWeight: '800', marginBottom: '0', fontSize: '36px', color: '#0f172a', fontFamily: 'sans-serif' }}>
                                EduSmart<span style={{ color: '#c5a059' }}>.</span> Learning
                            </div>
                        </div>

                        {/* Main Title Area */}
                        <div style={{ marginTop: '24px' }}>
                            <div style={{ fontStyle: 'italic', fontWeight: '800', fontSize: '58px', lineHeight: '1', color: '#0f172a' }}>
                                Certificate of Completion
                            </div>
                            <p style={{ textTransform: 'uppercase', marginTop: '16px', marginBottom: '0', fontSize: '12px', letterSpacing: '4px', color: '#6b7280' }}>
                                This prestigious award is presented to
                            </p>
                        </div>

                        {/* Student Name */}
                        <div style={{ borderBottom: '2px solid #e5e7eb', width: '75%', paddingBottom: '8px', marginBottom: '20px' }}>
                            <div style={{ fontWeight: '800', textTransform: 'capitalize', fontSize: '72px', lineHeight: '1', color: '#1e3a8a' }}>
                                {data.studentName}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div style={{ maxWidth: '700px', marginBottom: '20px' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '12px', fontSize: '16px', color: '#475569' }}>
                                In recognition of successful mastery and fulfillment of all academic requirements for the program in
                            </p>
                            <div style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '28px', lineHeight: '1.2', color: '#312e81' }}>
                                {data.courseTitle}
                            </div>
                        </div>

                        {/* Performance Scores Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', width: '80%', gap: '16px', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', textAlign: 'center', width: '100%' }}>
                                <div>
                                    <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '8px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Lectures Watch</div>
                                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e3a8a' }}>{data.videoScore || 0}%</div>
                                </div>
                                <div>
                                    <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '8px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Assignments</div>
                                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e3a8a' }}>{data.assignmentScore || 0}/30</div>
                                </div>
                                <div>
                                    <div style={{ textTransform: 'uppercase', color: '#9ca3af', fontSize: '8px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Quiz Score</div>
                                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e3a8a' }}>{data.quizScore || 0}%</div>
                                </div>
                                <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '48px' }}>
                                    <div style={{ textTransform: 'uppercase', color: '#6b7280', fontSize: '10px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Final Grade</div>
                                    <div style={{ fontWeight: '800', fontSize: '24px', color: '#c5a059' }}>{data.finalScore || 0}%</div>
                                </div>
                            </div>
                            {data.assignmentFeedback && (
                                <div style={{ marginTop: '16px', paddingLeft: '40px', paddingRight: '40px' }}>
                                    <div style={{ textTransform: 'uppercase', color: '#c5a059', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '4px' }}>Instructor Remarks</div>
                                    <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#475569', maxWidth: '600px', lineHeight: '1.5' }}>
                                        "{data.assignmentFeedback}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer: Signatures and Seal */}
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '48px', paddingRight: '48px', marginTop: '16px' }}>
                            <div style={{ width: '200px' }}>
                                <div style={{ fontStyle: 'italic', borderBottom: '1px solid #d1d5db', paddingBottom: '8px', fontSize: '20px', color: '#1e3a8a' }}>EduSmart AI</div>
                                <div style={{ textTransform: 'uppercase', color: '#6b7280', marginTop: '8px', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Registrar</div>
                            </div>

                            {/* Seal */}
                            <div style={{
                                width: '100px', height: '100px', backgroundColor: '#c5a059',
                                border: '4px solid #ae8a41', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <IoShieldCheckmarkOutline size={50} color="white" />
                            </div>

                            <div style={{ width: '200px' }}>
                                <div style={{ fontWeight: '700', borderBottom: '1px solid #d1d5db', paddingBottom: '8px', fontSize: '20px', fontFamily: 'sans-serif', color: '#1e3a8a' }}>
                                    {new Date(data.completionDate).toLocaleDateString()}
                                </div>
                                <div style={{ textTransform: 'uppercase', color: '#6b7280', marginTop: '8px', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '0.05em' }}>Date of Issuance</div>
                            </div>
                        </div>

                        {/* Certificate ID */}
                        <div style={{ color: '#9ca3af', fontWeight: '400', opacity: '0.5', fontSize: '9px', fontFamily: 'monospace', marginTop: '8px', textAlign: 'left', width: '100%', paddingLeft: '32px' }}>
                            ID: {data.certificateId || "EDU-CERT-8821"}
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