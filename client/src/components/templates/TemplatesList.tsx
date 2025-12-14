"use client";

import { useEffect, useState } from "react";
import { useTemplatesStore } from "@/store/useTemplatesStore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { TemplateEditor } from "./TemplateEditor";

export default function TemplatesList() {

    const { templates, isLoading, fetchTemplates, filterCategory, searchQuery, setFilterCategory, setSearchQuery } = useTemplatesStore();
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {

        fetchTemplates();
    }, [fetchTemplates]);

    const filteredTemplates = (templates || []).filter(template => {
        const matchesCategory = filterCategory && filterCategory !== "ALL" ? template.category === filterCategory : true;
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (template.components || []).some(c => 'text' in c && c.text?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handlePreview = (template: any) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={filterCategory || "ALL"} onValueChange={(val) => setFilterCategory(val === "ALL" ? null : val)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value="MARKETING">Marketing</SelectItem>
                            <SelectItem value="UTILITY">Utility</SelectItem>
                            <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="w-full sm:w-auto" onClick={() => setIsEditorOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </div>
            </div>


            {/* Templates Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[250px] bg-muted/20 animate-pulse rounded-xl border" />
                    ))}
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No templates found</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Try adjusting your search or filters, or create a new template to get started.
                    </p>
                    <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterCategory(null); }}>
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <Card key={template.id || index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-muted" onClick={() => handlePreview(template)}>
                            <CardHeader className="pb-3 space-y-0">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2">
                                        {template.category}
                                    </Badge>
                                    <div title={template.status} className="flex items-center">
                                        {getStatusIcon(template.status)}
                                    </div>
                                </div>
                                <CardTitle className="text-lg font-semibold truncate pr-2">
                                    {template.name}
                                </CardTitle>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>{template.language}</span>
                                    <span>•</span>
                                    <span>Updated {(() => {
                                        try {
                                            const date = new Date(template.lastUpdated);
                                            if (isNaN(date.getTime())) return "Unknown date";
                                            return formatDistanceToNow(date) + " ago";
                                        } catch (e) {
                                            return "Unknown date";
                                        }
                                    })()}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/30 p-3 rounded-md min-h-[4.5rem]">
                                    {template.components.find(c => c.type === 'BODY' && 'text' in c)?.text || "No content preview"}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground border-t bg-muted/5 p-3">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <ArrowUpRight className="h-3 w-3" />
                                        {template.usageCount?.toLocaleString() || 0} sent
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Preview
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <TemplatePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                template={selectedTemplate}
            />
        </div>
    );
}

function ArrowUpRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </svg>
    )
}
