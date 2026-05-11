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
                        className="bg-white relative flex flex-col items-center justify-between text-center shrink-0"
                        style={{
                            width: '1000px',
                            height: '707px',
                            border: '30px solid #0f172a',
                            padding: '60px 40px',
                            fontFamily: 'serif',
                            backgroundColor: '#ffffff', // Explicitly set background
                        }}
                    >
                        {/* Decorative Borders */}
                        <div className="absolute border-[5px]" style={{ inset: '5px', borderColor: '#c5a059', pointerEvents: 'none', borderStyle: 'solid' }}></div>
                        <div className="absolute border" style={{ inset: '12px', borderColor: '#0f172a', pointerEvents: 'none', borderStyle: 'solid' }}></div>

                        {/* Header */}
                        <div>
                            <div className="font-extrabold uppercase mb-1 tracking-[8px] text-[10px]" style={{ color: '#c5a059' }}>
                                Official Digital Verification
                            </div>
                            <div className="font-extrabold mb-0 text-4xl" style={{ color: '#0f172a', fontFamily: 'sans-serif' }}>
                                EduSmart<span style={{ color: '#c5a059' }}>.</span> Learning
                            </div>
                        </div>

                        {/* Main Title Area */}
                        <div className="mt-6">
                            <div className="italic font-extrabold text-[58px] leading-none" style={{ color: '#0f172a' }}>
                                Certificate of Completion
                            </div>
                            <p className="uppercase mt-4 mb-0 text-xs tracking-[4px]" style={{ color: '#6b7280' }}>
                                This prestigious award is presented to
                            </p>
                        </div>

                        {/* Student Name */}
                        <div className="border-b-2 w-3/4 pb-2" style={{ borderColor: '#e5e7eb' }}>
                            <div className="font-extrabold capitalize text-[72px] leading-none" style={{ color: '#1e3a8a' }}>
                                {data.studentName}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="max-w-[700px]">
                            <p className="italic mb-3 text-base" style={{ color: '#475569' }}>
                                In recognition of successful mastery and fulfillment of all academic requirements for the program in
                            </p>
                            <div className="font-extrabold uppercase text-[28px] leading-tight" style={{ color: '#312e81' }}>
                                {data.courseTitle}
                            </div>
                        </div>

                        {/* Performance Scores Section */}
                        <div className="flex flex-col items-center pt-5 w-[80%] gap-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                            <div className="flex justify-center gap-12 text-center w-full">
                                <div>
                                    <div className="uppercase text-[8px] font-bold tracking-wider" style={{ color: '#9ca3af', fontFamily: 'sans-serif' }}>Lectures Watch</div>
                                    <div className="font-extrabold text-lg" style={{ color: '#1e3a8a' }}>{data.videoScore || 0}%</div>
                                </div>
                                <div>
                                    <div className="uppercase text-[8px] font-bold tracking-wider" style={{ color: '#9ca3af', fontFamily: 'sans-serif' }}>Assignments</div>
                                    <div className="font-extrabold text-lg" style={{ color: '#1e3a8a' }}>{data.assignmentScore || 0}/30</div>
                                </div>
                                <div>
                                    <div className="uppercase text-[8px] font-bold tracking-wider" style={{ color: '#9ca3af', fontFamily: 'sans-serif' }}>Quiz Score</div>
                                    <div className="font-extrabold text-lg" style={{ color: '#1e3a8a' }}>{data.quizScore || 0}%</div>
                                </div>
                                <div className="pl-12" style={{ borderLeft: '2px solid #e5e7eb' }}>
                                    <div className="uppercase text-[10px] font-bold tracking-wider" style={{ color: '#6b7280', fontFamily: 'sans-serif' }}>Final Grade</div>
                                    <div className="font-extrabold text-2xl" style={{ color: '#c5a059' }}>{data.finalScore || 0}%</div>
                                </div>
                            </div>
                            {data.assignmentFeedback && (
                                <div className="mt-4 px-10">
                                    <div className="uppercase text-[9px] font-black tracking-widest mb-1" style={{ color: '#c5a059', fontFamily: 'sans-serif' }}>Instructor Remarks</div>
                                    <div className="text-[11px] italic max-w-[600px] leading-relaxed" style={{ color: '#475569' }}>
                                        "{data.assignmentFeedback}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer: Signatures and Seal */}
                        <div className="w-full flex justify-between items-center px-12 mt-4">
                            <div className="w-[200px]">
                                <div className="italic pb-2 text-[20px]" style={{ color: '#1e3a8a', borderBottom: '1px solid #d1d5db' }}>EduSmart AI</div>
                                <div className="uppercase mt-2 text-[9px] font-bold tracking-wider" style={{ color: '#6b7280', fontFamily: 'sans-serif' }}>Registrar</div>
                            </div>

                            {/* Seal */}
                            <div className="rounded-full flex items-center justify-center shadow-lg"
                                style={{
                                    width: '100px', height: '100px', backgroundColor: '#c5a059',
                                    border: '4px solid #ae8a41'
                                }}>
                                <IoShieldCheckmarkOutline size={50} color="white" />
                            </div>

                            <div className="w-[200px]">
                                <div className="font-bold pb-2 text-[20px]" style={{ color: '#1e3a8a', borderBottom: '1px solid #d1d5db', fontFamily: 'sans-serif' }}>
                                    {new Date(data.completionDate).toLocaleDateString()}
                                </div>
                                <div className="uppercase mt-2 text-[9px] font-bold tracking-wider" style={{ color: '#6b7280', fontFamily: 'sans-serif' }}>Date of Issuance</div>
                            </div>
                        </div>

                        {/* Certificate ID */}
                        <div className="font-normal opacity-50 text-[9px] mt-2 text-left w-full pl-8" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
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