import {
  users,
  programs,
  projects,
  importHistory,
  type User,
  type UpsertUser,
  type Program,
  type InsertProgram,
  type Project,
  type InsertProject,
  type ImportHistory,
  type InsertImportHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Program operations
  getPrograms(userId: string): Promise<Program[]>;
  getProgramById(id: number, userId: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram, userId: string): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>, userId: string): Promise<Program | undefined>;
  deleteProgram(id: number, userId: string): Promise<boolean>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProjectsByProgram(programId: number, userId: string): Promise<Project[]>;
  getProjectById(id: number, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject, userId: string): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>, userId: string): Promise<Project | undefined>;
  deleteProject(id: number, userId: string): Promise<boolean>;
  
  // Import history operations
  getImportHistory(userId: string): Promise<ImportHistory[]>;
  createImportRecord(importRecord: InsertImportHistory, userId: string): Promise<ImportHistory>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Program operations
  async getPrograms(userId: string): Promise<Program[]> {
    return await db
      .select()
      .from(programs)
      .where(eq(programs.userId, userId))
      .orderBy(desc(programs.createdAt));
  }

  async getProgramById(id: number, userId: string): Promise<Program | undefined> {
    const [program] = await db
      .select()
      .from(programs)
      .where(and(eq(programs.id, id), eq(programs.userId, userId)));
    return program;
  }

  async createProgram(program: InsertProgram, userId: string): Promise<Program> {
    const [newProgram] = await db
      .insert(programs)
      .values({ ...program, userId })
      .returning();
    return newProgram;
  }

  async updateProgram(id: number, program: Partial<InsertProgram>, userId: string): Promise<Program | undefined> {
    const [updatedProgram] = await db
      .update(programs)
      .set({ ...program, updatedAt: new Date() })
      .where(and(eq(programs.id, id), eq(programs.userId, userId)))
      .returning();
    return updatedProgram;
  }

  async deleteProgram(id: number, userId: string): Promise<boolean> {
    // First delete associated projects
    await db
      .delete(projects)
      .where(and(eq(projects.programId, id), eq(projects.userId, userId)));
    
    const result = await db
      .delete(programs)
      .where(and(eq(programs.id, id), eq(programs.userId, userId)));
    
    return result.rowCount > 0;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectsByProgram(programId: number, userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.programId, programId), eq(projects.userId, userId)))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectById(id: number, userId: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project;
  }

  async createProject(project: InsertProject, userId: string): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({ ...project, userId })
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>, userId: string): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    
    return result.rowCount > 0;
  }

  // Import history operations
  async getImportHistory(userId: string): Promise<ImportHistory[]> {
    return await db
      .select()
      .from(importHistory)
      .where(eq(importHistory.userId, userId))
      .orderBy(desc(importHistory.createdAt));
  }

  async createImportRecord(importRecord: InsertImportHistory, userId: string): Promise<ImportHistory> {
    const [newImport] = await db
      .insert(importHistory)
      .values({ ...importRecord, userId })
      .returning();
    return newImport;
  }
}

export const storage = new DatabaseStorage();
