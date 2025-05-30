import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Users, Target, Euro, TrendingUp, Plus, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import ProgramForm from "@/components/ProgramForm";
import ProjectForm from "@/components/ProjectForm";

export default function Dashboard() {
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const { data: statistics } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: programs } = useQuery({
    queryKey: ["/api/programs"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const recentPrograms = programs?.slice(0, 3) || [];
  const recentProjects = projects?.slice(0, 3) || [];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setShowProgramForm(true)} className="bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Programme
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Programmes</p>
                    <p className="text-3xl font-bold text-slate-900">{statistics?.totalPrograms || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+{statistics?.activePrograms || 0}</span>
                  <span className="text-slate-600 ml-2">actifs</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Projets Actifs</p>
                    <p className="text-3xl font-bold text-slate-900">{statistics?.activeProjects || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+{statistics?.completedProjects || 0}</span>
                  <span className="text-slate-600 ml-2">terminés</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Budget Total</p>
                    <p className="text-3xl font-bold text-slate-900">{Math.round((statistics?.totalBudget || 0) / 1000)}K€</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Euro className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-slate-600 ml-2">vs année dernière</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Progression Moyenne</p>
                    <p className="text-3xl font-bold text-slate-900">{statistics?.avgProgress || 0}%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+5%</span>
                  <span className="text-slate-600 ml-2">ce mois</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Programs */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Programmes Récents
                    <Button variant="outline" size="sm" onClick={() => window.location.href = "/programs"}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir tout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPrograms.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Aucun programme créé</p>
                      <Button onClick={() => setShowProgramForm(true)} className="mt-4" variant="outline">
                        Créer votre premier programme
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentPrograms.map((program: any) => (
                        <div key={program.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{program.name}</p>
                            <p className="text-sm text-slate-500">{program.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              program.status === 'active' ? 'bg-green-100 text-green-800' : 
                              program.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {program.status === 'active' ? 'Actif' : 
                               program.status === 'pending' ? 'En attente' : 'Terminé'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setShowProgramForm(true)}
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Programme
                  </Button>
                  <Button 
                    onClick={() => setShowProjectForm(true)}
                    variant="outline" 
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Projet
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/import"}
                    variant="outline" 
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Importer Excel
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projets Prioritaires</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentProjects.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500">Aucun projet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentProjects.map((project: any) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                            <p className="text-xs text-slate-500">Échéance: {new Date(project.deadline).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium ${
                              project.priority === 'high' ? 'text-red-600' :
                              project.priority === 'medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {project.priority === 'high' ? 'Haute' :
                               project.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </span>
                            <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showProgramForm && (
        <ProgramForm onClose={() => setShowProgramForm(false)} />
      )}
      
      {showProjectForm && (
        <ProjectForm onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
}
