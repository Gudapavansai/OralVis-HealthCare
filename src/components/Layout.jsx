import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    return (React.createElement("div", { className: "min-h-screen bg-gradient-subtle" },
        React.createElement("header", { className: "bg-card border-b border-border shadow-card sticky top-0 z-50 backdrop-blur-sm" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "flex justify-between items-center h-16" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement("div", { className: "w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medical" },
                                React.createElement(Stethoscope, { className: "w-5 h-5 text-white" })),
                            React.createElement("div", null,
                                React.createElement("h1", { className: "text-xl font-bold text-gradient" }, "ScanScribe"),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "Dental Management")))),
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", { className: "text-right hidden sm:block" },
                            React.createElement("p", { className: "text-sm font-medium text-foreground" }, user === null || user === void 0 ? void 0 : user.name),
                            React.createElement("p", { className: "text-xs text-muted-foreground capitalize" }, user === null || user === void 0 ? void 0 : user.role)),
                        React.createElement(Button, { variant: "outline", size: "sm", onClick: logout, className: "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-medical" },
                            React.createElement(LogOut, { className: "w-4 h-4 mr-2" }),
                            "Sign Out"))))),
        React.createElement("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, children)));
};
export default Layout;
// c:\Users\saip0\OneDrive\Desktop\Oravils\client\src\components\Layout.jsx