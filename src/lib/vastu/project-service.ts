import { supabase } from '../supabase/client';
import type { ProjectState } from './project-context';

export interface SavedProject {
  id: string;
  user_id: string;
  name: string;
  client_name: string;
  data: ProjectState;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Save current project to database
 */
export async function saveProject(
  projectData: ProjectState,
  thumbnail?: string
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase.from('projects') as any
    )
      .insert({
        user_id: user.id,
        name: projectData.projectName,
        client_name: projectData.clientName,
        data: projectData,
        thumbnail: thumbnail || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, projectId: data.id };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save project' 
    };
  }
}

/**
 * Update existing project
 */
export async function updateProject(
  projectId: string,
  projectData: ProjectState,
  thumbnail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase.from('projects') as any
    )
      .update({
        name: projectData.projectName,
        client_name: projectData.clientName,
        data: projectData,
        thumbnail: thumbnail || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update project' 
    };
  }
}

/**
 * Load project by ID
 */
export async function loadProject(
  projectId: string
): Promise<{ success: boolean; project?: SavedProject; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, project: data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to load project' 
    };
  }
}

/**
 * Get all projects for current user
 */
export async function getUserProjects(): Promise<{ 
  success: boolean; 
  projects?: SavedProject[]; 
  error?: string 
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, projects: data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch projects' 
    };
  }
}

/**
 * Delete project by ID
 */
export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete project' 
    };
  }
}
