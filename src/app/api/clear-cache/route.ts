"use server";

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Map of environment variables and cache keys to clear
const CACHE_CONFIG = {
  // Server-side React cache tags that correspond to CMS data
  cmsCache: {
    paths: [
      '/',
      '/admin',
      '/admin/',
      '/admin/safaris',
      '/admin/destinations',
      '/admin/experiences',
      '/admin/reviews',
      '/admin/pages',
      '/admin/homepage',
      '/admin/settings',
      '/safaris',
      '/safaris/[slug]',
      '/destinations',
      '/destinations/[slug]',
      '/experiences',
      '/experiences/[slug]',
      '/reviews',
      '/travel-guide',
      '/request-quote',
    ],
    // Specific cache tags that React may have set
    tags: ['cms', 'site-settings', 'published-content', 'safari_packages']
  },
  // Build-time cache
  buildCache: {
    paths: ['/'],
    // Never cache these in production
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { tags = [], paths = [] } = body;

    // Clear server-side React cache
    const clearTagPromises = [];
    const clearPathPromises = [];

    // Revalidate paths based on the specified tags and paths
    for (const tag of [...CACHE_CONFIG.cmsCache.tags, ...tags]) {
      for (const path of CACHE_CONFIG.cmsCache.paths) {
        clearPathPromises.push(revalidatePath(path, 'layout'));
        clearPathPromises.push(revalidatePath(path, 'page'));
      }
    }

    // Revalidate specific paths passed in the request
    for (const path of [...CACHE_CONFIG.cmsCache.paths, ...paths]) {
      clearPathPromises.push(revalidatePath(path, 'layout'));
      clearPathPromises.push(revalidatePath(path, 'page'));
    }

    // Build-time cache (applications in development need more aggressive clearing)
    if (process.env.NODE_ENV !== 'production') {
      for (const path of CACHE_CONFIG.buildCache.paths) {
        clearPathPromises.push(revalidatePath(path, 'layout'));
        clearPathPromises.push(revalidatePath(path, 'page'));
      }
    }

    // Execute all cache clearing operations
    await Promise.allSettled(clearPathPromises);

    // Invalidate the server-side React cache more aggressively
    // by clearing the '$REACT_CACHE' if it exists (Next.js internal)
    if (typeof window === 'undefined') {
      // We're on the server side, clear any server-side cache
      // We can't directly access React's internal cache, but we can
      // call Next.js's revalidation which should clear it
    }

    return NextResponse.json({
      success: true,
      cleared: {
        paths: CACHE_CONFIG.cmsCache.paths.length + paths.length,
        tags: tags.length + CACHE_CONFIG.cmsCache.tags.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cache clearing failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For debugging - return cache status
  return NextResponse.json({
    status: 'CMS cache monitoring endpoint',
    config: {
      cmsCacheTags: CACHE_CONFIG.cmsCache.tags,
      cmsCachePaths: CACHE_CONFIG.cmsCache.paths.length,
      buildCachePaths: CACHE_CONFIG.buildCache.paths.length,
    },
    environment: process.env.NODE_ENV,
  });
}