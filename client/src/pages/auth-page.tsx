import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartLine, Users, Target } from "lucide-react";
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
                  variant="outline"
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 border-slate-200"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
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
          </div>
        </div>
      </div>
    </div>
  );
}