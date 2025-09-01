import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image as Gallery, FileText, Clock, CheckCircle, Search, Eye, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ScanViewer from '@/components/ScanViewer';
const DentistDashboard = () => {
    const { user } = useAuth();
    const [scans, setScans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScan, setSelectedScan] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    // Load scans from localStorage
    useEffect(() => {
        const storedScans = localStorage.getItem('dentalApp_scans');
        if (storedScans) {
            try {
                const allScans = JSON.parse(storedScans);
                setScans(allScans);
            }
            catch (error) {
                console.error('Error loading scans:', error);
            }
        }
    }, []);
    const filteredScans = scans.filter(scan => scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.scanType.toLowerCase().includes(searchTerm.toLowerCase()));
    const pendingScans = scans.filter(scan => scan.status === 'pending');
    const approvedScans = scans.filter(scan => scan.status === 'approved');
    const totalPatients = new Set(scans.map(scan => scan.patientId)).size;
    const handleViewScan = (scan) => {
        setSelectedScan(scan);
        setIsViewerOpen(true);
    };
    const updateScanStatus = (scanId, newStatus) => {
        const updatedScans = scans.map(scan => scan.id === scanId ? Object.assign(Object.assign({}, scan), { status: newStatus }) : scan);
        setScans(updatedScans);
        localStorage.setItem('dentalApp_scans', JSON.stringify(updatedScans));
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
                "Welcome, Dr. ", user === null || user === void 0 ? void 0 :
                user.name),
            React.createElement("p", { className: "text-muted-foreground" }, "Review patient scans and manage your practice")),
        React.createElement("div", { className: "grid gap-4 md:grid-cols-4" },
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Total Scans"),
                    React.createElement(Gallery, { className: "h-4 w-4 text-primary" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, scans.length),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "All submissions"))),
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Patients"),
                    React.createElement(Users, { className: "h-4 w-4 text-accent" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, totalPatients),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Unique patients"))),
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Pending Review"),
                    React.createElement(Clock, { className: "h-4 w-4 text-warning" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, pendingScans.length),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Needs attention"))),
            React.createElement(Card, { className: "card-medical" },
                React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium" }, "Approved"),
                    React.createElement(CheckCircle, { className: "h-4 w-4 text-success" })),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "text-2xl font-bold" }, approvedScans.length),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Completed reviews")))),
        React.createElement(Card, { className: "card-medical" },
            React.createElement(CardHeader, null,
                React.createElement(CardTitle, { className: "text-xl" }, "Patient Scans")),
            React.createElement(CardContent, { className: "space-y-4" },
                React.createElement("div", { className: "flex items-center space-x-4" },
                    React.createElement("div", { className: "relative flex-1" },
                        React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" }),
                        React.createElement(Input, { placeholder: "Search by patient name or scan type...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 transition-medical focus:shadow-medical" }))),
                React.createElement("div", { className: "space-y-3" }, filteredScans.length === 0 ? (React.createElement("div", { className: "text-center py-8 text-muted-foreground" },
                    React.createElement(Gallery, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
                    React.createElement("p", { className: "text-lg mb-2" }, searchTerm ? 'No scans match your search' : 'No scans available'),
                    React.createElement("p", { className: "text-sm" }, searchTerm ? 'Try adjusting your search terms' : 'Scans will appear here once technicians upload them'))) : (React.createElement("div", { className: "grid gap-3" }, filteredScans.map((scan) => (React.createElement("div", { key: scan.id, className: "flex items-center justify-between p-4 border border-border/50 rounded-lg hover:shadow-medical transition-medical" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", { className: "w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center" },
                            React.createElement(FileText, { className: "w-6 h-6 text-white" })),
                        React.createElement("div", null,
                            React.createElement("p", { className: "font-medium text-lg" }, scan.patientName),
                            React.createElement("div", { className: "flex items-center space-x-4 text-sm text-muted-foreground" },
                                React.createElement("span", { className: "capitalize" }, scan.scanType),
                                React.createElement("span", null, "\u2022"),
                                React.createElement("span", { className: "flex items-center" },
                                    React.createElement(Calendar, { className: "w-3 h-3 mr-1" }),
                                    new Date(scan.uploadDate).toLocaleDateString()),
                                React.createElement("span", null, "\u2022"),
                                React.createElement("span", null,
                                    scan.imageFiles.length,
                                    " files")),
                            scan.notes && (React.createElement("p", { className: "text-sm text-muted-foreground mt-1 max-w-md truncate" }, scan.notes)))),
                    React.createElement("div", { className: "flex items-center space-x-3" },
                        React.createElement(Badge, { className: getStatusColor(scan.status), variant: "secondary" },
                            scan.status === 'pending' && React.createElement(Clock, { className: "w-3 h-3 mr-1" }),
                            scan.status === 'approved' && React.createElement(CheckCircle, { className: "w-3 h-3 mr-1" }),
                            scan.status.charAt(0).toUpperCase() + scan.status.slice(1)),
                        React.createElement(Button, { variant: "outline", size: "sm", onClick: () => handleViewScan(scan), className: "hover:bg-primary/10 hover:border-primary/30 hover:text-primary" },
                            React.createElement(Eye, { className: "w-4 h-4 mr-2" }),
                            "View")))))))))),
        selectedScan && (React.createElement(ScanViewer, { scan: selectedScan, isOpen: isViewerOpen, onClose: () => setIsViewerOpen(false), onStatusUpdate: updateScanStatus }))));
};
export default DentistDashboard;