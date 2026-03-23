"use client";

import { useState } from "react";
import { Loader2, ArrowRight, BookOpen, MapPin, Calendar, School, Building2 } from "lucide-react";

interface QualificationFormProps {
    qualification: "TENTH" | "TWELFTH" | "UG" | "PG";
    onComplete: () => void;
}

interface FormField {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    icon: any;
    required?: boolean;
    fullWidth?: boolean;
}

export default function QualificationForm({ qualification, onComplete }: QualificationFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/user/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onComplete();
            } else {
                console.error("Failed to save details");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    // Define fields based on qualification level
    // Common fields
    const personalFields: FormField[] = [
        { name: "firstName", label: "First Name", type: "text", placeholder: "e.g. John", icon: BookOpen, required: true },
        { name: "middleName", label: "Middle Name", type: "text", placeholder: "e.g. A.", icon: BookOpen, required: false },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "e.g. Doe", icon: BookOpen, required: true },
        { name: "dob", label: "Date of Birth", type: "date", icon: Calendar, required: true },
        { name: "address", label: "Address for Correspondence", type: "text", placeholder: "e.g. 123 Main St, City", icon: MapPin, required: true, fullWidth: true },
    ];

    const getEduFields = (): FormField[] => {
        const fields: FormField[] = [];

        // 10th logic: just need school and percent?
        // Actually, user said: "if we enter 10th ... enter school name, address, dob, percentage"
        // If 12th: "school name, college name, address, dob, 10th %, 12th %"
        // Let's build them up cumulatively or specifically as requested.

        // 10th Fields (always needed if >= 10th? No, specific to the level selected)
        // Adjusting logic: The user asked for specific fields *for that qualification selection*.

        if (qualification === "TENTH") {
            fields.push(
                { name: "tenthSchool", label: "School Name", placeholder: "e.g. St. Mary's High School", icon: School },
                { name: "tenthPercent", label: "10th Percentage", type: "number", placeholder: "e.g. 85.5", icon: BookOpen }
            );
        }

        if (qualification === "TWELFTH") {
            fields.push(
                { name: "tenthPercent", label: "10th Percentage", type: "number", placeholder: "e.g. 85.5", icon: BookOpen },
                { name: "twelfthSchool", label: "School Name (12th)", placeholder: "e.g. DPS", icon: School },
                { name: "twelfthCollege", label: "College Name (if applicable)", placeholder: "e.g. Junior College", icon: Building2 }, // User asked for School AND College name? "school name,college name"
                { name: "twelfthPercent", label: "12th Percentage", type: "number", placeholder: "e.g. 88.0", icon: BookOpen }
            );
        }

        if (qualification === "UG") {
            fields.push(
                { name: "tenthPercent", label: "10th Percentage", type: "number", placeholder: "e.g. 85.5", icon: BookOpen },
                { name: "twelfthPercent", label: "12th Percentage", type: "number", placeholder: "e.g. 88.0", icon: BookOpen },
                { name: "ugCollege", label: "College Name", placeholder: "e.g. IIT Bombay", icon: Building2 },
                { name: "ugUniversity", label: "University Name", placeholder: "e.g. Mumbai University", icon: Building2 },
                { name: "ugPercent", label: "UG Percentage/CGPA", type: "number", placeholder: "e.g. 9.0", icon: BookOpen }
            );
        }

        if (qualification === "PG") {
            fields.push(
                { name: "tenthPercent", label: "10th Percentage", type: "number", placeholder: "e.g. 85.5", icon: BookOpen },
                { name: "twelfthPercent", label: "12th Percentage", type: "number", placeholder: "e.g. 88.0", icon: BookOpen },
                { name: "ugPercent", label: "UG Percentage/CGPA", type: "number", placeholder: "e.g. 9.0", icon: BookOpen },
                { name: "pgCollege", label: "PG College Name", placeholder: "e.g. MIT", icon: Building2 },
                { name: "pgUniversity", label: "University Name", placeholder: "e.g. MIT University", icon: Building2 },
                { name: "pgPercent", label: "PG Percentage/CGPA", type: "number", placeholder: "e.g. 9.5", icon: BookOpen }
            );
        }

        return fields;
    };

    const eduFields = getEduFields();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Qualification Details</h2>
                <p className="text-slate-500">
                    Please provide your educational background
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Fields */}
                    {personalFields.map((field) => (
                        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                {field.label}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <field.icon className="w-5 h-5" />
                                </div>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    required={field.required}
                                    placeholder={field.placeholder || ""}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Educational Fields */}
                    {eduFields.map((field) => (
                        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                {field.label}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <field.icon className="w-5 h-5" />
                                </div>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    required={true} // Assuming all are required
                                    placeholder={field.placeholder || ""}
                                    step={field.type === "number" ? "0.01" : undefined}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-8"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            Next Step <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
