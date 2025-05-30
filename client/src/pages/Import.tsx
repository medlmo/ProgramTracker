import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import { FileSpreadsheet, Download, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Import() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: importHistory = [] } = useQuery({
    queryKey: ["/api/import/history"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/import/excel', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/import/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      
      setIsUploading(false);
      setUploadProgress(0);
      
      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Import terminé avec des erreurs",
          description: `${data.recordsImported} enregistrement(s) importé(s), ${data.errors.length} erreur(s)`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import réussi",
          description: `${data.recordsImported} enregistrement(s) importé(s) avec succès`,
        });
      }
    },
    onError: (error: Error) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Erreur d'import",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    uploadMutation.mutate(file);
  };

  const downloadTemplate = () => {
    // Create a simple template
    const template = [
      ['name', 'description', 'category', 'status', 'budget', 'startDate', 'endDate'],
      ['Programme Exemple', 'Description du programme', 'innovation', 'active', '100000', '2024-01-01', '2024-12-31'],
      ['', '', '', '', '', '', ''],
      ['name', 'description', 'programId', 'status', 'priority', 'budget', 'progress', 'startDate', 'deadline'],
      ['Projet Exemple', 'Description du projet', '1', 'in-progress', 'high', '50000', '50', '2024-01-01', '2024-06-30']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_rsm_programmes_projets.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Réussi</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Avec erreurs</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">En cours</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Importer des Données Excel</h1>
                <p className="text-sm text-slate-600">Importez vos programmes et projets depuis un fichier Excel</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Télécharger votre fichier Excel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  progress={uploadProgress}
                  accept=".xlsx,.xls"
                  maxSize={10 * 1024 * 1024} // 10MB
                />
              </CardContent>
            </Card>

            {/* Template Download */}
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>Besoin d'un modèle ?</strong> Téléchargez notre modèle Excel pour vous assurer que vos données sont dans le bon format.
                </div>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le modèle
                </Button>
              </AlertDescription>
            </Alert>

            {/* Format Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Format attendu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Pour les programmes :</h4>
                    <p className="text-sm text-slate-600 mb-2">Colonnes requises :</p>
                    <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                      <li><code>name</code> - Nom du programme</li>
                      <li><code>description</code> - Description (optionnel)</li>
                      <li><code>category</code> - Catégorie (innovation, digital, sustainability, formation)</li>
                      <li><code>status</code> - État (active, pending, completed)</li>
                      <li><code>budget</code> - Budget en euros</li>
                      <li><code>startDate</code> - Date de début (YYYY-MM-DD)</li>
                      <li><code>endDate</code> - Date de fin (YYYY-MM-DD, optionnel)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Pour les projets :</h4>
                    <p className="text-sm text-slate-600 mb-2">Colonnes requises :</p>
                    <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                      <li><code>name</code> - Nom du projet</li>
                      <li><code>description</code> - Description (optionnel)</li>
                      <li><code>programId</code> - ID du programme associé</li>
                      <li><code>status</code> - État (not-started, in-progress, completed, on-hold)</li>
                      <li><code>priority</code> - Priorité (high, medium, low)</li>
                      <li><code>budget</code> - Budget en euros</li>
                      <li><code>progress</code> - Progression en pourcentage (0-100)</li>
                      <li><code>startDate</code> - Date de début (YYYY-MM-DD)</li>
                      <li><code>deadline</code> - Date d'échéance (YYYY-MM-DD)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import History */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des imports</CardTitle>
              </CardHeader>
              <CardContent>
                {importHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucun import effectué</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {importHistory.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.filename}</div>
                            <div className="text-xs text-slate-500">
                              {item.recordsImported} enregistrement(s) importé(s)
                              {item.errors && ` • ${item.errors.length} erreur(s)`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(item.status)}
                          <div className="text-right">
                            <div className="text-sm text-slate-900">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
