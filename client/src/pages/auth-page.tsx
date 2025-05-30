import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartLine, Users, Target, FileSpreadsheet } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { username: string; password: string; email?: string; firstName?: string; lastName?: string }) => {
      const response = await apiRequest("POST", "/api/register", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!username || !password) {
      toast({
        title: "Erreur",
        description: "Nom d'utilisateur et mot de passe requis",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({ username, password, email, firstName, lastName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <ChartLine className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">RSM Dev. Eco</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue</h1>
            <p className="text-slate-600">Accédez à votre plateforme de gestion</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-username">Nom d'utilisateur</Label>
                      <Input
                        id="login-username"
                        name="username"
                        type="text"
                        required
                        placeholder="Votre nom d'utilisateur"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        required
                        placeholder="Votre mot de passe"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean.dupont@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-username">Nom d'utilisateur *</Label>
                      <Input
                        id="register-username"
                        name="username"
                        type="text"
                        required
                        placeholder="jdupont"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Mot de passe *</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        required
                        placeholder="Minimum 6 caractères"
                        minLength={6}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Gestion des Programmes
            <span className="block text-primary-600">RSM Dev. Eco</span>
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Suivez et gérez vos programmes de développement économique avec notre solution complète d'analyse et de reporting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Gestion des Programmes</h3>
              <p className="text-sm text-slate-600">
                Créez et suivez vos programmes de développement économique
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Suivi des Projets</h3>
              <p className="text-sm text-slate-600">
                Gérez les projets liés à vos programmes avec des tableaux de bord détaillés
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Import Excel</h3>
              <p className="text-sm text-slate-600">
                Importez vos données depuis Excel pour une migration facile
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartLine className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Analyses & Rapports</h3>
              <p className="text-sm text-slate-600">
                Visualisez les performances avec des rapports détaillés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}