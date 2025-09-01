import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UploadDialog = ({ isOpen, onClose, onUploadSuccess }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [scanType, setScanType] = useState('intraoral');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length !== selectedFiles.length) {
      console.warn('Invalid file(s) detected: Please upload only image files');
    }

    setFiles((prev) => [...prev, ...imageFiles]);

    // Create previews
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPreviews((prev) => [...prev, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !patientPhone || files.length === 0) {
      console.warn('Missing required info: Name, phone, or files');
      return;
    }

    setIsUploading(true);

    try {
      // Create patient data
      const patient = {
        id: `patient_${Date.now()}`,
        name: patientName,
        phoneNumber: patientPhone,
        email: patientEmail,
        dateOfBirth: patientDOB,
      };

      // Process files
      const fileDataArray = await Promise.all(
        files.map(
          (file, index) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  id: `file_${Date.now()}_${index}`,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  dataUrl: reader.result,
                  thumbnailUrl: reader.result,
                });
              };
              reader.readAsDataURL(file);
            })
        )
      );

      // Create scan upload
      const scanUpload = {
        id: `scan_${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        scanType,
        uploadDate: new Date().toISOString(),
        uploadedBy: (user && user.name) || 'Unknown',
        technicianId: (user && user.id) || '',
        imageFiles: fileDataArray,
        notes,
        status: 'pending',
      };

      // Save to localStorage
      const existingScans = localStorage.getItem('dentalApp_scans');
      const scans = existingScans ? JSON.parse(existingScans) : [];
      scans.push(scanUpload);
      localStorage.setItem('dentalApp_scans', JSON.stringify(scans));

      // Save patient
      const existingPatients = localStorage.getItem('dentalApp_patients');
      const patients = existingPatients ? JSON.parse(existingPatients) : [];
      patients.push(patient);
      localStorage.setItem('dentalApp_patients', JSON.stringify(patients));

      // Reset form
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
      setPatientDOB('');
      setNotes('');
      setFiles([]);
      setPreviews([]);

      if (onUploadSuccess) {
        onUploadSuccess(scanUpload);
      }

      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Scan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Info */}
          <div className="space-y-2">
            <h3 className="font-medium">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name*</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhone">Phone Number*</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientDOB">Date of Birth</Label>
                <Input
                  id="patientDOB"
                  type="date"
                  value={patientDOB}
                  onChange={(e) => setPatientDOB(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Scan Info */}
          <div className="space-y-2">
            <h3 className="font-medium">Scan Information</h3>
            <div className="space-y-2">
              <Label htmlFor="scanType">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intraoral">Intraoral</SelectItem>
                  <SelectItem value="extraoral">Extraoral</SelectItem>
                  <SelectItem value="panoramic">Panoramic</SelectItem>
                  <SelectItem value="cbct">CBCT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional scan info"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <h3 className="font-medium">Upload Images</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  {files.length === 0
                    ? 'Drag and drop images here or click to browse'
                    : `${files.length} file(s) selected`}
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*"
                />
              </label>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Scan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
