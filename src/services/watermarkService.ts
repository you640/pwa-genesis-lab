/**
 * 🔒 Image Watermark Protection Module
 * Automatically adds "THE FORGE" watermark to all product images
 */

import React from 'react';

export class WatermarkService {
    private static canvas: HTMLCanvasElement | null = null;
    private static ctx: CanvasRenderingContext2D | null = null;

    /**
     * Initialize canvas for watermarking
     */
    private static initCanvas(): void {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
    }

    /**
     * Add watermark to image URL
     * @param imageUrl - Original image URL
     * @param watermarkText - Text to overlay (default: "THE FORGE")
     * @returns Promise<string> - Watermarked image as data URL
     */
    static async addWatermark(
        imageUrl: string,
        watermarkText: string = 'THE FORGE'
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            this.initCanvas();

            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS

            img.onload = () => {
                if (!this.canvas || !this.ctx) {
                    reject(new Error('Canvas not initialized'));
                    return;
                }

                // Set canvas size to image size
                this.canvas.width = img.width;
                this.canvas.height = img.height;

                // Draw original image
                this.ctx.drawImage(img, 0, 0);

                // Configure watermark style
                const fontSize = Math.max(img.width / 15, 20);
                this.ctx.font = `bold ${fontSize}px Teko, sans-serif`;
                this.ctx.fillStyle = 'rgba(163, 230, 53, 0.3)'; // Lime-400 with transparency
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // Add diagonal watermark pattern
                this.ctx.save();
                this.ctx.translate(img.width / 2, img.height / 2);
                this.ctx.rotate(-Math.PI / 6); // -30 degrees

                // Draw multiple watermarks for better coverage
                const positions = [
                    { x: 0, y: 0 },
                    { x: -img.width / 3, y: -img.height / 3 },
                    { x: img.width / 3, y: img.height / 3 },
                ];

                positions.forEach(pos => {
                    this.ctx!.strokeText(watermarkText, pos.x, pos.y);
                    this.ctx!.fillText(watermarkText, pos.x, pos.y);
                });

                this.ctx.restore();

                // Add small corner watermark
                this.ctx.font = `bold ${fontSize / 2}px Teko, sans-serif`;
                this.ctx.fillStyle = 'rgba(163, 230, 53, 0.6)';
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'bottom';
                this.ctx.fillText(
                    '© THE FORGE',
                    img.width - 10,
                    img.height - 10
                );

                // Convert to data URL
                const watermarkedUrl = this.canvas.toDataURL('image/jpeg', 0.9);
                resolve(watermarkedUrl);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };

            img.src = imageUrl;
        });
    }

    /**
     * Batch watermark multiple images
     * @param imageUrls - Array of image URLs
     * @returns Promise<Map<string, string>> - Map of original URL to watermarked URL
     */
    static async batchWatermark(imageUrls: string[]): Promise<Map<string, string>> {
        const results = new Map<string, string>();

        for (const url of imageUrls) {
            try {
                const watermarkedUrl = await this.addWatermark(url);
                results.set(url, watermarkedUrl);
            } catch (error) {
                console.error(`Failed to watermark ${url}:`, error);
                results.set(url, url); // Fallback to original
            }
        }

        return results;
    }

    /**
     * Disable right-click on images (prevent save)
     */
    static protectImages(): void {
        document.addEventListener('contextmenu', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                e.preventDefault();
                console.log('🔒 Image protection active');
            }
        });

        // Disable drag & drop for images
        document.addEventListener('dragstart', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    /**
     * Add CSS-based watermark overlay (lighter alternative)
     */
    static addCSSWatermark(imageElement: HTMLImageElement): void {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        const watermark = document.createElement('div');
        watermark.textContent = 'THE FORGE';
        watermark.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: 'Teko', sans-serif;
      font-size: 3rem;
      font-weight: bold;
      color: rgba(163, 230, 53, 0.3);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      user-select: none;
      z-index: 10;
    `;

        imageElement.parentNode?.insertBefore(wrapper, imageElement);
        wrapper.appendChild(imageElement);
        wrapper.appendChild(watermark);
    }
}

/**
 * React Hook for watermarked images
 */
export const useWatermark = (imageUrl: string | undefined) => {
    const [watermarkedUrl, setWatermarkedUrl] = React.useState<string | undefined>(imageUrl);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!imageUrl) return;

        const applyWatermark = async () => {
            setIsLoading(true);
            try {
                const result = await WatermarkService.addWatermark(imageUrl);
                setWatermarkedUrl(result);
            } catch (error) {
                console.error('Watermark failed:', error);
                setWatermarkedUrl(imageUrl); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        applyWatermark();
    }, [imageUrl]);

    return { watermarkedUrl, isLoading };
};

// Auto-protect images on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        WatermarkService.protectImages();
    });
}
