import { useState, useEffect } from 'react';
import { fetchBlob } from '../config/api';

/**
 * Custom hook to fetch a protected asset (image/audio) with API key in headers.
 * Returns a temporary URL.createObjectURL link.
 */
export function useSecureAsset(path: string | undefined) {
    const [assetUrl, setAssetUrl] = useState<string>('');

    useEffect(() => {
        if (!path) {
            setAssetUrl('');
            return;
        }

        // If it's already an absolute external URL, just use it
        if (path.startsWith('http')) {
            setAssetUrl(path);
            return;
        }

        // The '/tracks/' endpoint is intentionally public (unprotected by apiKeyAuth).
        // Fetching large MP3s directly natively supports streaming (206 Partial Content) 
        // and avoids the heavy RAM overhead and CORS bugs of Axios Blob fetching.
        if (path.startsWith('/tracks/')) {
            import('../config/api').then(({ API_BASE_URL }) => {
                setAssetUrl(`${API_BASE_URL}${path}`);
            });
            return;
        }

        let isMounted = true;
        fetchBlob(path)
            .then(blobUrl => {
                if (isMounted) setAssetUrl(blobUrl);
            })
            .catch(err => {
                console.error('Failed to fetch secure asset:', path, err);
                if (isMounted) setAssetUrl('');
            });

        return () => {
            isMounted = false;
            // Clean up revocation of the blob URL to prevent memory leaks
            if (assetUrl && assetUrl.startsWith('blob:')) {
                URL.revokeObjectURL(assetUrl);
            }
        };
    }, [path]);

    return assetUrl;
}

/**
 * Reusable component for rendering images protected by API key headers.
 */
export function SecureImage({ path, alt, className }: { path: string; alt?: string; className?: string }) {
    const src = useSecureAsset(path);

    if (!src && path) {
        return <div className={`animate-pulse bg-zinc-800 ${className}`} />;
    }

    return <img src={src} alt={alt} className={className} />;
}
