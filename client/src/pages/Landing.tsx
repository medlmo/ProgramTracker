import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartLine, Users, Target, FileSpreadsheet } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ChartLine className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">RSM Dev. Eco</span>
            </div>
            <Button onClick={handleLogin} className="bg-primary-600 hover:bg-primary-700">
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
            Gestion des Programmes
            <span className="block text-primary-600">RSM Dev. Eco</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Suivez et gérez vos programmes de développement économique avec notre solution complète d'analyse et de reporting.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestion des Programmes</h3>
                <p className="text-sm text-slate-600">
                  Créez et suivez vos programmes de développement économique
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Suivi des Projets</h3>
                <p className="text-sm text-slate-600">
                  Gérez les projets liés à vos programmes avec des tableaux de bord détaillés
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Import Excel</h3>
                <p className="text-sm text-slate-600">
                  Importez vos données depuis Excel pour une migration facile
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ChartLine className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyses & Rapports</h3>
                <p className="text-sm text-slate-600">
                  Visualisez les performances avec des rapports détaillés
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-600 rounded-2xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Prêt à optimiser votre gestion ?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Connectez-vous pour accéder à votre tableau de bord personnalisé
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            variant="secondary"
            className="mt-8 bg-white text-primary-600 hover:bg-slate-50"
          >
            Accéder au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
}
