"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Loader2, Eye, Trash2 } from "lucide-react";

interface DocumentUploaderProps {
    qualification: "TENTH" | "TWELFTH" | "UG" | "PG";
    initialData?: Record<string, string>;
    onComplete: () => void;
}

export default function DocumentUploader({ qualification, initialData = {}, onComplete }: DocumentUploaderProps) {
    const [loading, setLoading] = useState(false);
    // Store uploaded files data: { file, previewUrl }
    // Initialize from initialData if present
    const [uploads, setUploads] = useState<Record<string, { file?: File; previewUrl: string }>>(() => {
        const initial: Record<string, { previewUrl: string }> = {};
        Object.entries(initialData).forEach(([key, url]) => {
            if (url) initial[key] = { previewUrl: url };
        });
        return initial;
    });
    const [activeDoc, setActiveDoc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const requireddocs = {
        TENTH: [{ key: "marksheet10th", label: "10th Marksheet" }],
        TWELFTH: [
            { key: "marksheet10th", label: "10th Marksheet" },
            { key: "marksheet12th", label: "12th Marksheet" },
        ],
        UG: [
            { key: "resume", label: "Resume" },
            { key: "marksheet10th", label: "10th Marksheet" },
            { key: "marksheet12th", label: "12th Marksheet" },
            { key: "highestMarkSheet", label: "UG Marksheet" },
        ],
        PG: [
            { key: "resume", label: "Resume" },
            { key: "marksheet10th", label: "10th Marksheet" },
            { key: "marksheet12th", label: "12th Marksheet" },
            { key: "highestMarkSheet", label: "PG Marksheet" },
        ],
    };

    const docs = requireddocs[qualification] || requireddocs.TENTH;

    const handleUploadClick = (key: string) => {
        setActiveDoc(key);
        // Add specific file constraints if needed (e.g. accept=".pdf,.jpg")
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeDoc) return;

        setLoading(true);
        try {
            // Mock upload delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const previewUrl = URL.createObjectURL(file);
            setUploads((prev) => ({
                ...prev,
                [activeDoc]: { file, previewUrl }
            }));
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
            setActiveDoc(null);
            // Reset input so validation works if same file selected again
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = (key: string) => {
        const doc = uploads[key];
        if (doc) {
            // Only revoke if it was created by us (blob:) not if it came from server (string)
            if (doc.previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(doc.previewUrl);
            }
            setUploads((prev) => {
                const newUploads = { ...prev };
                delete newUploads[key];
                return newUploads;
            });
        }
    };

    const handleView = (key: string) => {
        const doc = uploads[key];
        if (doc) {
            window.open(doc.previewUrl, "_blank");
        }
    };

    async function handleSubmit() {
        setLoading(true);
        try {
            // 1. Prepare data mapping keys to URLs
            // For real app: Upload each file to storage -> get URL.
            // For now: We mock by using the local previewURL or a placeholder string if it's a new file.
            // If we have API for upload, we'd loop through `uploads` and POST `formData`.

            const payload: Record<string, string> = {};
            Object.entries(uploads).forEach(([key, data]) => {
                // If it's a blob url (new file), in real app we upload it. 
                // Here we just save a mock string so DB knows it exists.
                if (data.file) {
                    payload[key] = "https://mock.url/uploaded-file.pdf";
                } else {
                    payload[key] = data.previewUrl; // Keep existing
                }
            });

            const res = await fetch("/api/user/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onComplete();
            } else {
                console.error("Failed to save documents");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const allUploaded = docs.every((d) => uploads[d.key]);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Upload Documents</h2>
                <p className="text-slate-500">
                    Please upload the following documents to verify your profile
                </p>
                {Object.keys(uploads).length > 0 && (
                    <p className="text-yellow-400 text-xs text-center">
                        Note: Click "Complete Profile" to save your changes.
                    </p>
                )}
            </div>

            <div className="grid gap-4">
                {docs.map((doc) => (
                    <div
                        key={doc.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-slate-700">{doc.label}</span>
                        </div>

                        {uploads[doc.key] ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-green-400 mr-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">Uploaded</span>
                                </div>

                                <button
                                    onClick={() => handleView(doc.key)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(doc.key)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                    title="Delete / Re-upload"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                disabled={loading}
                                onClick={() => handleUploadClick(doc.key)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!allUploaded || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Complete Profile"}
            </button>
        </div>
    );
}
