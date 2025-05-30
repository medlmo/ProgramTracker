import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProgramSchema, insertProjectSchema, insertImportHistorySchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import * as XLSX from "xlsx";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Program routes
  app.get("/api/programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programs = await storage.getPrograms(userId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const program = await storage.getProgramById(id, userId);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData, userId);
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating program:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validatedData, userId);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error updating program:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.delete("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const success = await storage.deleteProgram(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Project routes
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programId = req.query.programId;
      
      let projects;
      if (programId) {
        projects = await storage.getProjectsByProgram(parseInt(programId), userId);
      } else {
        projects = await storage.getProjects(userId);
      }
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData, userId);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Import routes
  app.post("/api/import/excel", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read Excel file
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      let recordsImported = 0;
      const errors: string[] = [];

      // Process data
      for (const row of data) {
        try {
          // Check if it's a program or project based on data structure
          if (row.hasOwnProperty('name') && row.hasOwnProperty('budget')) {
            if (row.hasOwnProperty('category')) {
              // It's a program
              const programData = {
                name: row.name,
                description: row.description || '',
                category: row.category,
                status: row.status || 'active',
                budget: row.budget.toString(),
                startDate: row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                endDate: row.endDate ? new Date(row.endDate).toISOString().split('T')[0] : null,
              };
              
              const validatedProgram = insertProgramSchema.parse(programData);
              await storage.createProgram(validatedProgram, userId);
              recordsImported++;
            } else if (row.hasOwnProperty('programId')) {
              // It's a project
              const projectData = {
                name: row.name,
                description: row.description || '',
                programId: parseInt(row.programId),
                status: row.status || 'not-started',
                priority: row.priority || 'medium',
                budget: row.budget.toString(),
                progress: parseInt(row.progress) || 0,
                startDate: row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              };
              
              const validatedProject = insertProjectSchema.parse(projectData);
              await storage.createProject(validatedProject, userId);
              recordsImported++;
            }
          }
        } catch (error) {
          errors.push(`Row ${data.indexOf(row) + 1}: ${error.message}`);
        }
      }

      // Create import record
      const importRecord = {
        filename: req.file.originalname,
        status: errors.length > 0 ? 'partial' : 'success',
        recordsImported,
        errors: errors.length > 0 ? errors : null,
      };

      const savedImport = await storage.createImportRecord(importRecord, userId);

      res.json({
        message: "Import completed",
        recordsImported,
        errors: errors.length > 0 ? errors : null,
        importId: savedImport.id,
      });

    } catch (error) {
      console.error("Error importing Excel file:", error);
      res.status(500).json({ message: "Failed to import Excel file" });
    }
  });

  app.get("/api/import/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getImportHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({ message: "Failed to fetch import history" });
    }
  });

  // Statistics route
  app.get("/api/statistics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const programs = await storage.getPrograms(userId);
      const projects = await storage.getProjects(userId);

      const stats = {
        totalPrograms: programs.length,
        activePrograms: programs.filter(p => p.status === 'active').length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in-progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalBudget: programs.reduce((sum, p) => sum + parseFloat(p.budget || '0'), 0),
        avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
