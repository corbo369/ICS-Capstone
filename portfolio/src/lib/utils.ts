/**
 * @file Shadcn Utility File
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
