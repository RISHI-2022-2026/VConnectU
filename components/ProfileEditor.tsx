"use client";

import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Briefcase, Award, Save, Edit3, X, ChevronRight, Check, MessageCircle, Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileEditorProps {
    user: any;
}

// Move these UI helper components outside to prevent re-mounting on every keystroke
const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        {children}
    </div>
);

const Field = ({ 
    label, 
    name, 
    value, 
    isEditing, 
    handleChange, 
    type = "text", 
    placeholder = "" 
}: { 
    label: string, 
    name: string, 
    value: string, 
    isEditing: boolean, 
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    type?: string, 
    placeholder?: string 
}) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</label>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100"
            />
        ) : (
            <p className="text-slate-900 dark:text-slate-100 font-medium text-sm py-2 px-1 border-b border-transparent">
                {value || <span className="text-slate-400 italic font-normal">Not provided</span>}
            </p>
        )}
    </div>
);

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        avatar: user.avatar || "",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        tenthSchool: user.tenthSchool || "",
        tenthPercent: user.tenthPercent || "",
        twelfthSchool: user.twelfthSchool || "",
        twelfthCollege: user.twelfthCollege || "",
        twelfthPercent: user.twelfthPercent || "",
        ugCollege: user.ugCollege || "",
        ugUniversity: user.ugUniversity || "",
        ugPercent: user.ugPercent || "",
        pgCollege: user.pgCollege || "",
        pgUniversity: user.pgUniversity || "",
        pgPercent: user.pgPercent || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            // Mock upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For now, create a base64 or blob URL to simulate upload
            // In a real app, you'd POST this to an upload endpoint
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
                setLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const resp = await fetch('/api/user/profile/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tenthPercent: formData.tenthPercent ? parseFloat(formData.tenthPercent.toString()) : null,
                    twelfthPercent: formData.twelfthPercent ? parseFloat(formData.twelfthPercent.toString()) : null,
                    ugPercent: formData.ugPercent ? parseFloat(formData.ugPercent.toString()) : null,
                    pgPercent: formData.pgPercent ? parseFloat(formData.pgPercent.toString()) : null,
                })
            });

            if (resp.ok) {
                setIsEditing(false);
                router.refresh();
            } else {
                alert("Failed to update profile");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Basic Info */}
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-8">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2 rounded-xl font-bold transition"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative group">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl overflow-hidden relative">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name && user.name[0]
                            )}
                            
                            {isEditing && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Camera className="w-8 h-8 text-white mb-1" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change</span>
                                </button>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 z-10">
                            <Award className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left pt-2">
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                            {user.name}
                        </h1>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">{user.qualification}</p>
                        
                        <div className="max-w-2xl">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block mb-1">About Me</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell peers about your background and interests..."
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-slate-900 dark:text-slate-100"
                                />
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 italic">
                                    {formData.bio || "No bio added yet. Add one to help peers find you!"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <Section title="Contact Info" icon={MessageCircle}>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block">Email (Read-only)</label>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="w-4 h-4 text-slate-400 mt-6" />
                            <div className="flex-1">
                                <Field label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} handleChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="w-4 h-4 text-slate-400 mt-6" />
                            <div className="flex-1">
                                <Field label="Current Address" name="address" value={formData.address} isEditing={isEditing} handleChange={handleChange} placeholder="City, Country" />
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Calendar className="w-4 h-4 text-slate-400 mt-6" />
                            <div className="flex-1">
                                <Field label="Date of Birth" name="dob" value={formData.dob} isEditing={isEditing} handleChange={handleChange} type="date" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Primary Education */}
                <Section title="Schooling" icon={BookOpen}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-bold text-indigo-500 mb-4 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" /> 10th Standard
                            </p>
                            <div className="grid gap-4">
                                <Field label="School Name" name="tenthSchool" value={formData.tenthSchool} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="Percentage / CGPA" name="tenthPercent" value={formData.tenthPercent.toString()} isEditing={isEditing} handleChange={handleChange} type="number" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold text-indigo-500 mb-4 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" /> 12th Standard
                            </p>
                            <div className="grid gap-4">
                                <Field label="School Name" name="twelfthSchool" value={formData.twelfthSchool} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="College Name" name="twelfthCollege" value={formData.twelfthCollege} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="Percentage / CGPA" name="twelfthPercent" value={formData.twelfthPercent.toString()} isEditing={isEditing} handleChange={handleChange} type="number" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Higher Education */}
                <Section title="Higher Education" icon={GraduationCap}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-bold text-indigo-500 mb-4 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" /> Under Graduation
                            </p>
                            <div className="grid gap-4">
                                <Field label="College Name" name="ugCollege" value={formData.ugCollege} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="University" name="ugUniversity" value={formData.ugUniversity} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="Percentage / CGPA" name="ugPercent" value={formData.ugPercent.toString()} isEditing={isEditing} handleChange={handleChange} type="number" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold text-indigo-500 mb-4 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" /> Post Graduation
                            </p>
                            <div className="grid gap-4">
                                <Field label="College Name" name="pgCollege" value={formData.pgCollege} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="University" name="pgUniversity" value={formData.pgUniversity} isEditing={isEditing} handleChange={handleChange} />
                                <Field label="Percentage / CGPA" name="pgPercent" value={formData.pgPercent.toString()} isEditing={isEditing} handleChange={handleChange} type="number" />
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
            
            {/* Disclaimer for Name/Email */}
            <div className="text-center">
                <p className="text-xs text-slate-400">
                    * Full Name and Email cannot be changed as they are linked to your official account and verified documents.
                </p>
            </div>
        </div>
    );
};
