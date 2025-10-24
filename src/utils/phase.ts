/**
 * Utility functions for working with phase paths and extracting phase information
 * 
 * Phase path represents the chain of previous phases:
 * - Base phase: phase_path = "" (empty)
 * - First child: phase_path = "base_phase_id"
 * - Second child: phase_path = "base_phase_id/first_child_id"
 * - Third child: phase_path = "base_phase_id/first_child_id/second_child_id"
 */

/**
 * Extracts the immediate previous phase ID from a phase path
 * Phase path format: <base_phase>/<child1>/<child2>/.../<immediate_previous>
 * The last item in the path is the immediate previous phase
 * 
 * @param phasePath - The phase path string
 * @returns The immediate previous phase ID or undefined if not found
 */
export function getPreviousPhaseId(phasePath: string): string | undefined {
  if (!phasePath || typeof phasePath !== 'string') {
    return undefined;
  }

  // Split by '/' and filter out empty strings
  const phases = phasePath.split('/').filter(phase => phase.trim() !== '');
  
  // If there are no phases, there's no previous phase
  if (phases.length === 0) {
    return undefined;
  }

  // Return the last phase (which is the immediate previous phase)
  return phases[phases.length - 1];
}

/**
 * Gets the phase path depth (number of phases in the path)
 * 
 * @param phasePath - The phase path string
 * @returns The number of phases in the path
 */
export function getPhasePathDepth(phasePath: string): number {
  if (!phasePath || typeof phasePath !== 'string') {
    return 0;
  }

  const phases = phasePath.split('/').filter(phase => phase.trim() !== '');
  return phases.length;
}

/**
 * Checks if a phase path has a previous phase
 * 
 * @param phasePath - The phase path string
 * @returns True if there is a previous phase, false otherwise
 */
export function hasPreviousPhase(phasePath: string): boolean {
  return getPhasePathDepth(phasePath) > 0;
}

/**
 * Gets the root phase ID (first phase in the path)
 * 
 * @param phasePath - The phase path string
 * @returns The root phase ID or undefined if not found
 */
export function getRootPhaseId(phasePath: string): string | undefined {
  if (!phasePath || typeof phasePath !== 'string') {
    return undefined;
  }

  const phases = phasePath.split('/').filter(phase => phase.trim() !== '');
  
  if (phases.length === 0) {
    return undefined;
  }

  return phases[0];
}

/**
 * Gets the base phase ID (the original phase that started the chain)
 * This is the same as getRootPhaseId for the phase path structure
 * 
 * @param phasePath - The phase path string
 * @returns The base phase ID or undefined if not found
 */
export function getBasePhaseId(phasePath: string): string | undefined {
  return getRootPhaseId(phasePath);
}

/**
 * Gets all previous phase IDs in the chain (excluding the current phase)
 * 
 * @param phasePath - The phase path string
 * @returns Array of all previous phase IDs in order from base to immediate previous
 */
export function getAllPreviousPhaseIds(phasePath: string): string[] {
  if (!phasePath || typeof phasePath !== 'string') {
    return [];
  }

  return phasePath.split('/').filter(phase => phase.trim() !== '');
}

/**
 * Checks if a phase path represents a base phase (empty path)
 * 
 * @param phasePath - The phase path string
 * @returns True if this is a base phase, false otherwise
 */
export function isBasePhase(phasePath: string): boolean {
  if (!phasePath || typeof phasePath !== 'string') {
    return true; // Empty or null is considered base phase
  }

  return phasePath.trim() === '';
}

/**
 * Gets the generation level of a phase (how many levels deep from base)
 * Base phase = 0, first child = 1, second child = 2, etc.
 * 
 * @param phasePath - The phase path string
 * @returns The generation level (0 for base, 1+ for children)
 */
export function getPhaseGenerationLevel(phasePath: string): number {
  if (isBasePhase(phasePath)) {
    return 0;
  }

  return getPhasePathDepth(phasePath);
}
