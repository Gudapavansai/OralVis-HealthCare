import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Clock, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UploadDialog from '@/components/UploadDialog';
const TechnicianDashboard = () => {
    const { user } = useAuth();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [recentUploads, setRecentUploads] = useState([]);
    // Load recent uploads from localStorage
    React.useEffect(() => {
        const storedScans = localStorage.getItem('dentalApp_scans');
        if (storedScans) {
            try {
                const scans = JSON.parse(storedScans);
                const userScans = scans.filter(scan => scan.technicianId === (user === null || user === void 0 ? void 0 : user.id));
                setRecentUploads(userScans.slice(0, 5)); // Show last 5 uploads
            }
            catch (error) {
                console.error('Error loading scans:', error);
            }
        }
    }, [user === null || user === void 0 ? void 0 : user.id]);
    const handleUploadSuccess = (newScan) => {
        setRecentUploads(prev => [newScan, ...prev.slice(0, 4)]);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning text-warning-foreground';
            case 'reviewed':
                return 'bg-accent text-accent-foreground';
            case 'approved':
                return 'bg-success text-success-foreground';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    return (React.createElement("div", { className: "space-y-6 animate-fade-in-delayed" },
        React.createElement("div", { className: "text-center space-y-2" },
            React.createElement("h1", { className: "text-3xl font-bold text-gradient" },
                "Welcome back, ", user === null || user === void 0 ? void 0 :
                user.name,
                "!"),
            React.createElement("p", { className: "text-muted-foreground" }, "Upload and manage patient scans with ease")),
        React.createElement("div", { className: "grid gap-4 md:grid-cols-3" },
            React.createElement(Card, { className: "card-dashboard cursor-pointer", onClick: () => setIsUploadOpen(true) },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "New Upload"),
                    React.createElement(Upload, { className: "h-4 w-4 text-primary" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, "Upload Scans"),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Add new patient scans"))),
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Total Uploads"),
                    React.createElement(FileText, { className: "h-4 w-4 text-accent" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, recentUploads.length),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "This session"))),
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Pending Review"),
                    React.createElement(Clock, { className: "h-4 w-4 text-warning" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, recentUploads.filter(scan => scan.status === 'pending').length),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Awaiting approval")))),
        React.createElement(Card, { className: "card-medical" },
            React.createElement(CardHeader, { className: "flex flex-row items-center justify-between" },
                React.createElement("div", null,
                    React.createElement(CardTitle, { className: "text-xl" }, "Recent Uploads"),
                    React.createElement("p", { className: "text-muted-foreground" }, "Your latest scan submissions")),
                React.createElement(Button, { onClick: () => setIsUploadOpen(true), className: "btn-medical" },
                    React.createElement(Plus, { className: "w-4 h-4 mr-2" }),
                    "New Upload")),
            React.createElement(CardContent, { className: "space-y-4" }, recentUploads.length === 0 ? (React.createElement("div", { className: "text-center py-8 text-muted-foreground" },
                React.createElement(Upload, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
                React.createElement("p", { className: "text-lg mb-2" }, "No uploads yet"),
                React.createElement("p", { className: "text-sm" }, "Click \"New Upload\" to get started"))) : (React.createElement("div", { className: "space-y-3" }, recentUploads.map((scan) => (React.createElement("div", { key: scan.id, className: "flex items-center justify-between p-4 border border-border/50 rounded-lg hover:shadow-medical transition-medical" },
                React.createElement("div", { className: "flex items-center space-x-4" },
                    React.createElement("div", { className: "w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center" },
                        React.createElement(FileText, { className: "w-5 h-5 text-white" })),
                    React.createElement("div", null,
                        React.createElement("p", { className: "font-medium" }, scan.patientName),
                        React.createElement("p", { className: "text-sm text-muted-foreground" },
                            scan.scanType,
                            " \u2022 ",
                            new Date(scan.uploadDate).toLocaleDateString()))),
                React.createElement("div", { className: "flex items-center space-x-3" },
                    React.createElement(Badge, { className: getStatusColor(scan.status), variant: "secondary" },
                        scan.status === 'pending' && React.createElement(Clock, { className: "w-3 h-3 mr-1" }),
                        scan.status === 'approved' && React.createElement(CheckCircle, { className: "w-3 h-3 mr-1" }),
                        scan.status.charAt(0).toUpperCase() + scan.status.slice(1)),
                    React.createElement("span", { className: "text-sm text-muted-foreground" },
                        scan.imageFiles.length,
                        " files"))))))))),
        React.createElement(UploadDialog, { isOpen: isUploadOpen, onClose: () => setIsUploadOpen(false), onUploadSuccess: handleUploadSuccess })));
};
export default TechnicianDashboard;