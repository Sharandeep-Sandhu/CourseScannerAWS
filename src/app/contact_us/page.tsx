"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function Component() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        purpose: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, purpose: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!formData.purpose) {
            setError("Purpose is required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://backend-jet-nine.vercel.app/api/contact", formData);
            setSuccess(response.data.message);
            setFormData({
                name: "",
                email: "",
                purpose: "",
                message: ""
            });
        } catch (error: any) {
            setError(error.response?.data?.error || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16 text-white">
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in Touch</h1>
                    <p className="mt-3 text-lg text-muted-foreground">
                        Have a question or want to work together? Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="purpose">Purpose</Label>
                        <Select value={formData.purpose} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="individual">Individual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" value={formData.message} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
}
